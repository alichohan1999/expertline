import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import ProfileImage from "@/components/ProfileImage";

async function getUserPosts(userId: string) {
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    include: {
      topic: true,
      comments: {
        include: {
          author: {
            select: { name: true, username: true }
          }
        }
      },
      votes: true
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return posts;
}

async function getUserStats(userId: string) {
  const [totalPosts, totalComments, totalVotes, endorsementStats] = await Promise.all([
    prisma.post.count({ where: { authorId: userId } }),
    prisma.comment.count({ where: { authorId: userId } }),
    prisma.vote.count({ where: { userId: userId } }),
    prisma.post.aggregate({
      where: { authorId: userId },
      _sum: { endorse: true, oppose: true },
      _avg: { endorseRate: true, eoRatio: true }
    })
  ]);

  // Get user's received endorsements (from their posts)
  const receivedEndorsements = await prisma.vote.count({
    where: {
      post: { authorId: userId },
      voteType: 'ENDORSE'
    }
  });

  const receivedOppositions = await prisma.vote.count({
    where: {
      post: { authorId: userId },
      voteType: 'OPPOSE'
    }
  });

  return {
    totalPosts,
    totalComments,
    totalVotes,
    receivedEndorsements,
    receivedOppositions,
    averageEndorseRate: endorsementStats._avg.endorseRate || 0,
    averageEoRatio: endorsementStats._avg.eoRatio || 0,
    totalEndorsements: endorsementStats._sum.endorse || 0,
    totalOppositions: endorsementStats._sum.oppose || 0,
  };
}

function calculateUserLevel(stats: {
  totalPosts: number;
  totalComments: number;
  totalVotes: number;
  receivedEndorsements: number;
}) {
  const { totalPosts, totalComments, totalVotes, receivedEndorsements } = stats;
  
  // Calculate level based on activity and engagement
  const activityScore = totalPosts * 10 + totalComments * 2 + totalVotes * 1;
  const engagementScore = receivedEndorsements * 5;
  const totalScore = activityScore + engagementScore;
  
  if (totalScore >= 1000) return { level: "Expert", color: "bg-purple-500", textColor: "text-purple-600 dark:text-purple-400" };
  if (totalScore >= 500) return { level: "Advanced", color: "bg-blue-500", textColor: "text-blue-600 dark:text-blue-400" };
  if (totalScore >= 200) return { level: "Intermediate", color: "bg-green-500", textColor: "text-green-600 dark:text-green-400" };
  if (totalScore >= 50) return { level: "Beginner", color: "bg-yellow-500", textColor: "text-yellow-600 dark:text-yellow-400" };
  return { level: "Newcomer", color: "bg-gray-500", textColor: "text-gray-600 dark:text-gray-400" };
}

async function getUserInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      name: true, 
      email: true, 
      image: true, 
      username: true, 
      bio: true, 
      role: true, 
      createdAt: true 
    },
  });
  return user;
}

export default async function ProfilePage() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      redirect("/");
    }

    let userId = session.user.id;
    let user = await getUserInfo(userId);

    // If user not found by ID, try to find by email
    if (!user && session.user.email) {
      const userByEmail = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { 
          id: true,
          name: true, 
          email: true, 
          image: true, 
          username: true, 
          bio: true, 
          role: true, 
          createdAt: true 
        },
      });
      
      if (userByEmail) {
        user = userByEmail;
        userId = userByEmail.id;
      }
    }

    if (!user) {
      return (
        <main className="mx-auto max-w-4xl px-4 py-16">
          <div className="text-center text-red-500 dark:text-red-400">
            User not found. Please try signing out and signing in again.
          </div>
        </main>
      );
    }

    const posts = await getUserPosts(userId);
    const stats = await getUserStats(userId);
    const userLevel = calculateUserLevel(stats);

    const totalReceivedVotes = (stats.receivedEndorsements || 0) + (stats.receivedOppositions || 0);
    const receivedEndorseRate = totalReceivedVotes > 0 ? ((stats.receivedEndorsements || 0) / totalReceivedVotes) * 100 : 0;

    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <ProfileImage
                src={user.image}
                alt={user.name || "User Avatar"}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary dark:border-primary"
                fallbackSrc="/default-avatar.svg"
              />
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${userLevel.color} rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center`}>
                <span className="text-xs font-bold text-white">
                  {userLevel.level.charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {user.name || "Expertline User"}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${userLevel.color} text-white`}>
                  {userLevel.level}
                </span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">@{typeof user.username === 'string' ? user.username : user.username?.username || "anonymous"}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              {user.bio && (
                <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.totalPosts}</div>
              <div className="text-sm text-primary dark:text-primary">Posts</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-primary dark:text-primary">{stats.totalComments}</div>
              <div className="text-sm text-primary dark:text-primary">Comments</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-primary dark:text-primary">{stats.totalVotes}</div>
              <div className="text-sm text-primary dark:text-primary">Votes Given</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="text-2xl font-bold text-primary dark:text-primary">{stats.receivedEndorsements}</div>
              <div className="text-sm text-primary dark:text-primary">Endorsements</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.receivedOppositions}</div>
              <div className="text-sm text-gray-900 dark:text-white">Oppositions</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div className="text-2xl font-bold text-primary dark:text-primary">
                {receivedEndorseRate.toFixed(1)}%
              </div>
              <div className="text-sm text-primary dark:text-primary">Endorse Rate</div>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Your Recent Posts</h2>
            <Link
              href="/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary dark:bg-primary-hover dark:text-primary-foreground font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Post
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all transform hover:scale-[1.01]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 ml-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {post.endorse}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414L11.414 10l1.293 1.293a1 1 0 01-1.414 1.414L10 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L8.586 10 7.293 8.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        {post.oppose}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        {post.comments.length}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {post.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 text-xs mb-3">
                    {post.categories.map((category, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                      >
                        {category}
                      </span>
                    ))}
                    {post.topic && (
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                        {post.topic.name}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {(() => {
                        const endorse = post.endorse || 0;
                        const oppose = post.oppose || 0;
                        const total = endorse + oppose;
                        return total > 0 ? ((endorse / total) * 100).toFixed(1) : '0.0';
                      })()}% endorse rate
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start sharing your code approaches with the community
              </p>
              <Link
                href="/posts/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary dark:bg-primary-hover dark:text-primary-foreground font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Post
              </Link>
            </div>
          )}
        </section>
      </main>
    );
  } catch (error) {
    console.error("Profile page error:", error);
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center text-red-500 dark:text-red-400">
          An error occurred while loading your profile. Please try again.
        </div>
      </main>
    );
  }
}