// src/app/api/comments/[commentId]/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// Ruta: /api/comments/[commentId]/route.ts
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ commentId: string }> }
) {
    const { commentId } = await params;

    const session = await auth();
    
    if (!session?.user) {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            include: { user: true }
        });

        if (!comment) {
            return NextResponse.json(
                { message: "Comentario no encontrado" }, 
                { status: 404 }
            );
        }

        // Permitir admin o dueño del comentario
        if (comment.userId !== session.user.id && session.user.role !== "admin") {
            return NextResponse.json(
                { message: "No tienes permiso" }, 
                { status: 403 }
            );
        }

        await prisma.comment.delete({
            where: { id: commentId },
            include: { replies: true }
        });

        return NextResponse.json({ message: "Comentario eliminado" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json(
            { message: "Error al eliminar comentario" },
            { status: 500 }
        );
    }
}
