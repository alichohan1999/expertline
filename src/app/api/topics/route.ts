import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const paginationSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(50).default(10),
});

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const parsed = paginationSchema.safeParse({
		page: searchParams.get("page") ?? undefined,
		pageSize: searchParams.get("pageSize") ?? undefined,
	});
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}
	const { page, pageSize } = parsed.data;
	const skip = (page - 1) * pageSize;

	const [items, total] = await Promise.all([
		prisma.topic.findMany({
			skip,
			take: pageSize,
			orderBy: [{ updatedAt: "desc" }],
		}),
		prisma.topic.count(),
	]);

	return NextResponse.json({ items, page, pageSize, total });
}


