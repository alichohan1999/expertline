"use client";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function DebugAuthPage() {
  const { data: session, status } = useSession();
  const [apiSession, setApiSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setApiSession(data);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">NextAuth Debug</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">useSession Hook</h2>
          <p>Status: {status}</p>
          <pre className="text-sm">{JSON.stringify(session, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">API Session</h2>
          <pre className="text-sm">{JSON.stringify(apiSession, null, 2)}</pre>
        </div>

        <div className="space-x-4">
          <button
            onClick={() => signIn("google")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In with Google
          </button>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
