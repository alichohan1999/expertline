"use client";
import NextImage from "next/image";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import BaselineStatusIcon from "@/components/BaselineStatusIcon";

export default function Home() {
  const [code, setCode] = useState("");
  const [details, setDetails] = useState("");
  const [mode, setMode] = useState<"expert" | "ai">("expert");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{
    name: string;
    summary: string;
    pros: string[];
    cons: string[];
    complexity: string;
    codeBlock: string;
    referenceLink: string;
    referenceType: string;
    isBaseline: boolean;
  }>>([]);
  const [originalCode, setOriginalCode] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Refs for scrolling
  const inputFormRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function onCompare(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setShowResults(false);
    setOriginalCode(code);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, details, maxAlternatives: 3, mode }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 503 && errorData.error) {
          // Show user-friendly message for quota exceeded
          toast.error(errorData.error);
        } else if (res.status === 429) {
          toast.error("Too many requests. Please wait a moment and try again.");
        } else {
          toast.error(`Error: ${res.status} - ${errorData.error || 'Unknown error'}`);
        }
        return;
      }
      
      const data = await res.json();
      if (data && Array.isArray(data.comparisons)) {
        setResults(data.comparisons);
        setShowResults(true);
        
        // Show message if no results found
        if (data.comparisons.length === 0) {
          toast.error("No alternatives found. Try different code or check your input.");
        } else if (data.message) {
          // Show informative message from server
          toast.success(data.message);
        }
        
        // Scroll to results after a brief delay
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        setResults([]);
        setShowResults(false);
        toast.error("No results found. Please try again with different code.");
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error instanceof SyntaxError && error.message.includes("JSON")) {
        toast.error("Server returned invalid response. Please try again.");
      } else {
        toast.error("Failed to compare code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const scrollToInput = () => {
    inputFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen mx-auto max-w-5xl px-4 py-20">
      {/* Results Section - Show at top when available */}
      {showResults && results.length > 0 && (
        <div ref={resultsRef} className="mb-12">
          {/* Scroll to Input Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Code Comparison Results
            </h2>
            <button
              onClick={scrollToInput}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary-hover rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Back to Input
            </button>
          </div>

          {/* Original Code Section */}
          {originalCode && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Original Code</h3>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 border border-gray-300 dark:border-gray-600">
                <pre className="text-sm font-mono text-gray-100 whitespace-pre-wrap overflow-x-auto">{originalCode}</pre>
              </div>
            </div>
          )}

          {/* Comparison Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Comparison Table</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Side-by-side analysis of different approaches</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-gray-100">Approach</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-gray-100">Summary</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-gray-100">Code Example</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-gray-100">Pros</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-gray-100">Cons</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-gray-100">Baseline Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-gray-100">Complexity</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                        {r.name || r.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {r.summary || r.description}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="max-w-xs">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Code</span>
                            <button
                              onClick={() => copyToClipboard(r.codeBlock || r.code || originalCode, i)}
                              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            >
                              {copiedIndex === i ? (
                                <>
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Copied
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-3 max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600">
                            <pre className="text-xs font-mono text-gray-100 whitespace-pre-wrap">
                              {(r.codeBlock || r.code || originalCode).slice(0, 200)}
                              {(r.codeBlock || r.code || originalCode).length > 200 && '...'}
                            </pre>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <ul className="space-y-1">
                          {(r.pros || []).map((p: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">✓</span>
                              <span className="text-gray-700 dark:text-gray-300">{p}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <ul className="space-y-1">
                          {(r.cons || []).map((c: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-red-500 mt-1">✗</span>
                              <span className="text-gray-700 dark:text-gray-300">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <BaselineStatusIcon 
                          isBaseline={r.isBaseline}
                          size="md"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-col gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            r.complexity === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                            r.complexity === 'med' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          }`}>
                            {r.complexity || 'N/A'}
                          </span>
                          {r.referenceLink && (
                            <a 
                              href={r.referenceLink} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-hover transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              {r.referenceType === 'post' ? 'View Post' : 'Learn More'}
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Cards */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Detailed Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">In-depth breakdown of each approach</p>
            </div>
            <div className="grid gap-6">
              {results.map((r, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{r.name || r.title}</h4>
                        <BaselineStatusIcon 
                          isBaseline={r.isBaseline}
                          size="md"
                        />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{r.summary || r.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      r.complexity === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                      r.complexity === 'med' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {r.complexity || 'N/A'} Complexity
                    </span>
                  </div>
                  
                  {/* Code Block for each approach */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-sm">Code Example</h5>
                      <button
                        onClick={() => copyToClipboard(r.codeBlock || r.code || originalCode, i)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      >
                        {copiedIndex === i ? (
                          <>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded p-4">
                      <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                        {r.codeBlock || r.code || originalCode}
                      </pre>
                    </div>
                  </div>

                  {r.pros && r.cons && (
                    <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Pros</div>
                        <ul className="list-disc ml-5">
                          {(r.pros || []).map((p: string, idx: number) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium">Cons</div>
                        <ul className="list-disc ml-5">
                          {(r.cons || []).map((c: string, idx: number) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {r.complexity && <div className="mt-2 text-xs opacity-70">Complexity: {r.complexity}</div>}
                  {r.eoRatio && <div className="mt-2 text-xs text-primary dark:text-primary">E/O Ratio: {r.eoRatio.toFixed(2)}</div>}
                  {r.referenceLink && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <a 
                        href={r.referenceLink} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {r.referenceType === 'post' ? 'View Full Post' : 'External Reference'}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <section className={`flex flex-col items-center text-center gap-12 ${showResults ? 'mb-12' : 'mb-20'}`}>
        <div className="flex items-center gap-4">
            <NextImage
              src="/logos/expertline-logo-s-t-l.svg"
              alt="Expertline"
              width={48}
              height={48}
              className="dark:hidden block"
              priority
            />
            <NextImage
              src="/logos/expertline-logo-s-t-d.svg"
              alt="Expertline"
              width={48}
              height={48}
              className="dark:block hidden"
              priority
            />
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100">
            Expertline
          </h1>
        </div>
        <div className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-medium text-gray-700 dark:text-gray-300">
            F1 for coders, Use the <b className="text-primary">C1</b> in your projects.
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
          Expertline is a tool that helps you find the best code options recommended by various documentation and industry experts. It provides a comparison of the pros and cons between each option, so you can select the most optimized approach for your application according to your specific use case.
          </p>
        </div>
      </section>
      
      {/* Input Form Section */}
      <section ref={inputFormRef} className={`bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 ${!showResults ? 'min-h-[60vh] flex flex-col justify-center' : ''}`}>
        <form onSubmit={onCompare} className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              rows={8}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Additional Context (Optional)</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Add any additional details about your code..."
              rows={3}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as "expert" | "ai")}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all"
            >
              <option value="expert">Expert Mode</option>
              <option value="ai">AI Mode</option>
            </select>
          </div>
          
          <button 
            disabled={loading} 
            className="w-full bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary dark:bg-primary-hover dark:text-primary-foreground disabled:opacity-50 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {mode === "ai" ? "AI is analyzing..." : "Searching experts..."}
              </span>
            ) : (
              "Find"
            )}
          </button>
        </form>
        
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-xl">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium">
                {mode === "ai" ? "AI is analyzing your code..." : "Searching expert solutions..."}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "ai" ? "This may take a few seconds..." : "Looking for community solutions..."}
            </p>
          </div>
        )}
        
      </section>
    </main>
  );
}