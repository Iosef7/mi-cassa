import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const token = await getToken({ req: req as any, secret: process.env.AUTH_SECRET || "mi_cassa_super_secret_fallback_2026", secureCookie: process.env.NODE_ENV === "production" });

    if (!token) {
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
    const token = await getToken({ req: req as any, secret: process.env.AUTH_SECRET || "mi_cassa_super_secret_fallback_2026", secureCookie: process.env.NODE_ENV === "production" });

    if (!token || (token.role !== "ADMIN" && token.role !== "AGENT")) {
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
