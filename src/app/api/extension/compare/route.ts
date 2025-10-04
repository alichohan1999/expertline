import { NextRequest, NextResponse } from "next/server";
import { POST as comparePost } from "@/app/api/compare/route";

// Proxy to the main compare endpoint so the VSCode extension can use a stable path
export async function POST(req: NextRequest) {
	return comparePost(req);
}


