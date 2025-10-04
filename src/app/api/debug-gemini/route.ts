import { NextRequest, NextResponse } from "next/server";
import { getGeminiAI } from "@/lib/gemini";

export async function GET() {
	const debugInfo = {
		apiKeyExists: !!process.env.GOOGLE_GEMINI_API_KEY,
		apiKeyPreview: process.env.GOOGLE_GEMINI_API_KEY ? 
			process.env.GOOGLE_GEMINI_API_KEY.substring(0, 10) + "..." : "Not found",
		envFileExists: false,
		geminiTest: null,
		error: null
	};

	try {
		// Check if .env file exists
		const fs = await import('fs');
		const path = await import('path');
		const envPath = path.join(process.cwd(), '.env');
		debugInfo.envFileExists = fs.existsSync(envPath);

		// Test Gemini API if key exists
		if (process.env.GOOGLE_GEMINI_API_KEY) {
			try {
				const genAI = getGeminiAI();
				const model = genAI.getGenerativeModel({ 
					model: "gemini-2.5-flash",
					generationConfig: {
						temperature: 0.7,
						maxOutputTokens: 100,
						responseMimeType: "application/json"
					}
				});

				const prompt = `Return JSON: {"status": "working", "test": "success"}`;
				const result = await model.generateContent(prompt);
				const content = result.response.text();
				
				debugInfo.geminiTest = {
					success: true,
					response: content,
					responseLength: content.length
				};
			} catch (geminiError: unknown) {
				debugInfo.geminiTest = {
					success: false,
					error: geminiError instanceof Error ? geminiError.message : 'Unknown error',
					errorType: geminiError instanceof Error ? geminiError.constructor.name : 'Unknown'
				};
			}
		}

		return NextResponse.json({
			debug: debugInfo,
			message: "Gemini API diagnostic complete"
		});

	} catch (error: unknown) {
		debugInfo.error = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({
			debug: debugInfo,
			error: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
}
