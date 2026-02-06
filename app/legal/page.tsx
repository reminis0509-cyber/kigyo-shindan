export default function LegalNotice() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">特定商取引法に基づく表記</h1>

        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="font-bold text-gray-900 mb-2">販売業者</h2>
            <p className="text-gray-700">[販売業者名を入力してください]</p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h2 className="font-bold text-gray-900 mb-2">運営統括責任者</h2>
            <p className="text-gray-700">[責任者名を入力してください]</p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h2 className="font-bold text-gray-900 mb-2">所在地</h2>
            <p className="text-gray-700">[住所を入力してください]</p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h2 className="font-bold text-gray-900 mb-2">電話番号</h2>
            <p className="text-gray-700">[電話番号を入力してください]</p>
            <p className="text-sm text-gray-500 mt-1">※お問い合わせはメールにてお願いいたします</p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h2 className="font-bold text-gray-900 mb-2">メールアドレス</h2>
            <p className="text-gray-700">[メールアドレスを入力してください]</p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h2 className="font-bold text-gray-900 mb-2">販売URL</h2>
            <p className="text-gray-700">[サイトURLを入力してください]</p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h2 className="font-bold text-gray-900 mb-2">販売価格</h2>
            <div className="text-gray-700 space-y-1">
              <p>起業スタートキット: 3,980円（税込）</p>
              <p>MVPローンチ代行サービス: 49,800円（税込）</p>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h2 className="font-bold text-gray-900 mb-2">商品以外の必要料金</h2>
            <p className="text-gray-700">なし</p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h2 className="font-bold text-gray-900 mb-2">お支払い方法</h2>
            <p className="text-gray-700">クレジットカード（Stripe経由）</p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h2 className="font-bold text-gray-900 mb-2">お支払い時期</h2>
            <p className="text-gray-700">ご注文時にお支払いが確定します</p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h2 className="font-bold text-gray-900 mb-2">商品の引き渡し時期</h2>
            <p className="text-gray-700">決済完了後、即時ダウンロード可能</p>
            <p className="text-sm text-gray-500 mt-1">※個別相談の日程は別途調整いたします</p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h2 className="font-bold text-gray-900 mb-2">返品・キャンセルについて</h2>
            <p className="text-gray-700">
              デジタルコンテンツという商品の性質上、購入後の返品・キャンセルはお受けしておりません。
            </p>
          </div>

          <div className="pb-4">
            <h2 className="font-bold text-gray-900 mb-2">注意事項</h2>
            <p className="text-gray-700">
              当サービスで提供する情報は、収益を保証するものではありません。
              実際の収益は個人の努力や市場環境により異なります。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
