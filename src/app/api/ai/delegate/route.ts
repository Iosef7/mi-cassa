import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { prompt, currentUserId } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Fetch agents and leads to provide context to the AI
    const agents = await prisma.user.findMany({ select: { id: true, name: true, role: true } });
    const leads = await prisma.lead.findMany({ select: { id: true, name: true } });
    
    // Find the current user name for self-referential mapping
    const currentUser = agents.find(a => a.id === currentUserId);

    const systemPrompt = `You are an advanced Task Delegation AI.
Your goal is to parse natural language instructions containing ONE or MORE tasks, and extract them into a JSON array of tasks.

You have access to the following team members (agents):
${JSON.stringify(agents)}

You have access to the following clients (leads):
${JSON.stringify(leads)}

The user requesting this is: ${currentUser?.name || 'Unknown'} (ID: ${currentUserId}). 
If the user uses words like "yo", "mí", "mi", "me", "recuérdame", "recordarme", it refers to this user.

Given the prompt, return a JSON array containing objects with the following fields:
- title: The task title
- assignedTo: The ID of the agent this task should be assigned to. Map names correctly. If it refers to "me", use ${currentUserId}.
- leadId: The ID of the lead this task is related to, based on the name mentioned. If no lead is mentioned, return null.
- dueDate: An ISO timestamp representing the due date. Current time is ${new Date().toISOString()}.
- isImportant: true if the text implies urgency or high importance, else false.

Return ONLY a valid JSON array of objects. Do not include markdown formatting or backticks around the json.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
        }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No text returned from AI");
    }
    const tasksData = JSON.parse(text);

    if (!Array.isArray(tasksData)) {
      throw new Error("AI did not return an array of tasks.");
    }

    // Create the tasks in parallel
    const createdTasks = await Promise.all(tasksData.map(async (taskObj) => {
      return prisma.task.create({
        data: {
          title: taskObj.title || prompt,
          assignedTo: taskObj.assignedTo || null,
          leadId: taskObj.leadId || null,
          dueDate: taskObj.dueDate ? new Date(taskObj.dueDate) : null,
          isImportant: taskObj.isImportant || false,
        },
        include: {
          agent: true,
          lead: true,
        }
      });
    }));

    return NextResponse.json(createdTasks);
  } catch (error) {
    console.error("AI Delegation Error:", error);
    return NextResponse.json({ error: "Failed to process AI delegation" }, { status: 500 });
  }
}
