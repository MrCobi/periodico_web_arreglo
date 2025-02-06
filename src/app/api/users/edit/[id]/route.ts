// src/app/api/users/edit/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const { name, email, password, roleId } = await req.json();

    if (!name || !email || !roleId) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    let updatedData: any = { name, email, roleId };
   

    // Si se proporciona una nueva contraseña, la encriptamos
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar el usuario" }, { status: 500 });
  }
}
