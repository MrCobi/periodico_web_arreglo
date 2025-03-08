import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { followingId } = await req.json();
    
    if (!followingId) {
      return NextResponse.json({ error: "Missing followingId" }, { status: 400 });
    }

    // Verificar si ya existe el follow
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: followingId
        }
      }
    });

    if (existingFollow) {
      return NextResponse.json({ error: "Already following" }, { status: 400 });
    }

    const newFollow = await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: followingId
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(newFollow);
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const followingId = searchParams.get("followingId");
    
    if (!followingId) {
      return NextResponse.json({ error: "Missing followingId" }, { status: 400 });
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: followingId
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 }
    );
  }
}