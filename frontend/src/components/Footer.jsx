export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-semibold text-gray-800 dark:text-white">Lexify</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Making legal documents understandable for everyone.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-4 text-sm">Product</h3>
            <ul className="space-y-2.5 text-gray-500 dark:text-gray-400 text-sm">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">API</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-4 text-sm">Support</h3>
            <ul className="space-y-2.5 text-gray-500 dark:text-gray-400 text-sm">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Docs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-4 text-sm">Legal</h3>
            <ul className="space-y-2.5 text-gray-500 dark:text-gray-400 text-sm">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-8 text-center text-gray-400 text-sm">
          <p>© 2026 Lexify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
