import Link from 'next/link';

export default function Header({ showUploadButton = true }) {
  return (
    <header className="relative z-10 px-6 py-5">
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-xl font-semibold text-gray-800 dark:text-white tracking-tight">Lexify</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors">
            Home
          </Link>
          {showUploadButton ? (
            <Link 
              href="/upload"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm hover:shadow-md"
            >
              Upload Document
            </Link>
          ) : (
            <Link 
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
            >
              ← Back
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
