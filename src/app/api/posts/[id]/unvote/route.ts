import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VoteType } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: postId } = await params;
    const userId = session.user.id;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user has voted on this post
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId,
        postId
      }
    });

    if (!existingVote) {
      return NextResponse.json({ error: "You haven't voted on this post" }, { status: 400 });
    }

    // Delete the vote
    await prisma.vote.delete({
      where: {
        id: existingVote.id
      }
    });

    // Update post vote counts
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        endorse: existingVote.voteType === VoteType.ENDORSE ? { decrement: 1 } : undefined,
        oppose: existingVote.voteType === VoteType.OPPOSE ? { decrement: 1 } : undefined,
      }
    });

    // Calculate new stats
    const totalVotes = updatedPost.endorse + updatedPost.oppose;
    const endorseRate = totalVotes > 0 ? updatedPost.endorse / totalVotes : 0;
    const eoRatio = updatedPost.oppose > 0 ? updatedPost.endorse / updatedPost.oppose : updatedPost.endorse;

    // Update post with new stats
    const finalPost = await prisma.post.update({
      where: { id: postId },
      data: {
        endorseRate,
        eoRatio
      }
    });

    return NextResponse.json({
      endorse: finalPost.endorse,
      oppose: finalPost.oppose,
      endorseRate: finalPost.endorseRate,
      eoRatio: finalPost.eoRatio,
      userVote: null,
      message: "Vote removed successfully"
    });

  } catch (error) {
    console.error("Error removing vote:", error);
    return NextResponse.json({ error: "Failed to remove vote" }, { status: 500 });
  }
}
