"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPostForm() {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [code, setCode] = useState("");
	const [description, setDescription] = useState("");
	const [categories, setCategories] = useState("");
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await fetch("/api/posts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title,
					code,
					description,
					categories: categories.split(",").map(c => c.trim()).filter(Boolean),
				}),
			});

			if (res.ok) {
				const data = await res.json();
				router.push(`/posts/${data.id}`);
			} else {
				alert("Failed to create post. Please try again.");
			}
		} catch (error) {
			console.error("Error creating post:", error);
			alert("Failed to create post. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="mx-auto max-w-4xl px-4 py-16">
			{/* Header */}
			<div className="mb-8">
				<Link
					href="/posts"
					className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6"
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					Back to Posts
				</Link>

				<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
					Create New Post
				</h1>
				<p className="text-lg text-gray-600 dark:text-gray-400">
					Share your code approach with the community and get feedback from other developers.
				</p>
			</div>

			{/* Form */}
			<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
				<form onSubmit={onSubmit} className="space-y-6">
					{/* Title */}
					<div>
						<label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Title *
						</label>
						<input
							type="text"
							id="title"
							required
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Brief description of your code approach"
							className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
						/>
					</div>

					{/* Code Block */}
					<div>
						<label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Code *
						</label>
						<textarea
							id="code"
							required
							value={code}
							onChange={(e) => setCode(e.target.value)}
							placeholder="Paste your code here..."
							rows={12}
							className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm"
						/>
						<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
							Share the code you want feedback on or want to compare with other approaches.
						</p>
					</div>

					{/* Description */}
					<div>
						<label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Description *
						</label>
						<textarea
							id="description"
							required
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Explain your approach, why you chose it, and what you'd like feedback on..."
							rows={4}
							className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
						/>
					</div>

					{/* Categories */}
					<div>
						<label htmlFor="categories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Categories
						</label>
						<input
							type="text"
							id="categories"
							value={categories}
							onChange={(e) => setCategories(e.target.value)}
							placeholder="e.g., React, Performance, Security (comma-separated)"
							className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
						/>
						<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
							Add relevant categories to help others find your post.
						</p>
					</div>

					{/* Submit Button */}
					<div className="flex items-center gap-4 pt-6">
						<button
							type="submit"
							disabled={loading}
							className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary dark:bg-primary-hover dark:text-primary-foreground disabled:opacity-50 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:transform-none shadow-md hover:shadow-lg disabled:shadow-none"
						>
							{loading ? (
								<>
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									Creating Post...
								</>
							) : (
								<>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
									</svg>
									Create Post
								</>
							)}
						</button>
						<Link
							href="/posts"
							className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
						>
							Cancel
						</Link>
					</div>
				</form>
			</div>
		</main>
	);
}
