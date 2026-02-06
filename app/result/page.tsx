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

// FAQ Accordion Item
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 bg-white hover:bg-gray-50 flex justify-between items-center"
      >
        <span className="font-medium text-sm">{question}</span>
        <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="bg-gray-50 px-4 py-3">
          <p className="text-sm text-gray-700">{answer}</p>
        </div>
      )}
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
    <main className="min-h-screen flex flex-col items-center">
      {/* 診断結果セクション */}
      <div className="w-full px-4 py-12">
        <div className="max-w-md mx-auto space-y-8">
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

          {/* 注意事項 */}
          <p className="text-center text-xs text-gray-500">
            診断結果はご登録いただいたメールアドレスにもお送りしています。
          </p>
        </div>
      </div>

      {/* 移行セクション */}
      <div className="w-full bg-gradient-to-b from-white to-blue-50 py-12 px-4">
        <div className="max-w-md mx-auto text-center space-y-4">
          <p className="text-4xl">💡</p>
          <h2 className="text-xl font-bold text-gray-900">
            診断結果は分かった。<br />
            <span className="text-blue-600">でも、何から始めればいい？</span>
          </h2>
          <p className="text-gray-600 text-sm">
            「やりたいこと」が見つかっても、<br />
            具体的な行動が分からないと前に進めません。
          </p>
        </div>
      </div>

      {/* 上部購入ボタンセクション */}
      <div className="w-full bg-blue-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* 起業スタートキット */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 text-center">
              <p className="text-3xl mb-2">🎁</p>
              <h3 className="text-xl font-bold mb-2">起業スタートキット</h3>
              <p className="text-sm text-gray-600 mb-3">自分のペースで進めたい方へ</p>
              <p className="text-3xl font-bold text-green-600 mb-1">3,980<span className="text-lg">円</span></p>
              <p className="text-xs text-gray-500 mb-4">30日間のロードマップ + テンプレート12点 + 個別相談30分</p>
              <a
                href={STRIPE_PAYMENT_LINK}
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                今すぐ購入する
              </a>
            </div>

            {/* 起業サポートサービス */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-2xl p-6 text-center">
              <p className="text-3xl mb-2">💎</p>
              <h3 className="text-xl font-bold mb-2">起業サポートサービス</h3>
              <p className="text-sm text-gray-600 mb-3">プロに任せて確実にローンチしたい方へ</p>
              <p className="text-3xl font-bold text-purple-600 mb-1">49,800<span className="text-lg">円</span></p>
              <p className="text-xs text-gray-500 mb-4">事業計画書作成 + Webサイト制作 + SNS投稿代行 + 面談8回</p>
              <a
                href={STRIPE_MVP_LINK}
                className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                今すぐ申し込む
              </a>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">
            ✓ 安心の返金保証 ✓ クレジットカード・デビットカード対応 ✓ Stripe決済で安全
          </p>
        </div>
      </div>

      {/* 問題提起セクション */}
      <div className="w-full bg-gray-50 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-center mb-8">こんな悩みはありませんか？</h2>
          <div className="space-y-3">
            {[
              '起業したいけど、何から始めればいいか分からない',
              '事業計画書の書き方が分からない',
              'SNSで集客する方法が分からない',
              '一人で進めるのが不安',
              '失敗したくない',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                <span className="text-gray-300">□</span>
                <p className="text-gray-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-gray-600">
            そのお悩み、<span className="text-blue-600 font-bold">起業スタートキット</span>が解決します
          </p>
        </div>
      </div>

      {/* 起業スタートキット詳細 */}
      <div className="w-full py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-4xl mb-4">🎁</p>
            <h2 className="text-2xl font-bold mb-4">起業スタートキット</h2>
            <div className="mb-4">
              <span className="text-gray-400 line-through text-lg">通常価格 9,800円</span>
              <span className="text-yellow-500 font-bold text-2xl ml-2">→ 今だけ 3,980円</span>
              <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded ml-2">59%OFF</span>
            </div>
            <p className="text-gray-600">
              30日間、毎日やることを明確に示したロードマップで、<br className="hidden md:block" />迷わず起業できます
            </p>
          </div>

          {/* 30日間ロードマップ（プレビュー） */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-10">
            <h3 className="text-lg font-bold text-center mb-2">📅 30日間ロードマップ</h3>
            <p className="text-center text-sm text-gray-500 mb-6">毎日やることが明確だから迷わない</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-blue-600 text-white rounded-lg p-4 text-center">
                <p className="font-bold">Week 1</p>
                <p className="text-xs opacity-90">事業の土台作り</p>
              </div>
              <div className="bg-blue-500 text-white rounded-lg p-4 text-center">
                <p className="font-bold">Week 2</p>
                <p className="text-xs opacity-90">集客の準備</p>
              </div>
              <div className="bg-blue-400 text-white rounded-lg p-4 text-center">
                <p className="font-bold">Week 3</p>
                <p className="text-xs opacity-90">実践開始</p>
              </div>
              <div className="bg-blue-700 text-white rounded-lg p-4 text-center">
                <p className="font-bold">Week 4</p>
                <p className="text-xs opacity-90">ローンチ＆初受注</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold mb-4 text-blue-600 flex items-center gap-2">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Week 1</span>
                事業の土台作り（1〜7日目）
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between bg-gray-50 p-3 rounded">
                  <span>Day 1: 強み発見ワークシート</span>
                  <span className="text-gray-500">30分</span>
                </div>
                <div className="flex justify-between bg-gray-50 p-3 rounded">
                  <span>Day 2: 事業アイデア選定</span>
                  <span className="text-gray-500">1時間</span>
                </div>
                <div className="flex justify-between bg-gray-50 p-3 rounded">
                  <span>Day 3: 事業計画書作成</span>
                  <span className="text-gray-500">30分</span>
                </div>
                <div className="flex justify-between bg-gray-100 p-3 rounded text-gray-400">
                  <span>Day 4〜7: ...</span>
                  <span className="text-xs">購入後に公開</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-center text-sm text-gray-500">
                  🔒 Week 2〜4の詳細は購入後にご覧いただけます
                </p>
              </div>
            </div>
          </div>

          {/* キット内容 */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-center mb-6">📦 キット内容（12点セット）</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: '📅', name: '30日間起業ロードマップ', desc: '毎日やることが明確に分かる' },
                { icon: '📋', name: '事業計画書テンプレート', desc: '30分で完成する穴埋め式' },
                { icon: '📱', name: 'SNS投稿テンプレート50個', desc: 'コピペで使える投稿文' },
                { icon: '💬', name: 'DM営業テンプレート10個', desc: '成約率30%超えの実績' },
                { icon: '🎯', name: 'ターゲットリスト作成シート', desc: '誰に売るかを明確化' },
                { icon: '💰', name: '価格設定シート', desc: '適正価格を自動計算' },
                { icon: '📄', name: '契約書・請求書テンプレート', desc: 'そのまま使える実務書類' },
                { icon: '📊', name: '進捗管理シート', desc: '毎日の進捗を記録' },
                { icon: '💪', name: '強み発見シート', desc: 'あなたの強みを可視化' },
                { icon: '💡', name: '事業アイデア選定シート', desc: '稼げる事業を選ぶ基準' },
                { icon: '🤝', name: '商談マニュアル', desc: '成約率を上げる進め方' },
                { icon: '😊', name: '顧客対応マニュアル', desc: '満足度を高める対応方法' },
              ].map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <p className="text-2xl mb-2">{item.icon}</p>
                  <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 特典 */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-6 text-white mb-10 text-center">
            <p className="text-3xl mb-2">🎁</p>
            <h3 className="text-xl font-bold mb-4">30分の個別相談（Zoom）1回付き</h3>
            <p className="mb-4">購入後いつでも予約可能</p>
            <div className="bg-white/20 rounded-xl p-4 text-left max-w-md mx-auto">
              <ul className="space-y-2 text-sm">
                <li>✓ 事業アイデアのブラッシュアップ</li>
                <li>✓ SNS投稿の添削</li>
                <li>✓ DM営業文の添削</li>
                <li>✓ 価格設定の相談</li>
                <li>✓ その他起業に関する疑問なんでも</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mb-10">
            <a
              href={STRIPE_PAYMENT_LINK}
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-5 px-10 rounded-xl text-xl shadow-lg transition-all hover:shadow-xl"
            >
              今すぐ3,980円で購入する
            </a>
            <div className="mt-4 text-sm text-gray-500 space-y-1">
              <p>✓ 30日間返金保証</p>
              <p>✓ クレジットカード・デビットカード対応</p>
            </div>
          </div>
        </div>
      </div>

      {/* 起業サポートサービス詳細 */}
      <div className="w-full bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-4xl mb-4">💎</p>
            <h2 className="text-2xl font-bold mb-2">起業サポートサービス</h2>
            <p className="text-gray-600 mb-4">本気で起業したい人のための完全サポート</p>
            <div className="mb-4">
              <span className="text-gray-400 line-through text-lg">通常価格 98,000円</span>
              <span className="text-purple-600 font-bold text-2xl ml-2">→ 今だけ 49,800円</span>
              <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded ml-2">49%OFF</span>
            </div>
            <p className="text-gray-500 text-sm">分割払い: 24,900円×2回</p>
          </div>

          {/* サービス内容 */}
          <div className="space-y-4 mb-10">
            <div className="bg-white rounded-xl p-6 border-l-4 border-blue-600">
              <h4 className="font-bold text-blue-600 mb-4">Phase 1: 事業設計（Week 1-2）</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span>初回ヒアリング（90分）</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span>市場調査・競合分析</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span>本格的な事業計画書作成</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span>ターゲット顧客の明確化</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-yellow-500">
              <h4 className="font-bold text-yellow-600 mb-4">Phase 2: MVP制作（Week 3-6）</h4>
              <p className="text-sm text-gray-600 mb-3">選べる4パターン:</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-bold text-xs mb-1">Webサービス系</p>
                  <p className="text-xs text-gray-600">LP・Webサイト構築</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-bold text-xs mb-1">SNS・コンテンツ系</p>
                  <p className="text-xs text-gray-600">SNS最適化・販売ページ</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-bold text-xs mb-1">EC物販系</p>
                  <p className="text-xs text-gray-600">Shopify/BASEストア</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-bold text-xs mb-1">サービス業系</p>
                  <p className="text-xs text-gray-600">LINE公式・予約システム</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-green-500">
              <h4 className="font-bold text-green-600 mb-4">Phase 3: 集客準備（Week 7-8）</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span>SNS投稿10本作成・投稿代行</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span>DM営業代行（50件）</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span>営業・顧客対応マニュアル提供</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500">
              <h4 className="font-bold text-purple-600 mb-4">継続サポート（全期間）</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span>月2回のZoom面談（計8回）</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span>チャットサポート（無制限）</li>
              </ul>
            </div>
          </div>

          {/* 成果保証 */}
          <div className="bg-green-50 border border-green-300 rounded-xl p-6 mb-10 text-center">
            <h3 className="font-bold text-green-800 mb-4">🛡️ 成果保証</h3>
            <p className="text-gray-700 mb-4">
              もし期間内に事業がローンチできなかった場合、<span className="font-bold text-green-700">全額返金</span>
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href={STRIPE_MVP_LINK}
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 px-10 rounded-xl text-xl shadow-lg transition-all hover:shadow-xl"
            >
              今すぐ49,800円で申し込む
            </a>
            <div className="mt-4 text-sm text-gray-500 space-y-1">
              <p>✓ 成果保証付き</p>
              <p>✓ 分割払い対応</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="w-full py-12 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-center mb-8">よくある質問</h2>
          <div className="space-y-3">
            <FAQItem
              question="Q. 起業スタートキットと起業サポートサービス、どちらを選べばいい？"
              answer="まず起業の基礎を学びたい、自分でやってみたい方 → 起業スタートキット。プロに任せて確実にローンチしたい、時間を買いたい方 → 起業サポートサービス"
            />
            <FAQItem
              question="Q. 事業アイデアが決まってないけど申し込める？"
              answer="はい。起業スタートキットには個別相談が含まれており、起業サポートサービスでは初回ヒアリングで一緒に考えます。アイデアがなくても大丈夫です。"
            />
            <FAQItem
              question="Q. パソコンスキルがないけど大丈夫？"
              answer="問題ありません。テンプレートは初心者でも使えるよう設計されており、起業サポートサービスでは操作方法も丁寧にレクチャーします。"
            />
            <FAQItem
              question="Q. 副業でも起業できる？"
              answer="はい。起業スタートキットは1日30分〜2時間の作業時間があれば進められます。起業サポートサービスは週10時間程度の作業時間があれば可能です。"
            />
            <FAQItem
              question="Q. 返金保証はある？"
              answer="起業スタートキットは購入から30日以内なら理由を問わず全額返金。起業サポートサービスは条件を満たした上でローンチできなかった場合に全額返金します。"
            />
          </div>
        </div>
      </div>

      {/* 比較表 */}
      <div className="w-full bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8">プラン比較</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl overflow-hidden shadow-sm text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">項目</th>
                  <th className="p-3 text-center bg-green-50">スタートキット</th>
                  <th className="p-3 text-center bg-purple-50">サポートサービス</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3 font-medium">価格</td>
                  <td className="p-3 text-center text-green-600 font-bold">3,980円</td>
                  <td className="p-3 text-center text-purple-600 font-bold">49,800円</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="p-3 font-medium">期間</td>
                  <td className="p-3 text-center">30日間</td>
                  <td className="p-3 text-center">1〜2ヶ月</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-medium">サポート</td>
                  <td className="p-3 text-center">相談30分×1回</td>
                  <td className="p-3 text-center">面談60分×8回</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="p-3 font-medium">こんな人向け</td>
                  <td className="p-3 text-center">自分でやりたい</td>
                  <td className="p-3 text-center">プロに任せたい</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 最終CTA */}
      <div className="w-full bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">
            今すぐ起業への第一歩を踏み出しませんか？
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={STRIPE_PAYMENT_LINK}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-xl transition-colors"
            >
              起業スタートキット<br /><span className="text-sm font-normal">3,980円で購入</span>
            </a>
            <a
              href={STRIPE_MVP_LINK}
              className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 px-8 rounded-xl transition-colors"
            >
              起業サポートサービス<br /><span className="text-sm font-normal">49,800円で申し込む</span>
            </a>
          </div>
          <div className="mt-6 text-sm opacity-90">
            <p>✓ 安心の返金保証 ✓ Stripe決済で安全</p>
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="w-full bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm">© 2025 起業サポート. All rights reserved.</p>
          <p className="text-xs mt-2">※収益は個人差があり、保証するものではありません。</p>
        </div>
      </footer>
    </main>
  );
}
