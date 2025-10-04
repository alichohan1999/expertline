import { NextRequest, NextResponse } from "next/server";
import { getGeminiAI } from "@/lib/gemini";

export async function GET(req: NextRequest) {
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
		const fs = require('fs');
		const path = require('path');
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
			} catch (geminiError: any) {
				debugInfo.geminiTest = {
					success: false,
					error: geminiError.message,
					errorType: geminiError.constructor.name
				};
			}
		}

		return NextResponse.json({
			debug: debugInfo,
			message: "Gemini API diagnostic complete"
		});

	} catch (error: any) {
		debugInfo.error = error.message;
		return NextResponse.json({
			debug: debugInfo,
			error: error.message
		}, { status: 500 });
	}
}
