import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Expertline",
  description: "Terms of Service for Expertline - the developer platform for comparing code approaches and learning from the community.",
  openGraph: {
    title: "Terms of Service - Expertline",
    description: "Terms of Service for Expertline - the developer platform for comparing code approaches and learning from the community.",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                By accessing and using Expertline, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                2. Use License
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Permission is granted to temporarily use Expertline for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                3. User Content
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You are responsible for all content you post on Expertline. By posting content, you grant us a non-exclusive, royalty-free license to use, modify, and display your content on our platform.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You agree not to post content that is:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li>Illegal, harmful, or violates any laws</li>
                <li>Defamatory, abusive, or hateful</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains malware or malicious code</li>
                <li>Spam or promotional content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                4. Privacy Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                5. Disclaimers
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                The information on this website is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, Expertline excludes all representations, warranties, conditions and terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                6. Limitations
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                In no event shall Expertline or its suppliers be liable for any damages arising out of the use or inability to use the materials on Expertline.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                7. Governing Law
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction where Expertline operates.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                8. Changes to Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Expertline reserves the right to revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                9. Contact Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us at support@expertline.dev
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
