'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDiagnosis } from '@/lib/context';
import { diagnose } from '@/lib/diagnosis';
import { Business, DiagnosisAnswers } from '@/lib/types';
import { STRIPE_PAYMENT_LINK, STRIPE_MVP_LINK } from '@/lib/config';

function BusinessCard({ business, rank }: { business: Business; rank: number }) {
  const rankColors = {
    1: 'border-yellow-400 bg-yellow-50',
    2: 'border-gray-400 bg-gray-50',
    3: 'border-amber-600 bg-amber-50',
  };

  const rankLabels = {
    1: '1位',
    2: '2位',
    3: '3位',
  };

  const rankIcons = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  };

  return (
    <div className={`border-2 rounded-xl p-6 space-y-4 ${rankColors[rank as keyof typeof rankColors]}`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{rankIcons[rank as keyof typeof rankIcons]}</span>
        <span className="font-bold text-gray-800">【{rankLabels[rank as keyof typeof rankLabels]}】{business.name}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-white rounded-lg p-3">
          <p className="text-gray-500 text-xs">初期費用</p>
          <p className="font-semibold text-gray-900">{business.cost}</p>
        </div>
        <div className="bg-white rounded-lg p-3">
          <p className="text-gray-500 text-xs">目標月収</p>
          <p className="font-semibold text-gray-900">{business.revenue}</p>
        </div>
        <div className="bg-white rounded-lg p-3">
          <p className="text-gray-500 text-xs">必要時間</p>
          <p className="font-semibold text-gray-900">{business.time}</p>
        </div>
        <div className="bg-white rounded-lg p-3">
          <p className="text-gray-500 text-xs">成功率</p>
          <p className="font-semibold text-gray-900">{business.successRate}</p>
        </div>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed">{business.description}</p>

      <p className="text-xs text-gray-500">※収益は個人の努力により異なります。保証するものではありません。</p>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const { userData, setResult } = useDiagnosis();
  const [isLoading, setIsLoading] = useState(true);
  const apiCalledRef = useRef(false);

  useEffect(() => {
    // 必要なデータがない場合はリダイレクト
    if (!userData.email) {
      router.push('/');
      return;
    }

    if (!userData.answers) {
      router.push('/question/1');
      return;
    }

    // すべての質問に回答しているかチェック
    const allAnswered = Object.values(userData.answers).every((answer) => answer !== '');
    if (!allAnswered) {
      router.push('/question/1');
      return;
    }

    // 診断結果を計算
    if (!userData.result) {
      const result = diagnose(userData.answers as DiagnosisAnswers);
      setResult(result);
    }

    // APIを呼び出してメール送信（1回だけ）
    if (!apiCalledRef.current && userData.answers) {
      apiCalledRef.current = true;

      fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          layer: 'B',
          answers: userData.answers,
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

    setIsLoading(false);
  }, [userData, router, setResult]);

  if (isLoading || !userData.result) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">診断結果を計算中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <p className="text-blue-600 font-semibold">診断完了</p>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            あなたにピッタリの
            <br />
            起業プランが見つかりました！
          </h1>
        </div>

        {/* 診断結果カード */}
        <div className="space-y-4">
          <BusinessCard business={userData.result.rank1} rank={1} />
          <BusinessCard business={userData.result.rank2} rank={2} />
          <BusinessCard business={userData.result.rank3} rank={3} />
        </div>

        {/* 購入ボタンセクション */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 space-y-4">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              🎁 起業スタートキット
            </p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              3,980<span className="text-lg">円</span>
            </p>
          </div>

          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              事業計画書テンプレート
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              SNS投稿テンプレート50個
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              DM営業テンプレート10個
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              30分の個別相談（Zoom）1回付き
            </li>
          </ul>

          <a
            href={STRIPE_PAYMENT_LINK}
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors text-lg"
          >
            今すぐ購入する
          </a>
        </div>

        {/* MVPサービスセクション */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6 space-y-4">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              💎 本気で起業したい方へ
            </p>
            <p className="text-sm text-gray-600 mt-1">
              起業サポートサービス
            </p>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              49,800<span className="text-lg">円</span>
            </p>
          </div>

          <p className="text-sm text-gray-700 text-center">
            あなたの事業を2ヶ月で完全ローンチ！
            <br />
            事業計画書作成、Webサイト制作、SNS投稿代行など
          </p>

          <a
            href={STRIPE_MVP_LINK}
            className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors text-lg"
          >
            今すぐ購入する
          </a>
        </div>

        {/* 注意事項 */}
        <p className="text-center text-xs text-gray-500">
          診断結果はご登録いただいたメールアドレスにもお送りしています。
          <br />
          ※収益は個人差があり、保証するものではありません。
        </p>
      </div>
    </main>
  );
}
