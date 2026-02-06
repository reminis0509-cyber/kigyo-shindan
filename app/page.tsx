'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDiagnosis } from '@/lib/context';

export default function LandingPage() {
  const router = useRouter();
  const { setEmail } = useDiagnosis();
  const [inputEmail, setInputEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!inputEmail) {
      setError('メールアドレスを入力してください');
      return;
    }

    if (!validateEmail(inputEmail)) {
      setError('有効なメールアドレスを入力してください');
      return;
    }

    setIsLoading(true);
    setEmail(inputEmail);
    router.push('/question/initial');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* ヘッダー */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            あなたに最適な
            <br />
            <span className="text-blue-600">起業プラン</span>を
            <br />
            無料診断
          </h1>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            初期費用、目標月収、必要な時間から、
            <br />
            最も稼ぎやすいビジネスを診断します
          </p>
        </div>

        {/* 特徴リスト */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-sm">1</span>
            </div>
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">7つの質問</span>に答えるだけ
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-sm">2</span>
            </div>
            <p className="text-gray-700 text-sm">
              あなたに<span className="font-semibold">最適な3つのビジネス</span>を提案
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-sm">3</span>
            </div>
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">初期費用・月収・必要時間</span>が一目でわかる
            </p>
          </div>
        </div>

        {/* メールフォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              placeholder="メールアドレスを入力"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-500"
              disabled={isLoading}
            />
            {error && (
              <p className="mt-2 text-red-500 text-sm">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '読み込み中...' : '無料で診断を始める'}
          </button>
        </form>

        {/* 注意事項 */}
        <p className="text-center text-xs text-gray-500">
          診断結果はメールでもお届けします。
          <br />
          ※収益は個人差があり、保証するものではありません。
        </p>
      </div>
    </main>
  );
}
