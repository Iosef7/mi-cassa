import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const projects = await prisma.developmentProject.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { properties: true, tasks: true }
        }
      },
    });

    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Error al obtener proyectos", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "AGENT")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await req.json();

    const project = await prisma.developmentProject.create({
      data: {
        name: data.name,
        location: data.location,
        architect: data.architect,
        totalUnits: data.totalUnits ? parseInt(data.totalUnits) : null,
        floors: data.floors ? parseInt(data.floors) : null,
        description: data.description,
        status: data.status || "EVALUACION",
        dealType: data.dealType,
        ownershipShare: data.ownershipShare ? parseFloat(data.ownershipShare) : null,
        estimatedCost: data.estimatedCost || null,
        expectedRevenue: data.expectedRevenue ? parseFloat(data.expectedRevenue) : null,
        driveFolderId: data.driveFolderId,
        attachments: data.attachments, // Ahora pasaremos el JSON stringificado aquí
        notes: data.notes,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Error al crear el proyecto", details: error.message },
      { status: 500 }
    );
  }
}
