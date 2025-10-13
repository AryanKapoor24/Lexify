import Link from 'next/link';

export default function Header({ showUploadButton = true }) {
  return (
    <header className="relative z-10 px-6 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PP</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Privacy Analyzer</span>
        </Link>
        {showUploadButton ? (
          <Link 
            href="/upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Analyze Now
          </Link>
        ) : (
          <Link 
            href="/"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        )}
      </nav>
    </header>
  );
}
