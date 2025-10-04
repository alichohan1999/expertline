import NextImage from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Expertline - Developer Code Comparison Platform",
  description: "Learn about Expertline, the developer platform for comparing code approaches through expert insights and AI-powered analysis. Join our community today!",
  openGraph: {
    title: "About Expertline - Developer Code Comparison Platform",
    description: "Learn about Expertline, the developer platform for comparing code approaches through expert insights and AI-powered analysis. Join our community today!",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background-secondary py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-background rounded-xl border border-border p-8">
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
              <h1 className="text-3xl font-semibold text-foreground">
                About Expertline
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              F1 for coders, Use the <b className="text-primary">C1</b> in your projects.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-foreground mb-4">
                Expertline is a tool that helps you find the best code options recommended by various documentation and industry experts. It provides a comparison of the pros and cons between each option, so you can select the most optimized approach for your application according to your specific use case.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                How It Works
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Share Your Code</h3>
                    <p className="text-muted-foreground text-sm">Post your code solutions with descriptions and categories</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Community Feedback</h3>
                    <p className="text-muted-foreground text-sm">Get endorsements, oppositions, and comments from peers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Compare Approaches</h3>
                    <p className="text-muted-foreground text-sm">See side-by-side comparisons with pros, cons, and complexity analysis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-background-tertiary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Expert Mode</h3>
                <p className="text-muted-foreground">Community-driven comparisons based on real developer experiences</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-background-tertiary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">AI Mode</h3>
                <p className="text-muted-foreground">AI-powered analysis with intelligent fallbacks</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-background-tertiary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Community Driven</h3>
                <p className="text-muted-foreground">Voting, comments, and peer review system</p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
              Technology Stack
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Next.js", description: "React framework" },
                { name: "TypeScript", description: "Type safety" },
                { name: "Prisma", description: "Database ORM" },
                { name: "PostgreSQL", description: "Database" },
                { name: "Tailwind CSS", description: "Styling" },
                { name: "NextAuth.js", description: "Authentication" },
                { name: "Google Gemini", description: "AI analysis" },
                { name: "Vercel", description: "Deployment" }
              ].map((tech, index) => (
                <div key={index} className="bg-background-secondary rounded-lg p-4 text-center">
                  <h3 className="font-semibold text-foreground mb-1">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Join Our Community
            </h2>
            <p className="text-foreground mb-8 max-w-2xl mx-auto">
              Expertline is more than just a platform—it&apos;s a community of developers helping each other grow. Share your knowledge, learn from others, and contribute to the collective wisdom of the developer community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary-hover dark:bg-primary dark:bg-primary-hover dark:text-primary-foreground transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
              <Link
                href="/posts"
                className="inline-flex items-center px-6 py-3 border border-border text-base font-medium rounded-lg text-foreground bg-background hover:bg-background-secondary transition-colors"
              >
                Explore Posts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
