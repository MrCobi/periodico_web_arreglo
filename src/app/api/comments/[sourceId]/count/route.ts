import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  _: Request,
  { params }: { params: { sourceId: string } }
) {
  try {
    const count = await prisma.comment.count({
      where: { sourceId: params.sourceId }
    });
    
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { message: "Error obteniendo conteo de comentarios" },
      { status: 500 }
    );
  }
}