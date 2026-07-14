import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const project = await prisma.developmentProject.findUnique({
      where: { id: id },
      include: {
        properties: true,
        tasks: {
          include: {
            agent: true,
          }
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Error al obtener proyecto", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "AGENT")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    const project = await prisma.developmentProject.update({
      where: { id: id },
      data: {
        name: data.name,
        location: data.location,
        architect: data.architect,
        totalUnits: data.totalUnits !== undefined ? (data.totalUnits === null ? null : parseInt(data.totalUnits)) : undefined,
        floors: data.floors !== undefined ? (data.floors === null ? null : parseInt(data.floors)) : undefined,
        description: data.description,
        status: data.status,
        dealType: data.dealType,
        ownershipShare: data.ownershipShare !== undefined ? (data.ownershipShare === null ? null : parseFloat(data.ownershipShare)) : undefined,
        estimatedCost: data.estimatedCost !== undefined ? (data.estimatedCost === null ? null : parseFloat(data.estimatedCost)) : undefined,
        expectedRevenue: data.expectedRevenue !== undefined ? (data.expectedRevenue === null ? null : parseFloat(data.expectedRevenue)) : undefined,
        driveFolderId: data.driveFolderId,
        attachments: data.attachments,
        financialData: data.financialData !== undefined ? data.financialData : undefined,
        notes: data.notes,
      },
    });

    return NextResponse.json(project);
  } catch (error: any) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Error al actualizar proyecto", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.developmentProject.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Error al eliminar proyecto", details: error.message },
      { status: 500 }
    );
  }
}
