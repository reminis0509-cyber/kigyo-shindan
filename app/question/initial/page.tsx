'use client';

import { useRouter } from 'next/navigation';
import { useDiagnosis } from '@/lib/context';

export default function InitialQuestion() {
  const router = useRouter();
  const { userData, setLayer } = useDiagnosis();

  // メールアドレスがない場合はトップページへ
  if (!userData.email) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  const handleSelectA = () => {
    setLayer('A');
    // 商品詳細ページ（/kit）に遷移
    router.push('/kit');
  };

  const handleSelectB = () => {
    setLayer('B');
    router.push('/question/1');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* ヘッダー */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            あなたの状況に
            <br />
            最も近いのはどちらですか？
          </h1>
        </div>

        {/* 選択肢カード */}
        <div className="space-y-4">
          <button
            onClick={handleSelectA}
            className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-500 rounded-xl p-6 text-left transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                <span className="text-blue-600 font-semibold group-hover:text-white transition-colors">A</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  すでにやりたい事業が決まっている
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  手順が知りたい
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleSelectB}
            className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-500 rounded-xl p-6 text-left transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                <span className="text-blue-600 font-semibold group-hover:text-white transition-colors">B</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  やりたいことは決まってないけど、とにかく稼ぎたい
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  最適なビジネスを診断したい
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* プログレス表示 */}
        <div className="text-center text-sm text-gray-500">
          まずは1つ選んでください
        </div>
      </div>
    </main>
  );
}
