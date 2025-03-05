// src/app/api/comments/[commentId]/replies/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Debes iniciar sesión" }, { status: 401 });
  }

  try {
    const { commentId } = await params;
    const { content, sourceId } = await request.json();
    
    const parentComment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!parentComment) {
      return NextResponse.json(
        { message: "Comentario padre no encontrado" },
        { status: 404 }
      );
    }

    const newReply = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        sourceId,
        parentId: commentId,
        depth: parentComment.depth + 1,
        path: `${parentComment.path}/${commentId}`,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true }
        }
      }
    });

    return NextResponse.json(newReply);
    
  } catch (error) {
    console.error("Error creando respuesta:", error);
    return NextResponse.json(
      { message: "Error al crear respuesta" },
      { status: 500 }
    );
  }
}