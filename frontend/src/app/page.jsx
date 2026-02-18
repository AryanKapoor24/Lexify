import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />

      {/* Hero Section */}
      <main>
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Free to use
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              Privacy policies,
              <br />
              <span className="text-emerald-600">finally readable.</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Upload any legal document and get a clear, simple breakdown. 
              No more scrolling through pages of confusing legal jargon.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/upload"
                className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Upload a document
              </Link>
              <Link 
                href="/results"
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                See an example
              </Link>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gray-50 dark:bg-gray-900/50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4">
              How it works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-xl">
              Three simple steps to understand any legal document.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">1</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Upload your PDF</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Drag and drop any privacy policy or legal document in PDF format.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">2</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">We process it</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Our system reads through the document and identifies key information.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">3</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Get your summary</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Read a simplified version with all the important points clearly listed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4">
              Why Lexify?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-xl">
              Built for people who don&apos;t speak legalese.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4 p-5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Fast results</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Get your summary in seconds, not hours of reading.</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Nothing missed</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Every important detail captured and presented clearly.</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Private & secure</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Your documents are processed securely and not stored.</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Completely free</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No credit card, no sign up. Just upload and go.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-20 bg-gray-900 dark:bg-gray-800">
          <div className="max-w-3xl mx-auto text-center px-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Ready to understand your next privacy policy?
            </h2>
            <p className="text-gray-400 mb-8">
              It takes less than a minute. No account required.
            </p>
            <Link 
              href="/upload"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-lg font-medium transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
