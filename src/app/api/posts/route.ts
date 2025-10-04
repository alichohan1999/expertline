import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const paginationSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(50).default(10),
	topicId: z.string().optional(),
});

const postCreateSchema = z.object({
	code: z.string().min(1),
	title: z.string().min(1),
	categories: z.array(z.string()).min(1).max(3),
	topicId: z.string().optional(),
	subTopics: z.array(z.string()).max(5).optional().default([]),
	description: z.string().min(1),
});

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const parsed = paginationSchema.safeParse({
		page: searchParams.get("page") ?? undefined,
		pageSize: searchParams.get("pageSize") ?? undefined,
		topicId: searchParams.get("topicId") ?? undefined,
	});
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}
	const { page, pageSize, topicId } = parsed.data;
	const skip = (page - 1) * pageSize;

	// Build where clause for filtering
	const where = topicId ? { topicId } : {};

	const [items, total] = await Promise.all([
		prisma.post.findMany({
			where,
			skip,
			take: pageSize,
			orderBy: [{ createdAt: "desc" }],
			include: { author: true, comments: true, topic: true },
		}),
		prisma.post.count({ where }),
	]);

	return NextResponse.json({ items, page, pageSize, total });
}

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await req.json();
	const parsed = postCreateSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}

	const authorId = (session.user as any).id as string;
	const username = session.user?.name ?? "user";

	const data = parsed.data;
	const endorse = 0;
	const oppose = 0;
	const eoRatio = endorse / Math.max(oppose, 1);
	const endorseRate = (endorse + oppose) > 0 ? endorse / (endorse + oppose) : 0;

	const created = await prisma.post.create({
		data: {
			code: data.code,
			title: data.title,
			categories: data.categories,
			topicId: data.topicId,
			subTopics: data.subTopics,
			description: data.description,
			endorse,
			oppose,
			eoRatio,
			endorseRate,
			authorId,
			username,
		},
	});

	// Update topic aggregates if a topic is linked
	if (created.topicId) {
		await prisma.topic.update({
			where: { id: created.topicId },
			data: {
				numPosts: { increment: 1 },
				postIds: { push: created.id },
			},
		});
	}

	return NextResponse.json(created, { status: 201 });
}


