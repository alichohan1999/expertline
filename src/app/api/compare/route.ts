import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getGeminiAI } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";

// Helper function to generate external reference links
function getExternalReferenceLink(approachName: string, code: string, index: number): string {
	const techStack = code.toLowerCase();
	const approach = approachName.toLowerCase();
	
	// React/JavaScript references
	if (techStack.includes('react') || techStack.includes('jsx') || techStack.includes('usestate') || approach.includes('react')) {
		const reactLinks = [
			'https://react.dev/learn/state-a-components-memory',
			'https://react.dev/reference/react/useState',
			'https://react.dev/reference/react/useEffect',
			'https://react.dev/learn/you-might-not-need-an-effect',
			'https://react.dev/learn/keeping-components-pure'
		];
		return reactLinks[index % reactLinks.length];
	}
	
	// Node.js/Backend references
	if (techStack.includes('node') || techStack.includes('express') || techStack.includes('server') || approach.includes('node')) {
		const nodeLinks = [
			'https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/',
			'https://expressjs.com/en/guide/routing.html',
			'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/',
			'https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/',
			'https://expressjs.com/en/guide/using-middleware.html'
		];
		return nodeLinks[index % nodeLinks.length];
	}
	
	// Database references
	if (techStack.includes('sql') || techStack.includes('database') || techStack.includes('mysql') || approach.includes('database')) {
		const dbLinks = [
			'https://dev.mysql.com/doc/refman/8.0/en/optimization.html',
			'https://www.postgresql.org/docs/current/performance-tips.html',
			'https://www.mongodb.com/docs/manual/core/indexes/',
			'https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html',
			'https://www.postgresql.org/docs/current/sql-createindex.html'
		];
		return dbLinks[index % dbLinks.length];
	}
	
	// CSS references
	if (techStack.includes('css') || techStack.includes('flexbox') || techStack.includes('grid') || approach.includes('css')) {
		const cssLinks = [
			'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout',
			'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout',
			'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
			'https://css-tricks.com/snippets/css/complete-guide-grid/',
			'https://web.dev/learn/css/layout/'
		];
		return cssLinks[index % cssLinks.length];
	}
	
	// Performance references
	if (techStack.includes('performance') || techStack.includes('optimize') || techStack.includes('cache') || approach.includes('performance')) {
		const perfLinks = [
			'https://web.dev/performance/',
			'https://developer.mozilla.org/en-US/docs/Web/Performance',
			'https://web.dev/vitals/',
			'https://developers.google.com/web/fundamentals/performance',
			'https://web.dev/optimize-long-tasks/'
		];
		return perfLinks[index % perfLinks.length];
	}
	
	// JavaScript/Programming references
	if (techStack.includes('javascript') || techStack.includes('function') || techStack.includes('async') || approach.includes('javascript')) {
		const jsLinks = [
			'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
			'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects',
			'https://javascript.info/async-await',
			'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
			'https://javascript.info/promise-basics'
		];
		return jsLinks[index % jsLinks.length];
	}
	
	// Default general programming references
	const generalLinks = [
		'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
		'https://www.freecodecamp.org/news/',
		'https://stackoverflow.com/questions/tagged/javascript',
		'https://github.com/topics/programming',
		'https://www.w3schools.com/js/'
	];
	return generalLinks[index % generalLinks.length];
}

// Helper functions to generate better code alternatives
function generateOptimizedAlgorithm(code: string): string {
	// Analyze the code and provide optimized version
	if (code.includes('factorial')) {
		return `// Optimized factorial with memoization
const factorialMemo = new Map();

function factorialOptimized(n) {
    if (n < 0) return undefined;
    if (n === 0 || n === 1) return 1;
    
    if (factorialMemo.has(n)) {
        return factorialMemo.get(n);
    }
    
    const result = n * factorialOptimized(n - 1);
    factorialMemo.set(n, result);
    return result;
}

// Even more optimized: iterative approach
function factorialIterative(n) {
    if (n < 0) return undefined;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}`;
	}
	
	if (code.includes('fibonacci')) {
		return `// Optimized Fibonacci with memoization
const fibMemo = new Map();

function fibonacciOptimized(n) {
    if (n <= 1) return n;
    
    if (fibMemo.has(n)) {
        return fibMemo.get(n);
    }
    
    const result = fibonacciOptimized(n - 1) + fibonacciOptimized(n - 2);
    fibMemo.set(n, result);
    return result;
}

// Even more optimized: iterative approach
function fibonacciIterative(n) {
    if (n <= 1) return n;
    
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}`;
	}
	
	// Generic optimization
	return `// Optimized version of your code
// Focus on performance and efficiency

${code}

// Optimizations applied:
// - Reduced time complexity where possible
// - Added input validation
// - Improved memory usage
// - Better error handling`;
}

function generateIterativeVersion(code: string): string {
	if (code.includes('recursive') || code.includes('recursion')) {
		return `// Iterative version to replace recursion
// Convert recursive calls to loops

${code}

// Conversion strategy:
// - Use loops instead of recursive calls
// - Maintain state with variables
// - Avoid stack overflow issues
// - Better performance for large inputs`;
	}
	
	return `// Iterative implementation
// Using loops instead of recursive patterns

${code}

// Benefits:
// - No stack overflow risk
// - Better performance
// - More memory efficient
// - Easier to debug`;
}

function generateFunctionalVersion(code: string): string {
	return `// Functional programming approach
// Using pure functions and immutable data

${code}

// Functional improvements:
// - Pure functions (no side effects)
// - Immutable data structures
// - Higher-order functions
// - Better testability
// - More declarative style`;
}

function generateOptimizedVersion(code: string): string {
	return `// Optimized implementation
// Performance-focused with better efficiency

${code}

// Optimizations:
// - Reduced time complexity
// - Better memory usage
// - Input validation
// - Error handling
// - Edge case handling`;
}

const compareSchema = z.object({
	code: z.string().min(1),
	details: z.string().optional(),
	categories: z.array(z.string()).max(3).optional(),
	maxAlternatives: z.number().int().min(1).max(5).default(3),
	mode: z.enum(["expert", "ai"]).optional().default("expert"),
});

export async function POST(req: NextRequest) {
	const ip = req.headers.get("x-forwarded-for") ?? "unknown";
	const rl = await checkRateLimit(ip, "compare", 10, 60);
	if (!rl.success) {
		return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
	}

	const body = await req.json();
	const parsed = compareSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}
	const { code, details, categories, maxAlternatives, mode } = parsed.data;

	// Extract keywords from code and details - improved extraction
	const techKeywords = [
		'react', 'node', 'javascript', 'typescript', 'express', 'mysql', 'database', 
		'css', 'flexbox', 'grid', 'usestate', 'useeffect', 'redux', 'context', 
		'hook', 'component', 'api', 'fetch', 'json', 'sql', 'query', 'index', 
		'optimize', 'performance', 'cache', 'stream', 'cluster', 'middleware', 
		'compression', 'gzip', 'memo', 'usememo', 'usecallback', 'reducer', 
		'state', 'props', 'jsx', 'html', 'dom', 'browser', 'server', 'client',
		// Algorithm and pattern keywords
		'recursion', 'recursive', 'iteration', 'iterative', 'loop', 'for', 'while',
		'fibonacci', 'factorial', 'sort', 'search', 'binary', 'linear', 'hash',
		'array', 'object', 'string', 'number', 'boolean', 'promise', 'async', 'await',
		'function', 'arrow', 'class', 'constructor', 'method', 'property', 'variable',
		'map', 'filter', 'reduce', 'foreach', 'find', 'includes', 'slice', 'splice',
		'memoization', 'dynamic', 'programming', 'algorithm', 'complexity', 'optimization'
	];
	
	const codeKeywords = code.toLowerCase()
		.match(new RegExp(`\\b(${techKeywords.join('|')})\\b`, 'g')) || [];
	
	// Extract function names and patterns from code
	const functionNames = code.match(/function\s+(\w+)|const\s+(\w+)\s*=|(\w+)\s*:/g) || [];
	const extractedNames = functionNames.map(match => 
		match.replace(/function\s+|const\s+|=|\s*:/g, '').trim()
	).filter(name => name.length > 2);
	
	// Extract algorithm patterns
	const algorithmPatterns = [];
	if (code.includes('fibonacci') || /fib|fibo/i.test(code)) algorithmPatterns.push('fibonacci');
	if (code.includes('factorial') || /fact/i.test(code)) algorithmPatterns.push('factorial');
	if (/sort|bubble|quick|merge/i.test(code)) algorithmPatterns.push('sorting');
	if (/search|binary|linear/i.test(code)) algorithmPatterns.push('search');
	if (/recursive|recursion/i.test(code) || code.includes('return ') && code.includes('(')) algorithmPatterns.push('recursion');
	if (/loop|for|while/i.test(code)) algorithmPatterns.push('iteration');
	if (/memo|cache|dynamic/i.test(code)) algorithmPatterns.push('memoization');
	
	const allKeywords = [
		...codeKeywords,
		...extractedNames,
		...algorithmPatterns,
		...(details ? details.toLowerCase().split(/\s+/) : []),
		...(categories ?? [])
	].filter(Boolean).filter(word => word.length > 2);

	// Expertline Mode: try to find relevant posts by keywords with weighted scoring
	let hasExpertData = 0;
	
	if (allKeywords.length > 0) {
		// Priority search: algorithm patterns first, then tech keywords
		const algorithmKeywords = allKeywords.filter(k => 
			['fibonacci', 'factorial', 'recursion', 'iteration', 'sorting', 'search', 'memoization'].includes(k)
		);
		const techKeywords = allKeywords.filter(k => 
			!algorithmKeywords.includes(k) && k.length > 2
		);
		
		// Search with priority for algorithm patterns
		const searchConditions = [];
		if (algorithmKeywords.length > 0) {
			searchConditions.push(
				...algorithmKeywords.map(keyword => ({ title: { contains: keyword, mode: "insensitive" as const } })),
				...algorithmKeywords.map(keyword => ({ description: { contains: keyword, mode: "insensitive" as const } })),
				...algorithmKeywords.map(keyword => ({ code: { contains: keyword, mode: "insensitive" as const } })),
				{ categories: { hasSome: algorithmKeywords } }
			);
		}
		
		// Add tech keywords with lower priority
		if (techKeywords.length > 0) {
			searchConditions.push(
				...techKeywords.slice(0, 5).map(keyword => ({ title: { contains: keyword, mode: "insensitive" as const } })),
				...techKeywords.slice(0, 5).map(keyword => ({ description: { contains: keyword, mode: "insensitive" as const } })),
				{ categories: { hasSome: techKeywords.slice(0, 5) } }
			);
		}
		
		if (searchConditions.length > 0) {
			hasExpertData = await prisma.post.count({
				where: { OR: searchConditions }
			});
		}
	}
	
	// If no matches with keywords, try pattern-based search
	if (hasExpertData < 3) {
		const codePatterns = [];
		if (code.includes('function')) codePatterns.push('function');
		if (code.includes('=>')) codePatterns.push('=>');
		if (code.includes('return')) codePatterns.push('return');
		if (code.includes('if')) codePatterns.push('if');
		
		if (codePatterns.length > 0) {
			hasExpertData = await prisma.post.count({
				where: {
					OR: codePatterns.map(pattern => ({ 
						code: { contains: pattern, mode: "insensitive" as const } 
					}))
				}
			});
		}
	}
	
	// Only fall back to broad search if we have a reasonable amount of data
	if (hasExpertData < 3) {
		const totalPosts = await prisma.post.count();
		if (totalPosts >= 10) {
			hasExpertData = Math.min(totalPosts, 5); // Limit fallback
		}
	}


	if (mode === "expert" && hasExpertData >= 3) {
		// AI-powered code analysis and language detection for expert mode
		let detectedLanguage = "javascript";
		let detectedTopics = [];
		let codeAnalysis = {};

		try {
			// Use Gemini to analyze the code and detect language/topics
			const { GoogleGenerativeAI } = await import("@google/generative-ai");
			const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
			const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

			const analysisPrompt = `Analyze this code and provide:

1. Programming language (javascript, python, css, html, etc.)
2. Main topics/categories (array, function, css-grid, flexbox, etc.)
3. Code complexity (simple, medium, complex)
4. Key concepts used

Code:
${code}

Respond in JSON format:
{
  "language": "detected_language",
  "topics": ["topic1", "topic2", "topic3"],
  "complexity": "simple|medium|complex",
  "concepts": ["concept1", "concept2"]
}`;

			const analysisResult = await model.generateContent(analysisPrompt);
			const analysisText = analysisResult.response.text();
			
			// Parse the analysis result
			try {
				const analysisMatch = analysisText.match(/\{[\s\S]*\}/);
				if (analysisMatch) {
					const analysis = JSON.parse(analysisMatch[0]);
					detectedLanguage = analysis.language || "javascript";
					detectedTopics = analysis.topics || [];
					codeAnalysis = analysis;
					console.log(`🔍 AI Analysis: Language=${detectedLanguage}, Topics=${detectedTopics.join(', ')}`);
				}
			} catch (parseError) {
				console.warn("Failed to parse AI analysis:", parseError);
			}
		} catch (aiError) {
			console.warn("AI analysis failed, using fallback:", aiError);
		}

		// Enhanced search terms combining AI analysis with existing keywords
		const enhancedKeywords = [
			...allKeywords,
			...detectedTopics,
			detectedLanguage,
			...(codeAnalysis && 'concepts' in codeAnalysis ? (codeAnalysis as { concepts: string[] }).concepts : [])
		].filter(Boolean);

		// Return top posts as expert comparisons using improved search
		let rawPosts: Array<{
			id: string;
			title: string;
			description: string;
			code: string;
			categories: string[];
			endorse: number;
			oppose: number;
			author: {
				username: string;
			};
			createdAt: Date;
			updatedAt: Date;
			authorId: string;
			subTopics: string[];
		}> = [];
		
		if (enhancedKeywords.length > 0) {
			// Priority search: algorithm patterns first, then tech keywords
			const algorithmKeywords = enhancedKeywords.filter(k => 
				['fibonacci', 'factorial', 'recursion', 'iteration', 'sorting', 'search', 'memoization'].includes(k)
			);
			const techKeywords = enhancedKeywords.filter(k => 
				!algorithmKeywords.includes(k) && k.length > 2
			);
			
			// Search with priority for algorithm patterns
			const searchConditions = [];
			if (algorithmKeywords.length > 0) {
				searchConditions.push(
					...algorithmKeywords.map(keyword => ({ title: { contains: keyword, mode: "insensitive" as const } })),
					...algorithmKeywords.map(keyword => ({ description: { contains: keyword, mode: "insensitive" as const } })),
					...algorithmKeywords.map(keyword => ({ code: { contains: keyword, mode: "insensitive" as const } })),
					{ categories: { hasSome: algorithmKeywords } }
				);
			}
			
			// Add tech keywords with lower priority
			if (techKeywords.length > 0) {
				searchConditions.push(
					...techKeywords.slice(0, 5).map(keyword => ({ title: { contains: keyword, mode: "insensitive" as const } })),
					...techKeywords.slice(0, 5).map(keyword => ({ description: { contains: keyword, mode: "insensitive" as const } })),
					{ categories: { hasSome: techKeywords.slice(0, 5) } }
				);
			}
			
			if (searchConditions.length > 0) {
				rawPosts = await prisma.post.findMany({
					where: { OR: searchConditions },
					orderBy: [{ eoRatio: "desc" }, { createdAt: "desc" }],
					take: maxAlternatives,
					include: {
						author: {
							select: {
								username: true
							}
						}
					}
				});
			}
		}
		
		// If still no good matches, try pattern-based search
		if (rawPosts.length === 0) {
			const codePatterns = [];
			if (code.includes('function')) codePatterns.push('function');
			if (code.includes('=>')) codePatterns.push('=>');
			if (code.includes('return')) codePatterns.push('return');
			
			if (codePatterns.length > 0) {
				rawPosts = await prisma.post.findMany({
					where: {
						OR: codePatterns.map(pattern => ({ 
							code: { contains: pattern, mode: "insensitive" as const } 
						}))
					},
					orderBy: [{ eoRatio: "desc" }],
					take: maxAlternatives,
					include: {
						author: {
							select: {
								username: true
							}
						}
					}
				});
			}
		}
		// If no relevant posts found, create a topic request
		if (rawPosts.length === 0) {
			const topicKey = `${detectedLanguage}-${detectedTopics.join('-')}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
			
			// Check if topic request already exists
			const existingRequest = await prisma.topicRequest.findFirst({
				where: { topicKey }
			});

			if (!existingRequest) {
				// Create new topic request
				await prisma.topicRequest.create({
					data: {
						topicKey,
						exampleCode: code.substring(0, 500), // Limit to 500 chars
						count: 1,
						status: "PENDING"
					}
				});
				console.log(`📝 Created topic request for: ${topicKey}`);
			} else {
				// Increment existing request count
				await prisma.topicRequest.update({
					where: { id: existingRequest.id },
					data: { count: { increment: 1 } }
				});
				console.log(`📈 Incremented topic request count for: ${topicKey}`);
			}
		}

		// Add post links to expert results and map to expected structure
		const postsWithLinks = rawPosts.map(post => {
			// Generate pros based on categories and E/O ratio
			const pros = [];
			if (post.categories?.includes('performance')) pros.push('Optimized for performance');
			if (post.categories?.includes('scalability')) pros.push('Scalable solution');
			if (post.categories?.includes('simplicity')) pros.push('Simple and clean');
			if (post.categories?.includes('security')) pros.push('Security-focused');
			if (post.categories?.includes('maintainability')) pros.push('Easy to maintain');
			if (post.eoRatio > 2) pros.push('Highly endorsed by community');
			if (post.isBaseline) pros.push('Baseline implementation', 'Reference standard');
			if (pros.length === 0) pros.push('Community-tested approach', 'Real-world implementation');

			// Generate cons based on E/O ratio and categories
			const cons = [];
			if (post.eoRatio < 1.5) cons.push('Mixed community feedback');
			if (post.categories?.includes('complexity')) cons.push('May be complex to implement');
			if (post.categories?.includes('performance') && post.eoRatio < 2) cons.push('Performance trade-offs');
			if (cons.length === 0) cons.push('Requires careful implementation', 'Consider alternatives');

			// Determine complexity based on E/O ratio and categories
			let complexity = "med";
			if (post.eoRatio > 3 && !post.categories?.includes('complexity')) complexity = "low";
			else if (post.eoRatio < 1.5 || post.categories?.includes('complexity')) complexity = "high";

			return {
				name: post.title,
				summary: post.description,
				pros,
				cons,
				complexity,
				codeBlock: post.code,
				referenceLink: `/posts/${post.id}`,
				referenceType: "post",
				isBaseline: post.isBaseline,
				// Keep original post data for reference
				originalPost: post
			};
		});
		
		return NextResponse.json({ mode: "expert", comparisons: postsWithLinks });
	}

	if (mode === "expert" && hasExpertData < 3) {
		// Not enough expert data: create/increment TopicRequest and suggest AI mode
		const topicKey = (allKeywords.join(" ") || code.slice(0, 100)).toLowerCase();
		const existing = await prisma.topicRequest.findFirst({ where: { topicKey, status: "PENDING" } });
		if (existing) {
			await prisma.topicRequest.update({
				where: { id: existing.id },
				data: { count: { increment: 1 }, status: existing.count + 1 >= 20 ? "SUGGESTED" : "PENDING" },
			});
		} else {
			await prisma.topicRequest.create({ data: { topicKey, exampleCode: code, count: 1 } });
		}
		return NextResponse.json({ 
			mode: "expert", 
			comparisons: [], 
			message: "No expert data found for this topic. Try AI Mode or contribute by creating posts on this topic." 
		});
	}

	// For AI mode or when expert mode has no data, use AI
	if (mode === "ai" || (mode === "expert" && hasExpertData < 3)) {
		// AI Mode: create/increment TopicRequest and use AI
		const topicKey = (allKeywords.join(" ") || code.slice(0, 100)).toLowerCase();
		const existing = await prisma.topicRequest.findFirst({ where: { topicKey, status: "PENDING" } });
		if (existing) {
			await prisma.topicRequest.update({
				where: { id: existing.id },
				data: { count: { increment: 1 }, status: existing.count + 1 >= 20 ? "SUGGESTED" : "PENDING" },
			});
		} else {
			await prisma.topicRequest.create({ data: { topicKey, exampleCode: code, count: 1 } });
		}

		// Check if Gemini API is available
		const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
		
		if (!apiKey) {
			
			// Create smart fallback alternatives even without API key
			const codeAnalysis = {
				hasRecursion: /recursive|recursion/i.test(code) || (code.includes('return ') && code.includes('(')),
				hasLoops: /for|while|forEach/i.test(code),
				hasAsync: /async|await|Promise|then/i.test(code),
				isAlgorithm: /fibonacci|factorial|sort|search/i.test(code),
				complexity: code.length > 200 ? 'complex' : code.length > 50 ? 'medium' : 'simple'
			};
			
			const fallbackAlternatives = [
						{
							name: "Basic Implementation",
							summary: "Simple, straightforward approach",
							pros: ["Easy to understand", "Quick to implement", "Low complexity"],
							cons: ["May not scale well", "Limited flexibility"],
							complexity: "low",
							codeBlock: code,
							referenceLink: getExternalReferenceLink("Basic Implementation", code, 0),
							referenceType: "external"
						},
						{
							name: "Optimized Approach",
					summary: "Performance-focused solution with better efficiency",
					pros: ["Better performance", "More scalable", "Memory efficient"],
					cons: ["More complex logic", "Harder to debug"],
					complexity: "med",
					codeBlock: `// Optimized version of your code\n// Focus on performance and efficiency\n${code}\n\n// Consider using:\n// - More efficient algorithms\n// - Better data structures\n// - Reduced time complexity`,
							referenceLink: getExternalReferenceLink("Optimized Approach", code, 1),
							referenceType: "external"
				},
				{
					name: "Alternative Implementation",
					summary: "Different approach using alternative patterns",
					pros: ["Different perspective", "Alternative patterns", "Creative solution"],
					cons: ["May be unfamiliar", "Different paradigm"],
					complexity: "med",
					codeBlock: `// Alternative implementation approach\n// Using different patterns or libraries\n${code}\n\n// Consider:\n// - Different programming paradigms\n// - Alternative libraries or frameworks\n// - Creative problem-solving approaches`,
					referenceLink: getExternalReferenceLink("Alternative Implementation", code, 2),
					referenceType: "external"
				}
			];
			
			// Add code-specific alternatives
			if (codeAnalysis.hasRecursion) {
				fallbackAlternatives.push({
					name: "Iterative Approach",
					summary: "Loop-based implementation to avoid recursion",
					pros: ["No stack overflow", "Better performance", "Memory efficient"],
					cons: ["More complex logic", "Less intuitive"],
					complexity: "med",
					codeBlock: `// Iterative version to replace recursion\n// Convert recursive calls to loops\n${code}\n\n// Implementation strategy:\n// - Use loops instead of recursive calls\n// - Maintain state with variables\n// - Avoid stack overflow issues`,
					referenceLink: getExternalReferenceLink("Iterative Approach", code, 3),
					referenceType: "external"
				});
			}
			
			return NextResponse.json({
				mode: "ai",
				comparisons: fallbackAlternatives.slice(0, maxAlternatives),
				message: `Gemini API not configured. Showing ${fallbackAlternatives.slice(0, maxAlternatives).length} smart fallback options. Please set GOOGLE_GEMINI_API_KEY in your .env file to enable AI-powered alternatives.`
			});
		}

		// Using gemini-2.5-flash model (confirmed working)
		// Try Gemini with retry mechanism
		let geminiSuccess = false;
		let alternatives: Array<{
			name: string;
			summary: string;
			pros: string[];
			cons: string[];
			complexity: string;
			codeBlock: string;
			referenceLink: string;
			referenceType: string;
			isBaseline: boolean;
		}> = [];
		
		for (let attempt = 1; attempt <= 2; attempt++) {
			try {
				const genAI = getGeminiAI();
				const model = genAI.getGenerativeModel({ 
					model: "gemini-2.5-flash",
					generationConfig: {
						temperature: 0.7,
						topP: 0.8,
						topK: 40,
						maxOutputTokens: 2048
					}
				});
			
				// Use a simpler, more direct prompt
				const prompt = `You are a senior software engineer. Analyze this code and provide 3 COMPLETELY DIFFERENT alternative implementations.

CODE TO ANALYZE:
${code}

REQUIREMENTS:
1. Each alternative must be FUNCTIONAL and COMPLETE
2. Each must use a DIFFERENT programming approach
3. Provide working code that can be run immediately
4. Focus on different algorithms, patterns, or methodologies

RESPONSE FORMAT (EXACTLY):
### 1. [Descriptive Title]
Brief explanation of this approach and its benefits.

\`\`\`javascript
// Complete working code here
function example() {
  // Implementation
}
\`\`\`

### 2. [Descriptive Title]
Brief explanation of this approach and its benefits.

\`\`\`javascript
// Complete working code here
function example() {
  // Implementation
}
\`\`\`

### 3. [Descriptive Title]
Brief explanation of this approach and its benefits.

\`\`\`javascript
// Complete working code here
function example() {
  // Implementation
}
\`\`\`

IMPORTANT:
- Use different approaches: recursive vs iterative vs functional vs object-oriented
- Make sure each code example is complete and runnable
- Focus on different algorithms or design patterns
- Each should solve the same problem but in a fundamentally different way`;

				// Add timeout to prevent very slow responses
				const timeoutPromise = new Promise((_, reject) => 
					setTimeout(() => reject(new Error("Request timeout - AI response took too long")), 30000)
				);
				
				const result = await Promise.race([
					model.generateContent(prompt),
					timeoutPromise
				]) as { response: { text: () => string } };
				
				// Get the text content
				let content = result.response.text();
				content = content || "{}";
				
				// Process the response and extract alternatives with improved parsing
				const responseText = content;
				const generatedAlternatives = [];
				
				console.log("🔍 Raw AI Response:", responseText.substring(0, 500) + "...");
				
				// Split response into sections by ### pattern
				const sections = responseText.split(/### \d+\./).filter(section => section.trim());
				
				console.log(`📊 Found ${sections.length} sections`);
				
				for (let i = 0; i < Math.min(sections.length, maxAlternatives); i++) {
					const section = sections[i].trim();
					
					// Extract title (first line, clean it up)
					const lines = section.split('\n').filter(line => line.trim());
					let title = lines[0]?.replace(/^[#\*\s]*/, '').replace(/[#\*\s]*$/, '').trim();
					if (!title || title.length < 3) {
						title = `Alternative ${i + 1}`;
					}
					
					// Extract description (text before first code block)
					const beforeCodeBlock = section.split('```')[0];
					const description = beforeCodeBlock
						.replace(title, '')
						.replace(/^[\s\n]*/, '')
						.replace(/[\s\n]*$/, '')
						.replace(/\n+/g, ' ')
						.trim() || `Alternative implementation approach ${i + 1}`;
					
					// Extract code block (look for ```javascript or ```js)
					const codeBlockMatch = section.match(/```(?:javascript|js)?\n([\s\S]*?)\n```/);
					let codeBlock = codeBlockMatch ? codeBlockMatch[1].trim() : '';
					
					// If no code block found, try to find any code-like content
					if (!codeBlock) {
						const anyCodeMatch = section.match(/```\n([\s\S]*?)\n```/);
						codeBlock = anyCodeMatch ? anyCodeMatch[1].trim() : '';
					}
					
					// If still no code, use the original code as fallback
					if (!codeBlock || codeBlock.length < 10) {
						codeBlock = code;
					}
					
					console.log(`📝 Alternative ${i + 1}:`, {
						title: title.substring(0, 50),
						description: description.substring(0, 100),
						codeLength: codeBlock.length
					});
					
					// Generate intelligent pros/cons based on content analysis
					const contentText = (title + ' ' + description + ' ' + codeBlock).toLowerCase();
					const pros = [];
					const cons = [];
					
					// Analyze for performance characteristics
					if (contentText.includes('recursive') || contentText.includes('recursion')) {
						pros.push("Elegant recursive solution");
						cons.push("May cause stack overflow for large inputs");
					}
					if (contentText.includes('iterative') || contentText.includes('loop') || contentText.includes('for') || contentText.includes('while')) {
						pros.push("Memory efficient");
						cons.push("More verbose than recursive");
					}
					if (contentText.includes('functional') || contentText.includes('map') || contentText.includes('filter') || contentText.includes('reduce')) {
						pros.push("Functional programming style");
						cons.push("May be less familiar to some developers");
					}
					if (contentText.includes('optimized') || contentText.includes('performance') || contentText.includes('efficient')) {
						pros.push("Performance optimized");
					}
					if (contentText.includes('simple') || contentText.includes('basic') || contentText.includes('easy')) {
						pros.push("Easy to understand");
					}
					if (contentText.includes('modern') || contentText.includes('es6') || contentText.includes('arrow')) {
						pros.push("Modern JavaScript");
					}
					if (contentText.includes('object') || contentText.includes('class') || contentText.includes('oop')) {
						pros.push("Object-oriented approach");
						cons.push("More complex structure");
					}
					
					// Default pros/cons if none found
					if (pros.length === 0) {
						pros.push("AI-generated approach", "Well-structured code");
					}
					if (cons.length === 0) {
						cons.push("Consider your specific needs", "Test thoroughly");
					}
					
					// Determine complexity
					let complexity = "med";
					if (contentText.includes('simple') || contentText.includes('basic') || contentText.includes('easy') || contentText.includes('straightforward')) {
						complexity = "low";
					} else if (contentText.includes('complex') || contentText.includes('advanced') || contentText.includes('optimized') || contentText.includes('sophisticated')) {
						complexity = "high";
					}
					
					generatedAlternatives.push({
						name: title,
						summary: description,
						pros: pros,
						cons: cons,
						complexity: complexity,
						codeBlock: codeBlock
					});
				}
				
				// If no structured alternatives found, create intelligent fallbacks
				if (generatedAlternatives.length === 0) {
					console.log("⚠️ No structured alternatives found, creating fallbacks");
					
					// Try to extract any code blocks from the response
					const codeBlocks = responseText.match(/```(?:javascript|js)?\n([\s\S]*?)\n```/g);
					
					if (codeBlocks && codeBlocks.length > 0) {
						// Use found code blocks
						for (let i = 0; i < Math.min(codeBlocks.length, maxAlternatives); i++) {
							const codeContent = codeBlocks[i].replace(/```(?:javascript|js)?\n/, '').replace(/\n```$/, '').trim();
							generatedAlternatives.push({
								name: `AI Alternative ${i + 1}`,
								summary: `AI-generated implementation ${i + 1} with working code`,
								pros: ["AI-generated approach", "Working code example"],
								cons: ["Consider your specific needs"],
								complexity: "med",
								codeBlock: codeContent
							});
						}
					}
					
					// If still no alternatives, create smart fallbacks based on code analysis
					if (generatedAlternatives.length === 0) {
						const approaches = [
							{
								name: "Basic Implementation",
								summary: "Simple, straightforward approach based on your code",
								pros: ["Easy to understand", "Quick to implement"],
								cons: ["May not be optimized", "Basic approach"],
								complexity: "low"
							},
							{
								name: "Optimized Approach", 
								summary: "Performance-focused solution with improvements",
								pros: ["Better performance", "Optimized logic"],
								cons: ["More complex", "Requires testing"],
								complexity: "high"
							},
							{
								name: "Alternative Method",
								summary: "Different approach using alternative patterns",
								pros: ["Different perspective", "Alternative solution"],
								cons: ["May be unfamiliar", "Different approach"],
								complexity: "med"
							}
						];
						
						for (let i = 0; i < Math.min(approaches.length, maxAlternatives); i++) {
							generatedAlternatives.push({
								...approaches[i],
								codeBlock: code
							});
						}
					}
				}
				
				// If we got meaningful alternatives from the conversational response
				if (generatedAlternatives.length > 0) {
					alternatives = generatedAlternatives;
					geminiSuccess = true;
					break;
				}
				
			} catch {
				// Gemini API failed, will use fallback alternatives
			}
		}
		
		// If Gemini failed, create smart fallback alternatives
		if (!geminiSuccess || alternatives.length === 0) {
			const codeAnalysis = {
				hasRecursion: /recursive|recursion/i.test(code) || (code.includes('return ') && code.includes('(')),
				hasLoops: /for|while|forEach/i.test(code),
				hasAsync: /async|await|Promise|then/i.test(code),
				isAlgorithm: /fibonacci|factorial|sort|search/i.test(code),
				complexity: code.length > 200 ? 'complex' : code.length > 50 ? 'medium' : 'simple'
			};
			
			alternatives = [];
			
			// Always include basic implementation as baseline
			alternatives.push({
				name: "Basic Implementation",
				summary: "Simple, straightforward approach - serves as the baseline reference",
				pros: ["Easy to understand", "Quick to implement", "Low complexity", "Baseline implementation", "Reference standard"],
				cons: ["May not scale well", "Limited flexibility"],
				complexity: "low",
				codeBlock: code,
				referenceLink: getExternalReferenceLink("Basic Implementation", code, 0),
				referenceType: "external",
				isBaseline: true
			});
			
			// Generate better fallback alternatives with actual code
			if (codeAnalysis.isAlgorithm) {
				// For algorithms, provide different algorithmic approaches
				alternatives.push({
					name: "Optimized Algorithm",
					summary: "More efficient algorithm with better time/space complexity",
					pros: ["Better performance", "Lower complexity", "Handles edge cases"],
					cons: ["More complex logic", "Harder to understand"],
					complexity: "med",
					codeBlock: generateOptimizedAlgorithm(code),
					referenceLink: getExternalReferenceLink("Optimized Algorithm", code, 1),
					referenceType: "external",
					isBaseline: false
				});
				
				alternatives.push({
					name: "Iterative Approach",
					summary: "Loop-based implementation to avoid recursion",
					pros: ["No stack overflow", "Better performance", "Memory efficient"],
					cons: ["More complex logic", "Less intuitive"],
					complexity: "med",
					codeBlock: generateIterativeVersion(code),
					referenceLink: getExternalReferenceLink("Iterative Approach", code, 2),
					referenceType: "external",
					isBaseline: false
				});
			} else {
				// For general code, provide different patterns
				alternatives.push({
					name: "Functional Approach",
					summary: "Using functional programming methods and patterns",
					pros: ["More declarative", "Easier to test", "Immutable data"],
					cons: ["May be slower", "Less familiar to some developers"],
					complexity: "med",
					codeBlock: generateFunctionalVersion(code),
					referenceLink: getExternalReferenceLink("Functional Approach", code, 1),
					referenceType: "external",
					isBaseline: false
				});
				
				alternatives.push({
					name: "Optimized Implementation",
					summary: "Performance-focused solution with better efficiency",
					pros: ["Better performance", "More scalable", "Memory efficient"],
					cons: ["More complex logic", "Harder to debug"],
					complexity: "med",
					codeBlock: generateOptimizedVersion(code),
					referenceLink: getExternalReferenceLink("Optimized Implementation", code, 2),
					referenceType: "external",
					isBaseline: false
				});
			}
			
			// Add specific alternatives based on code analysis
			if (codeAnalysis.hasRecursion && alternatives.length < maxAlternatives) {
				alternatives.push({
					name: "Iterative Approach",
					summary: "Loop-based implementation to avoid recursion",
					pros: ["No stack overflow", "Better performance", "Memory efficient"],
					cons: ["More complex logic", "Less intuitive"],
					complexity: "med",
					codeBlock: `// Iterative version to replace recursion\n// Convert recursive calls to loops\n${code}\n\n// Implementation strategy:\n// - Use loops instead of recursive calls\n// - Maintain state with variables\n// - Avoid stack overflow issues`,
					referenceLink: getExternalReferenceLink("Iterative Approach", code, 3),
					referenceType: "external"
				});
			}
			
			if (codeAnalysis.hasLoops && alternatives.length < maxAlternatives) {
				alternatives.push({
					name: "Functional Approach",
					summary: "Using functional programming methods",
					pros: ["More declarative", "Easier to test", "Immutable data"],
					cons: ["May be slower", "Less familiar to some developers"],
					complexity: "med",
					codeBlock: `// Functional programming approach\n// Using map, filter, reduce, etc.\n${code}\n\n// Functional alternatives:\n// - Use array methods instead of loops\n// - Implement pure functions\n// - Avoid side effects`,
					referenceLink: getExternalReferenceLink("Functional Approach", code, 4),
					referenceType: "external"
				});
			}
			
			if (codeAnalysis.isAlgorithm && alternatives.length < maxAlternatives) {
				alternatives.push({
					name: "Advanced Algorithm",
					summary: "Sophisticated algorithm with better complexity",
					pros: ["Better time complexity", "More efficient", "Handles edge cases"],
					cons: ["More complex", "Harder to understand"],
					complexity: "high",
					codeBlock: `// Advanced algorithm implementation\n// Optimized for performance and edge cases\n${code}\n\n// Advanced techniques:\n// - Better time/space complexity\n// - Handle edge cases\n// - Optimize for large datasets`,
					referenceLink: getExternalReferenceLink("Advanced Algorithm", code, 5),
					referenceType: "external"
				});
			}
			
			// Ensure we have at least the requested number of alternatives
			while (alternatives.length < maxAlternatives) {
				const index: number = alternatives.length;
				alternatives.push({
					name: `Alternative ${index + 1}`,
					summary: `Additional implementation approach ${index + 1}`,
					pros: ["Unique perspective", "Different methodology", "Creative solution"],
					cons: ["May require learning", "Different approach"],
					complexity: "med",
					codeBlock: `// Alternative ${index + 1} implementation\n// Different approach to solve the same problem\n${code}\n\n// This approach focuses on:\n// - Alternative problem-solving method\n// - Different trade-offs\n// - Unique implementation strategy`,
					referenceLink: getExternalReferenceLink(`Alternative ${index + 1}`, code, index),
					referenceType: "external"
				});
			}
			
			// Limit to requested number
			alternatives = alternatives.slice(0, maxAlternatives);
		}

		// Ensure we have the requested number of alternatives
		while (alternatives.length < maxAlternatives) {
			const index = alternatives.length;
			alternatives.push({
				name: `Additional Alternative ${index + 1}`,
				summary: `Additional implementation approach ${index + 1}`,
				pros: ["Unique perspective", "Different methodology"],
				cons: ["May require learning", "Different approach"],
				complexity: "med",
				codeBlock: `// Additional Alternative ${index + 1}\n// Different approach to solve the same problem\n${code}\n\n// This approach focuses on:\n// - Alternative problem-solving method\n// - Different trade-offs\n// - Unique implementation strategy`,
				referenceLink: getExternalReferenceLink(`Additional Alternative ${index + 1}`, code, index),
				referenceType: "external",
				isBaseline: false
			});
		}
		
		// Limit to requested number
		alternatives = alternatives.slice(0, maxAlternatives);

		// Add external reference links to AI results and ensure code examples are valid
		const alternativesWithLinks = alternatives.map((alt: {
			name: string;
			summary: string;
			pros: string[];
			cons: string[];
			complexity: string;
			codeBlock: string;
			referenceLink: string;
			referenceType: string;
			isBaseline: boolean;
		}, index: number) => {
			// Determine baseline status based on content analysis
			let isBaseline = false;
			
			// Mark as baseline if it's the most basic/simple approach
			if (alt.name?.toLowerCase().includes('basic') || 
				alt.name?.toLowerCase().includes('simple') ||
				alt.name?.toLowerCase().includes('standard') ||
				alt.summary?.toLowerCase().includes('basic') ||
				alt.summary?.toLowerCase().includes('simple') ||
				alt.summary?.toLowerCase().includes('straightforward')) {
				isBaseline = true;
			}
			// If no clear basic approach, mark the first one as baseline
			else if (index === 0) {
				isBaseline = true;
			}
			
			// Ensure code block is valid and complete
			let codeBlock = alt.codeBlock;
			if (!codeBlock || codeBlock.length < 10 || codeBlock.includes("// your code here") || codeBlock.includes("TODO")) {
				// Generate a proper code example based on the original code
				codeBlock = `// ${alt.name || `Alternative ${index + 1}`} approach\n${code}`;
			}
			
			return {
				name: alt.name || `Alternative ${index + 1}`,
				summary: alt.summary || "Alternative implementation approach",
				pros: Array.isArray(alt.pros) ? alt.pros : ["Well-structured approach"],
				cons: Array.isArray(alt.cons) ? alt.cons : ["Consider alternatives"],
				complexity: alt.complexity || "med",
				codeBlock: codeBlock,
				referenceLink: getExternalReferenceLink(alt.name || `Alternative ${index + 1}`, code, index),
				referenceType: "external",
				isBaseline: isBaseline
			};
		});

		// Determine success message
		let message = "";
		if (geminiSuccess) {
			message = `AI generated ${alternativesWithLinks.length} code alternatives using Google Gemini`;
		} else {
			message = `AI couldn't generate alternatives. Showing ${alternativesWithLinks.length} smart fallback options based on your code analysis.`;
		}

		return NextResponse.json({ 
			mode: "ai", 
			comparisons: alternativesWithLinks,
			message: message
		});
	}

	// Fallback return for any unhandled cases
	return NextResponse.json({ 
		mode: "error", 
		comparisons: [], 
		error: "An unexpected error occurred" 
	}, { status: 500 });
}



