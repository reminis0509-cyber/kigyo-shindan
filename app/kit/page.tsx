'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDiagnosis } from '@/lib/context';
import { STRIPE_PAYMENT_LINK, STRIPE_MVP_LINK } from '@/lib/config';

export default function KitPage() {
  const router = useRouter();
  const { userData } = useDiagnosis();
  const apiCalledRef = useRef(false);

  useEffect(() => {
    // メールアドレスがない場合はトップページへリダイレクト
    if (!userData.email) {
      router.push('/');
      return;
    }

    // 層Aの場合、APIを呼び出してメール送信（1回だけ）
    if (!apiCalledRef.current && userData.layer === 'A') {
      apiCalledRef.current = true;

      fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          layer: 'A',
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('API response:', data);
        })
        .catch((error) => {
          console.error('API error:', error);
        });
    }
  }, [userData, router]);

  if (!userData.email) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <p className="text-blue-600 font-semibold">やりたい事業が決まっている方へ</p>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            あとは
            <span className="text-blue-600">「具体的な手順」</span>
            を<br />
            知るだけで起業できます
          </h1>
        </div>

        {/* メインオファー */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 space-y-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              🎁 起業スタートキット
            </p>
            <p className="text-4xl font-bold text-green-600 mt-3">
              3,980<span className="text-xl">円</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">（税込）</p>
          </div>

          <div className="bg-white rounded-xl p-4 space-y-3">
            <p className="font-semibold text-gray-800 text-center">キット内容</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-lg">✓</span>
                <div>
                  <p className="font-medium">事業計画書テンプレート</p>
                  <p className="text-xs text-gray-500">すぐに使える実践的なテンプレート</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-lg">✓</span>
                <div>
                  <p className="font-medium">SNS投稿テンプレート50個</p>
                  <p className="text-xs text-gray-500">そのまま使える投稿文テンプレート</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-lg">✓</span>
                <div>
                  <p className="font-medium">DM営業テンプレート10個</p>
                  <p className="text-xs text-gray-500">成約率の高いDMテンプレート</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-lg">✓</span>
                <div>
                  <p className="font-medium">30分の個別相談（Zoom）1回付き</p>
                  <p className="text-xs text-gray-500">プロに直接相談できる</p>
                </div>
              </li>
            </ul>
          </div>

          <a
            href={STRIPE_PAYMENT_LINK}
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors text-lg shadow-lg hover:shadow-xl"
          >
            今すぐ購入する
          </a>

          <p className="text-center text-xs text-gray-500">
            ※決済はStripeで安全に処理されます
          </p>
        </div>

        {/* このキットで得られること */}
        <div className="bg-white rounded-xl p-6 space-y-4 border border-gray-200">
          <h2 className="font-bold text-gray-900 text-lg text-center">
            このキットがあれば...
          </h2>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">1</span>
              今日から起業準備を始められる
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">2</span>
              何から始めればいいか迷わない
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">3</span>
              プロに直接相談できるから安心
            </li>
          </ul>
        </div>

        {/* MVPサービスセクション */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6 space-y-4">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              💎 さらにサポートが必要な方へ
            </p>
            <p className="text-sm text-gray-600 mt-1">
              MVPローンチ代行サービス
            </p>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              49,800<span className="text-lg">円</span>
            </p>
          </div>

          <p className="text-sm text-gray-700 text-center">
            事業計画書作成からWebサイト制作、SNS投稿代行まで
            <br />
            すべてお任せください。
          </p>

          <a
            href={STRIPE_MVP_LINK}
            className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
          >
            詳細を見る
          </a>
        </div>

        {/* 戻るリンク */}
        <div className="text-center">
          <button
            onClick={() => router.push('/question/initial')}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            ← 診断を受けてみる
          </button>
        </div>

        {/* 注意事項 */}
        <p className="text-center text-xs text-gray-500">
          ※収益は個人差があり、保証するものではありません。
        </p>
      </div>
    </main>
  );
}
