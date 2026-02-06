import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-md mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-gray-700 transition-colors">
            プライバシーポリシー
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/legal" className="hover:text-gray-700 transition-colors">
            特定商取引法に基づく表記
          </Link>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          &copy; 2025 起業診断サービス. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
