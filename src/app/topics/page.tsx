import Link from "next/link";
import NextImage from "next/image";
import { headers } from "next/headers";

async function getTopics(page: number, pageSize: number) {
	const hdrs = await headers();
	const proto = hdrs.get("x-forwarded-proto") ?? "http";
	const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
	const base = `${proto}://${host}`;
	const res = await fetch(`${base}/api/topics?page=${page}&pageSize=${pageSize}`, { cache: "no-store" });
	return res.json();
}

export default async function TopicsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
	const params = await searchParams;
	const page = Number(params?.page ?? 1);
	const pageSize = 10;
	const data = await getTopics(page, pageSize);
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
						Explore Topics
					</h1>
				</div>
				<p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
					Discover trending topics and community discussions about different programming approaches
				</p>
			</div>
			
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{items.map((t: any) => (
					<div key={t.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
						<div className="flex items-start justify-between mb-4">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
								{t.name}
							</h3>
							<div className="flex items-center gap-1 text-primary">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
								</svg>
								<span className="text-sm font-medium">{t.viewsCount || 0}</span>
							</div>
						</div>
						<div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
							<div className="flex items-center gap-4">
								<span className="flex items-center gap-1">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									{t.numPosts || 0} posts
								</span>
							</div>
							{t.isOfficial && (
								<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
									<svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
									</svg>
									Official
								</span>
							)}
						</div>
						
						<Link 
							href={`/topics/${t.id}/posts`}
							className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							View All Posts
							<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</Link>
					</div>
				))}
			</div>
			
			{items.length === 0 && (
				<div className="text-center py-12">
					<div className="text-6xl mb-4">📚</div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No topics found</h3>
					<p className="text-gray-600 dark:text-gray-400">Check back later for new topics and discussions.</p>
				</div>
			)}
			
			<div className="flex items-center justify-center gap-4 mt-12">
				{hasPrev && (
					<Link 
						className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
						href={`/topics?page=${page - 1}`}
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
						href={`/topics?page=${page + 1}`}
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


