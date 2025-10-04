"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import toast from "react-hot-toast";
import ProfileImage from "@/components/ProfileImage";

interface Comment {
  id: string;
  content: string;
  parentId?: string;
  createdAt: string;
  author: {
    name: string;
    username: string;
    image?: string;
  };
  children?: Comment[];
}

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [postId, fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      signIn("google");
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      if (res.ok) {
        setNewComment("");
        fetchComments(); // Refresh comments
        toast.success("Comment posted successfully!");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("An error occurred while posting the comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      signIn("google");
      return;
    }

    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: replyContent.trim(),
          parentId 
        }),
      });

      if (res.ok) {
        setReplyContent("");
        setReplyingTo(null);
        fetchComments(); // Refresh comments
        toast.success("Reply posted successfully!");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to post reply");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("An error occurred while posting the reply");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Comments</h2>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading comments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Comments</h2>

      {/* Comment Form */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        {session ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this code approach..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {newComment.length}/1000 characters
                </span>
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary dark:bg-primary-hover dark:text-primary-foreground font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Posting...
                    </div>
                  ) : (
                    "Post Comment"
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sign in to leave a comment
            </p>
            <button
              onClick={() => signIn("google")}
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary dark:bg-primary-hover dark:text-primary-foreground font-medium rounded-lg transition-colors"
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
              <div className="flex gap-3">
                <ProfileImage
                  src={comment.author.image || null}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                  fallbackSrc="/default-avatar.svg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {comment.author.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      @{comment.author.username || 'anonymous'}
                    </span>
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      • {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                    {comment.content}
                  </p>
                  
                  {/* Reply Button */}
                  {session && (
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-sm text-primary hover:text-primary-hover transition-colors"
                    >
                      {replyingTo === comment.id ? "Cancel" : "Reply"}
                    </button>
                  )}

                  {/* Reply Form */}
                  {replyingTo === comment.id && session && (
                    <div className="mt-4 ml-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <form onSubmit={(e) => handleSubmitReply(comment.id, e)} className="space-y-3">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={`Reply to ${comment.author.name}...`}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={2}
                          maxLength={1000}
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {replyContent.length}/1000 characters
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent("");
                              }}
                              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={submitting || !replyContent.trim()}
                              className="px-3 py-1 bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary dark:bg-primary-hover dark:text-primary-foreground text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submitting ? "Posting..." : "Reply"}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.children && comment.children.length > 0 && (
                    <div className="mt-4 ml-4 space-y-4">
                      {comment.children.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <ProfileImage
                            src={reply.author.image}
                            alt={reply.author.name}
                            className="w-6 h-6 rounded-full object-cover"
                            fallbackSrc="/default-avatar.svg"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                {reply.author.name}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                @{typeof reply.author.username === 'string' ? reply.author.username : reply.author.username?.username || 'anonymous'}
                              </span>
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                • {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
