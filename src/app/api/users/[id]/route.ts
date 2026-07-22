import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { auth } from "@/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    
    // Only ADMIN or the user themselves can edit the profile
    const isSelf = session.user.id === id;
    if (!isSelf && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // Only ADMIN can change roles or reactivate accounts
    if ((body.role !== undefined || body.isActive !== undefined) && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Solo administradores pueden cambiar roles o estado" }, { status: 403 });
    }

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.socialLinks !== undefined) updateData.socialLinks = body.socialLinks;
    
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Acceso denegado. Solo administradores pueden eliminar usuarios." }, { status: 403 });
    }

    const { id } = await params;
    
    // Evitamos borrar al admin a sí mismo por error
    if (session.user.id === id) {
      return NextResponse.json({ error: "No puedes eliminar tu propia cuenta" }, { status: 400 });
    }

    // Soft Delete
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
    
    return NextResponse.json({ success: true, message: "Usuario desactivado exitosamente" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}
