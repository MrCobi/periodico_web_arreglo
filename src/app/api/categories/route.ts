// src/app/api/categories/route.ts
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.source.findMany({
      select: { category: true },
      distinct: ["category"],
      where: {
        category: {
          not: "" 
        }
      }
    });

    // Limpiar y validar categorías
    const validCategories = categories
      .map(c => c.category?.trim())
      .filter((c): c is string => !!c && typeof c === "string");

    return NextResponse.json(validCategories);
    
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}