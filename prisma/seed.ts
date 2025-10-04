import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// Create demo users
	const user1 = await prisma.user.upsert({
		where: { email: "demo@expertline.dev" },
		update: {},
		create: {
			email: "demo@expertline.dev",
			name: "Demo User",
			username: "demo",
		},
	});

	const user2 = await prisma.user.upsert({
		where: { email: "alice@expertline.dev" },
		update: {},
		create: {
			email: "alice@expertline.dev",
			name: "Alice Johnson",
			username: "alice",
		},
	});

	const user3 = await prisma.user.upsert({
		where: { email: "bob@expertline.dev" },
		update: {},
		create: {
			email: "bob@expertline.dev",
			name: "Bob Smith",
			username: "bob",
		},
	});

	// Create topics
	const topicA = await prisma.topic.upsert({
		where: { name: "Node.js Performance" },
		update: {},
		create: { name: "Node.js Performance", subTopics: ["profiling", "caching"], info: "Optimizing Node performance.", postIds: [] },
	});
	const topicB = await prisma.topic.upsert({
		where: { name: "React State Management" },
		update: {},
		create: { name: "React State Management", subTopics: ["context", "redux"], info: "Tradeoffs of state libs.", postIds: [] },
	});
	const topicC = await prisma.topic.upsert({
		where: { name: "JavaScript Functions" },
		update: {},
		create: { name: "JavaScript Functions", subTopics: ["async", "closures"], info: "Function patterns and best practices.", postIds: [] },
	});
	const topicD = await prisma.topic.upsert({
		where: { name: "Database Queries" },
		update: {},
		create: { name: "Database Queries", subTopics: ["optimization", "indexing"], info: "Database query optimization techniques.", postIds: [] },
	});
	const topicE = await prisma.topic.upsert({
		where: { name: "CSS Layout" },
		update: {},
		create: { name: "CSS Layout", subTopics: ["flexbox", "grid"], info: "Modern CSS layout techniques.", postIds: [] },
	});

	// Create posts
	const postsData = [
		// Node.js Performance posts
		{
			title: "Optimize express middleware order",
			code: "app.use(cacheMiddleware); app.use(compression());",
			description: "Reorder middlewares to reduce CPU and latency.",
			categories: ["performance", "optimization"],
			topicId: topicA.id,
			subTopics: ["caching"],
			authorId: user1.id,
			username: user1.username,
		},
		{
			title: "Use cluster module for CPU-intensive tasks",
			code: "const cluster = require('cluster'); if (cluster.isMaster) { cluster.fork(); }",
			description: "Leverage multiple CPU cores for better performance.",
			categories: ["performance", "scaling"],
			topicId: topicA.id,
			subTopics: ["profiling"],
			authorId: user2.id,
			username: user2.username,
		},
		{
			title: "Implement connection pooling",
			code: "const pool = mysql.createPool({ connectionLimit: 10 });",
			description: "Reuse database connections to reduce overhead.",
			categories: ["performance", "database"],
			topicId: topicA.id,
			subTopics: ["caching"],
			authorId: user3.id,
			username: user3.username,
		},
		{
			title: "Use streaming for large files",
			code: "fs.createReadStream('large.txt').pipe(response);",
			description: "Stream large files instead of loading into memory.",
			categories: ["performance", "memory"],
			topicId: topicA.id,
			subTopics: ["profiling"],
			authorId: user1.id,
			username: user1.username,
		},
		{
			title: "Enable gzip compression",
			code: "app.use(compression());",
			description: "Compress responses to reduce bandwidth usage.",
			categories: ["performance", "optimization"],
			topicId: topicA.id,
			subTopics: ["caching"],
			authorId: user2.id,
			username: user2.username,
		},

		// React State Management posts
		{
			title: "Use memoization hooks effectively",
			code: "const memo = useMemo(() => heavy(data), [data]);",
			description: "Memoize expensive computations in React.",
			categories: ["performance", "react"],
			topicId: topicB.id,
			subTopics: ["memoization"],
			authorId: user1.id,
			username: user1.username,
		},
		{
			title: "Context vs Redux for global state",
			code: "const Context = createContext(); const Provider = ({ children }) => { ... };",
			description: "Choose between Context API and Redux based on complexity.",
			categories: ["state", "architecture"],
			topicId: topicB.id,
			subTopics: ["context"],
			authorId: user2.id,
			username: user2.username,
		},
		{
			title: "Custom hooks for state logic",
			code: "const useCounter = () => { const [count, setCount] = useState(0); return { count, increment: () => setCount(c => c + 1) }; };",
			description: "Extract state logic into reusable custom hooks.",
			categories: ["react", "reusability"],
			topicId: topicB.id,
			subTopics: ["context"],
			authorId: user3.id,
			username: user3.username,
		},
		{
			title: "Zustand for simple state management",
			code: "const useStore = create((set) => ({ count: 0, increment: () => set((state) => ({ count: state.count + 1 })) }));",
			description: "Lightweight alternative to Redux with less boilerplate.",
			categories: ["state", "simplicity"],
			topicId: topicB.id,
			subTopics: ["redux"],
			authorId: user1.id,
			username: user1.username,
		},
		{
			title: "UseReducer for complex state",
			code: "const [state, dispatch] = useReducer(reducer, initialState);",
			description: "UseReducer for state that involves multiple sub-values.",
			categories: ["react", "complexity"],
			topicId: topicB.id,
			subTopics: ["redux"],
			authorId: user2.id,
			username: user2.username,
		},

		// JavaScript Functions posts
		{
			title: "Async/await vs Promises",
			code: "async function fetchData() { const data = await fetch('/api'); return data.json(); }",
			description: "Modern async handling with cleaner syntax.",
			categories: ["async", "readability"],
			topicId: topicC.id,
			subTopics: ["async"],
			authorId: user3.id,
			username: user3.username,
		},
		{
			title: "Closure patterns for data privacy",
			code: "const createCounter = () => { let count = 0; return () => ++count; };",
			description: "Use closures to create private variables in JavaScript.",
			categories: ["closures", "privacy"],
			topicId: topicC.id,
			subTopics: ["closures"],
			authorId: user1.id,
			username: user1.username,
		},
		{
			title: "Higher-order functions",
			code: "const withLogging = (fn) => (...args) => { console.log('Calling', fn.name); return fn(...args); };",
			description: "Create reusable function wrappers for cross-cutting concerns.",
			categories: ["functions", "reusability"],
			topicId: topicC.id,
			subTopics: ["closures"],
			authorId: user2.id,
			username: user2.username,
		},
		{
			title: "Arrow functions vs regular functions",
			code: "const arrow = () => this.value; function regular() { return this.value; }",
			description: "Understand the differences in 'this' binding and hoisting.",
			categories: ["functions", "this"],
			topicId: topicC.id,
			subTopics: ["async"],
			authorId: user3.id,
			username: user3.username,
		},
		{
			title: "Function currying for partial application",
			code: "const add = (a) => (b) => a + b; const add5 = add(5);",
			description: "Create specialized functions from general ones.",
			categories: ["functions", "functional"],
			topicId: topicC.id,
			subTopics: ["closures"],
			authorId: user1.id,
			username: user1.username,
		},

		// Database Queries posts
		{
			title: "Index optimization for queries",
			code: "CREATE INDEX idx_user_email ON users(email);",
			description: "Create indexes on frequently queried columns.",
			categories: ["database", "performance"],
			topicId: topicD.id,
			subTopics: ["indexing"],
			authorId: user2.id,
			username: user2.username,
		},
		{
			title: "Use prepared statements",
			code: "const stmt = db.prepare('SELECT * FROM users WHERE id = ?');",
			description: "Prevent SQL injection and improve performance.",
			categories: ["security", "performance"],
			topicId: topicD.id,
			subTopics: ["optimization"],
			authorId: user3.id,
			username: user3.username,
		},
		{
			title: "Query result pagination",
			code: "SELECT * FROM posts LIMIT 10 OFFSET 20;",
			description: "Implement efficient pagination for large datasets.",
			categories: ["database", "pagination"],
			topicId: topicD.id,
			subTopics: ["optimization"],
			authorId: user1.id,
			username: user1.username,
		},
		{
			title: "Database connection pooling",
			code: "const pool = new Pool({ max: 20, idleTimeoutMillis: 30000 });",
			description: "Manage database connections efficiently.",
			categories: ["database", "scaling"],
			topicId: topicD.id,
			subTopics: ["indexing"],
			authorId: user2.id,
			username: user2.username,
		},
		{
			title: "Use EXPLAIN for query analysis",
			code: "EXPLAIN SELECT * FROM users WHERE age > 25;",
			description: "Analyze query execution plans for optimization.",
			categories: ["database", "analysis"],
			topicId: topicD.id,
			subTopics: ["optimization"],
			authorId: user3.id,
			username: user3.username,
		},

		// CSS Layout posts
		{
			title: "Flexbox for responsive layouts",
			code: ".container { display: flex; justify-content: space-between; }",
			description: "Use flexbox for flexible, responsive layouts.",
			categories: ["css", "layout"],
			topicId: topicE.id,
			subTopics: ["flexbox"],
			authorId: user1.id,
			username: user1.username,
		},
		{
			title: "CSS Grid for complex layouts",
			code: ".grid { display: grid; grid-template-columns: repeat(3, 1fr); }",
			description: "CSS Grid for two-dimensional layouts.",
			categories: ["css", "layout"],
			topicId: topicE.id,
			subTopics: ["grid"],
			authorId: user2.id,
			username: user2.username,
		},
		{
			title: "Flexbox vs Grid",
			code: "/* Flexbox: one-dimensional */ .flex { display: flex; } /* Grid: two-dimensional */ .grid { display: grid; }",
			description: "Choose between Flexbox and Grid based on layout needs.",
			categories: ["css", "comparison"],
			topicId: topicE.id,
			subTopics: ["flexbox"],
			authorId: user3.id,
			username: user3.username,
		},
		{
			title: "Responsive design with media queries",
			code: "@media (max-width: 768px) { .container { flex-direction: column; } }",
			description: "Adapt layouts for different screen sizes.",
			categories: ["css", "responsive"],
			topicId: topicE.id,
			subTopics: ["grid"],
			authorId: user1.id,
			username: user1.username,
		},
		{
			title: "CSS custom properties for theming",
			code: ":root { --primary-color: #007bff; } .button { background: var(--primary-color); }",
			description: "Use CSS variables for consistent theming.",
			categories: ["css", "theming"],
			topicId: topicE.id,
			subTopics: ["flexbox"],
			authorId: user2.id,
			username: user2.username,
		},
	];

	for (const p of postsData) {
		await prisma.post.create({
			data: {
				...p,
				username: p.username || "unknown",
				endorse: Math.floor(Math.random() * 20) + 1,
				oppose: Math.floor(Math.random() * 5) + 1,
				eoRatio: 0,
				endorseRate: 0,
			},
		});
	}

	// Update E/O ratios after creating posts
	const allPosts = await prisma.post.findMany();
	for (const post of allPosts) {
		const eoRatio = post.endorse / post.oppose;
		const endorseRate = post.endorse / (post.endorse + post.oppose);
		await prisma.post.update({
			where: { id: post.id },
			data: { eoRatio, endorseRate },
		});
	}

	// Update topic aggregates
	await prisma.topic.update({
		where: { id: topicA.id },
		data: { numPosts: await prisma.post.count({ where: { topicId: topicA.id } }) },
	});
	await prisma.topic.update({
		where: { id: topicB.id },
		data: { numPosts: await prisma.post.count({ where: { topicId: topicB.id } }) },
	});
	await prisma.topic.update({
		where: { id: topicC.id },
		data: { numPosts: await prisma.post.count({ where: { topicId: topicC.id } }) },
	});
	await prisma.topic.update({
		where: { id: topicD.id },
		data: { numPosts: await prisma.post.count({ where: { topicId: topicD.id } }) },
	});
	await prisma.topic.update({
		where: { id: topicE.id },
		data: { numPosts: await prisma.post.count({ where: { topicId: topicE.id } }) },
	});

	console.log("Seed completed");
}

main().finally(async () => {
	await prisma.$disconnect();
});


