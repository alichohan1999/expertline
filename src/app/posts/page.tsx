import Link from "next/link";
import NextImage from "next/image";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getPosts(page: number, pageSize: number) {
	const hdrs = await headers();
	const proto = hdrs.get("x-forwarded-proto") ?? "http";
	const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
	const base = `${proto}://${host}`;
	const res = await fetch(`${base}/api/posts?page=${page}&pageSize=${pageSize}`, { cache: "no-store" });
	return res.json();
}

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
	const session = await getServerSession(authOptions);
	const params = await searchParams;
	const page = Number(params?.page ?? 1);
	const pageSize = 10;
	const data = await getPosts(page, pageSize);
	const { items = [], total = 0 } = data ?? {};
	const hasPrev = page > 1;
	const hasNext = page * pageSize < total;

	return (
		<main className="mx-auto max-w-6xl px-4 py-16">
			<div className="text-center mb-12">
				<div className="flex items-center justify-center gap-4 mb-6">
				<NextImage
					src="/logos/expertline-logo-s-t-l.svg"
					alt="Expertline"
					width={48}
					height={48}
					className="dark:hidden block"
				/>
				<NextImage
					src="/logos/expertline-logo-s-t-d.svg"
					alt="Expertline"
					width={48}
					height={48}
					className="dark:block hidden"
				/>
					<h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
						Community Posts
					</h1>
				</div>
				<p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
					Explore code approaches shared by the developer community with real-world insights and feedback
				</p>
				<div className="flex items-center justify-center gap-4">
					<Link 
						href="/topics" 
						className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
					>
						Browse by Topic
					</Link>
					{session?.user && (
						<Link 
							href="/posts/new" 
							className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary dark:bg-primary-hover dark:text-primary-foreground rounded-lg transition-colors"
						>
							Create Post
						</Link>
					)}
				</div>
			</div>
			
			<div className="grid gap-6">
				{items.map((p: any) => (
					<Link 
						key={p.id} 
						href={`/posts/${p.id}`}
						className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] group"
					>
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1">
								<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors mb-2">
									{p.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
									{p.description}
								</p>
							</div>
							<div className="flex items-center gap-2 ml-4">
								<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
									p.eoRatio > 2 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
									p.eoRatio > 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
									'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
								}`}>
									{p.eoRatio > 2 ? 'Highly Endorsed' : p.eoRatio > 1 ? 'Mixed' : 'Controversial'}
								</span>
							</div>
						</div>
						
						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
								<div className="flex items-center gap-1">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									{typeof p.username === 'string' ? p.username : p.username?.username || 'anonymous'}
								</div>
								<div className="flex items-center gap-1">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									{new Date(p.createdAt).toLocaleDateString()}
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-3">
									<div className="flex items-center gap-1 text-primary dark:text-primary">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
										</svg>
										<span className="font-medium">{p.endorse}</span>
									</div>
									<div className="flex items-center gap-1 text-gray-900 dark:text-white">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
										<span className="font-medium">{p.oppose}</span>
									</div>
									<div className="text-xs text-primary dark:text-primary">
										E/O: {p.eoRatio?.toFixed(2) || 'N/A'}
									</div>
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
			
			{items.length === 0 && (
				<div className="text-center py-12">
					<div className="text-6xl mb-4">📝</div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No posts found</h3>
					<p className="text-gray-600 dark:text-gray-400">Be the first to share your code approach with the community!</p>
				</div>
			)}
			
			<div className="flex items-center justify-center gap-4 mt-12">
				{hasPrev && (
					<Link 
						className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
						href={`/posts?page=${page - 1}`}
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						Previous
					</Link>
				)}
				<span className="text-sm text-gray-600 dark:text-gray-400">
					Page {page} of {Math.ceil(total / pageSize)}
				</span>
				{hasNext && (
					<Link 
						className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
						href={`/posts?page=${page + 1}`}
					>
						Next
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</Link>
				)}
			</div>
		</main>
	);
}


