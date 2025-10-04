import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const paginationSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(50).default(10),
});

const requestSchema = z.object({
	topicKey: z.string().min(2),
	exampleCode: z.string().optional(),
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
		prisma.topicRequest.findMany({ skip, take: pageSize, orderBy: { updatedAt: "desc" } }),
		prisma.topicRequest.count(),
	]);

	return NextResponse.json({ items, page, pageSize, total });
}

export async function POST(req: NextRequest) {
	const body = await req.json();
	const parsed = requestSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}
	const { topicKey, exampleCode } = parsed.data;

	const existing = await prisma.topicRequest.findFirst({ where: { topicKey, status: "PENDING" } });
	if (existing) {
		const updated = await prisma.topicRequest.update({
			where: { id: existing.id },
			data: { count: { increment: 1 }, updatedAt: new Date(), status: existing.count + 1 >= 20 ? "SUGGESTED" : "PENDING" },
		});
		return NextResponse.json(updated);
	}

	const created = await prisma.topicRequest.create({
		data: { topicKey, exampleCode, count: 1 },
	});
	return NextResponse.json(created, { status: 201 });
}


