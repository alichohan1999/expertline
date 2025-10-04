"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

interface PostActionsProps {
  postId: string;
  currentEndorse: number;
  currentOppose: number;
}

export default function PostActions({ postId, currentEndorse, currentOppose }: PostActionsProps) {
  const { data: session } = useSession();
  const [endorse, setEndorse] = useState(currentEndorse);
  const [oppose, setOppose] = useState(currentOppose);
  const [loading, setLoading] = useState(false);
  const [userVote, setUserVote] = useState<string | null>(null);

  // Fetch user's current vote status
  useEffect(() => {
    const fetchVoteStatus = async () => {
      if (!session?.user?.id) return;
      
      try {
        const res = await fetch(`/api/posts/${postId}/vote-status`);
        if (res.ok) {
          const data = await res.json();
          setUserVote(data.userVote);
        }
      } catch (error) {
        console.error("Error fetching vote status:", error);
      }
    };

    fetchVoteStatus();
  }, [postId, session?.user?.id]);

  const handleEndorse = async () => {
    if (!session) {
      toast.error("Please sign in to vote on posts");
      signIn("google");
      return;
    }

    setLoading(true);
    try {
      // If user already endorsed, unvote instead
      const endpoint = userVote === "endorse" ? "unvote" : "endorse";
      const res = await fetch(`/api/posts/${postId}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setEndorse(data.endorse);
        setOppose(data.oppose);
        setUserVote(data.userVote);
        
        if (data.message) {
          toast.success(data.message);
        }
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to endorse post");
      }
    } catch (error) {
      console.error("Error endorsing post:", error);
      toast.error("An error occurred while endorsing the post");
    } finally {
      setLoading(false);
    }
  };

  const handleOppose = async () => {
    if (!session) {
      toast.error("Please sign in to vote on posts");
      signIn("google");
      return;
    }

    setLoading(true);
    try {
      // If user already opposed, unvote instead
      const endpoint = userVote === "oppose" ? "unvote" : "oppose";
      const res = await fetch(`/api/posts/${postId}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setEndorse(data.endorse);
        setOppose(data.oppose);
        setUserVote(data.userVote);
        
        if (data.message) {
          toast.success(data.message);
        }
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to oppose post");
      }
    } catch (error) {
      console.error("Error opposing post:", error);
      toast.error("An error occurred while opposing the post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <button
        onClick={handleEndorse}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all disabled:opacity-50 ${
          userVote === "endorse"
            ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground border-2 border-primary shadow-md"
            : userVote === "oppose"
            ? "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300 border-2 border-transparent"
            : "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground hover:bg-primary-hover dark:hover:bg-primary-hover border-2 border-transparent"
        }`}
      >
        <svg className="w-5 h-5" fill={userVote === "endorse" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
        <span className="font-medium">{endorse}</span>
        <span className="text-sm">Endorse</span>
        {userVote === "endorse" && (
          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
            ✓
          </span>
        )}
      </button>
      
      <button
        onClick={handleOppose}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all disabled:opacity-50 ${
          userVote === "oppose"
            ? "bg-gray-800 text-white dark:bg-primary dark:text-white border-2 border-gray-800 dark:border-primary shadow-md"
            : userVote === "endorse"
            ? "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300 border-2 border-transparent"
            : "bg-gray-800 text-white dark:bg-primary dark:text-white hover:bg-gray-700 dark:hover:bg-primary-hover border-2 border-transparent"
        }`}
      >
        <svg className="w-5 h-5" fill={userVote === "oppose" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span className="font-medium">{oppose}</span>
        <span className="text-sm">Oppose</span>
        {userVote === "oppose" && (
          <span className="text-xs bg-gray-800 text-white dark:bg-primary dark:text-primary-foreground px-2 py-1 rounded-full">
            ✓
          </span>
        )}
      </button>

      {!session && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sign in to endorse or oppose posts
        </p>
      )}
    </div>
  );
}
