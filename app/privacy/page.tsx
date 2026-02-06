export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>

        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-2">1. 個人情報の収集</h2>
            <p>
              当サービスでは、診断サービスの提供およびサービス向上のため、以下の個人情報を収集することがあります。
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>メールアドレス</li>
              <li>診断の回答内容</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-2">2. 個人情報の利用目的</h2>
            <p>収集した個人情報は、以下の目的で利用いたします。</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>診断結果のメール送信</li>
              <li>サービスに関するお知らせの配信</li>
              <li>サービスの改善・新規サービスの開発</li>
              <li>お問い合わせへの対応</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-2">3. 個人情報の第三者提供</h2>
            <p>
              当サービスは、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-2">4. 個人情報の管理</h2>
            <p>
              当サービスは、個人情報の漏洩、滅失、毀損を防止するため、適切なセキュリティ対策を講じます。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-2">5. Cookieの使用</h2>
            <p>
              当サービスでは、ユーザー体験の向上のためCookieを使用することがあります。
              ブラウザの設定によりCookieを無効にすることも可能ですが、一部機能が制限される場合があります。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-2">6. プライバシーポリシーの変更</h2>
            <p>
              当サービスは、必要に応じて本ポリシーを変更することがあります。
              変更後のプライバシーポリシーは、当ページに掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-2">7. お問い合わせ</h2>
            <p>
              個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください。
            </p>
            <p className="mt-2">
              メール: [お問い合わせ用メールアドレスを設定してください]
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            制定日: 2025年2月6日
          </p>
        </div>
      </div>
    </main>
  );
}
