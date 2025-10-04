import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import CopyButton from "./CopyButton";
import PostActions from "./PostActions";
import Comments from "./Comments";

async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        topic: true,
        author: {
          select: { name: true, username: true }
        },
        comments: {
          include: {
            author: {
              select: { name: true, username: true }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
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
        
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{post.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.author?.name || (typeof post.username === 'string' ? post.username : post.username?.username || 'anonymous')}
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                {post.topic && (
                  <Link 
                    href={`/topics/${post.topic.id}/posts`}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors hover:scale-105 transform"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {post.topic.name}
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-primary dark:text-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="font-semibold">{post.endorse} Endorsements</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="font-semibold">{post.oppose} Oppositions</span>
                  </div>
                  <div className="text-sm text-primary dark:text-primary">
                    E/O Ratio: {post.eoRatio?.toFixed(2) || 'N/A'}
                  </div>
                </div>
              </div>

              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.categories.map((category, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {post.description}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Code Example</h2>
                <CopyButton code={post.code} />
              </div>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-6 border border-gray-300 dark:border-gray-600">
                <pre className="text-sm font-mono text-gray-100 whitespace-pre-wrap overflow-x-auto">
                  {post.code}
                </pre>
              </div>
            </div>

            {post.subTopics && post.subTopics.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Related Topics</h2>
                <div className="flex flex-wrap gap-3">
                  {post.subTopics.map((subTopic, index) => (
                    <Link 
                      key={index} 
                      href={`/topics?search=${encodeURIComponent(subTopic)}`}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors hover:scale-105 transform"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {subTopic}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Community Feedback</h2>
              <PostActions 
                postId={post.id}
                currentEndorse={post.endorse}
                currentOppose={post.oppose}
              />
              
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Endorse Rate:</span>
                    <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                      {(() => {
                        const endorse = post.endorse || 0;
                        const oppose = post.oppose || 0;
                        const total = endorse + oppose;
                        return total > 0 ? ((endorse / total) * 100).toFixed(1) : '0.0';
                      })()}%
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">E/O Ratio:</span>
                    <span className="ml-2 text-primary dark:text-primary font-medium">
                      {post.eoRatio?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <Comments postId={post.id} />
    </main>
  );
}
