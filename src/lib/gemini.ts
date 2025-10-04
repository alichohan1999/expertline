import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiAI() {
	const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
	if (!apiKey) {
		throw new Error("GOOGLE_GEMINI_API_KEY is not set");
	}
	return new GoogleGenerativeAI(apiKey);
}