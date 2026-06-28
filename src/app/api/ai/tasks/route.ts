import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma';

// Ensure the API key is set in .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Fetch agents and leads to provide context to the AI
    const agents = await prisma.user.findMany({ select: { id: true, name: true, role: true } });
    const leads = await prisma.lead.findMany({ select: { id: true, name: true } });

    const systemPrompt = `You are a smart task delegation AI. Your goal is to extract task information from user input.
You have access to the following team members (agents):
${JSON.stringify(agents)}

You have access to the following clients (leads):
${JSON.stringify(leads)}

Given the user prompt, return a JSON object with the following fields:
- title: The task title
- assignedTo: The ID of the agent this task should be assigned to, based on the name mentioned. If no agent is mentioned, return null.
- leadId: The ID of the lead this task is related to, based on the name mentioned. If no lead is mentioned, return null.
- dueDate: An ISO timestamp representing the due date. Current time is ${new Date().toISOString()}.
- isImportant: true if the text implies urgency or high importance, else false.

Return ONLY valid JSON.`;

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
    const result = JSON.parse(text);

    // Create the task
    const task = await prisma.task.create({
      data: {
        title: result.title || prompt,
        assignedTo: result.assignedTo,
        leadId: result.leadId,
        dueDate: result.dueDate ? new Date(result.dueDate) : null,
        isImportant: result.isImportant || false,
      },
      include: {
        agent: true,
        lead: true,
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("AI Task Error:", error);
    return NextResponse.json({ error: "Failed to process AI task" }, { status: 500 });
  }
}
