import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ userVote: null });
  }

  const { id } = await params;
  const userId = session.user.id;

  try {
    const vote = await prisma.vote.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: userId,
        },
      },
      select: {
        voteType: true,
      },
    });

    return NextResponse.json({ 
      userVote: vote?.voteType?.toLowerCase() || null 
    });
  } catch (error) {
    console.error("Error fetching vote status:", error);
    return NextResponse.json({ userVote: null });
  }
}
