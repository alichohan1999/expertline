import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VoteType } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;

  try {
    // Check if user has already voted on this post
    const existingVote = await prisma.vote.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: userId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.voteType === VoteType.ENDORSE) {
        return NextResponse.json({ error: "You have already endorsed this post" }, { status: 400 });
      } else {
        // User previously opposed, now endorsing - update the vote
        await prisma.vote.update({
          where: {
            postId_userId: {
              postId: id,
              userId: userId,
            },
          },
          data: {
            voteType: VoteType.ENDORSE,
          },
        });

        // Update post counts
        const updatedPost = await prisma.post.update({
          where: { id },
          data: {
            endorse: { increment: 1 },
            oppose: { decrement: 1 },
          },
        });

        // Recalculate ratios
        const totalVotes = updatedPost.endorse + updatedPost.oppose;
        const endorseRate = totalVotes > 0 ? updatedPost.endorse / totalVotes : 0;
        const eoRatio = updatedPost.oppose > 0 ? updatedPost.endorse / updatedPost.oppose : updatedPost.endorse;

        await prisma.post.update({
          where: { id },
          data: {
            endorseRate,
            eoRatio,
          },
        });

        return NextResponse.json({ 
          endorse: updatedPost.endorse,
          oppose: updatedPost.oppose,
          eoRatio,
          endorseRate,
          userVote: "endorse",
          message: "Vote changed from oppose to endorse"
        });
      }
    }

    // Create new vote
    await prisma.vote.create({
      data: {
        postId: id,
        userId: userId,
        voteType: VoteType.ENDORSE,
      },
    });

    // Update post counts
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        endorse: { increment: 1 },
      },
    });

    // Recalculate ratios
    const totalVotes = updatedPost.endorse + updatedPost.oppose;
    const endorseRate = totalVotes > 0 ? updatedPost.endorse / totalVotes : 0;
    const eoRatio = updatedPost.oppose > 0 ? updatedPost.endorse / updatedPost.oppose : updatedPost.endorse;

    await prisma.post.update({
      where: { id },
      data: {
        endorseRate,
        eoRatio,
      },
    });

    return NextResponse.json({ 
      endorse: updatedPost.endorse,
      oppose: updatedPost.oppose,
      eoRatio,
      endorseRate,
      userVote: "endorse",
      message: "Post endorsed successfully"
    });
  } catch (error) {
    console.error("Error endorsing post:", error);
    return NextResponse.json({ error: "Failed to endorse post" }, { status: 500 });
  }
}
