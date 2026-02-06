import nodemailer from 'nodemailer';

interface Business {
  name: string;
  cost: string;
  revenue: string;
  time: string;
  successRate: string;
  description: string;
}

interface DiagnosisResult {
  rank1: Business;
  rank2: Business;
  rank3: Business;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendDiagnosisEmail(
  toEmail: string,
  result: DiagnosisResult | null,
  layer: 'A' | 'B',
  senderName: string = '起業診断サービス'
): Promise<boolean> {
  const gmailUser = process.env.GMAIL_USER;
  const stripeKitLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '#';
  const stripeMvpLink = process.env.NEXT_PUBLIC_STRIPE_MVP_LINK || '#';

  if (!gmailUser || !process.env.GMAIL_APP_PASSWORD) {
    console.log('Gmail credentials not configured');
    return false;
  }

  let subject: string;
  let body: string;

  if (layer === 'B' && result) {
    subject = '【診断結果】あなたにピッタリの起業プラン';
    body = `${toEmail}様

起業診断をご利用いただき、ありがとうございました！
あなたの回答をもとに、最適な起業プランを診断しました。

━━━━━━━━━━━━━━━━━━
診断結果
━━━━━━━━━━━━━━━━━━

【1位】${result.rank1.name}
初期費用：${result.rank1.cost}
目標月収：${result.rank1.revenue}
必要時間：${result.rank1.time}

【2位】${result.rank2.name}
初期費用：${result.rank2.cost}
目標月収：${result.rank2.revenue}
必要時間：${result.rank2.time}

【3位】${result.rank3.name}
初期費用：${result.rank3.cost}
目標月収：${result.rank3.revenue}
必要時間：${result.rank3.time}

※収益は個人の努力により異なります。保証するものではありません。

━━━━━━━━━━━━━━━━━━
特別オファー
━━━━━━━━━━━━━━━━━━

今なら「起業スタートキット」を
特別価格3,980円でご提供！

✓ 事業計画書テンプレート
✓ SNS投稿テンプレート50個
✓ DM営業テンプレート10個
✓ 30分の個別相談（Zoom）1回付き

今すぐ購入する：${stripeKitLink}

━━━━━━━━━━━━━━━━━━
本気で起業したい方へ
━━━━━━━━━━━━━━━━━━

「MVPローンチ代行サービス」
あなたの事業を2ヶ月で完全ローンチ！

料金：49,800円
内容：事業計画書作成、Webサイト制作、SNS投稿代行など

詳細を見る：${stripeMvpLink}

━━━━━━━━━━━━━━━━━━

何か質問があれば、いつでもご連絡ください！
一緒に起業を成功させましょう

${senderName}
`;
  } else {
    subject = '起業スタートキットのご案内';
    body = `${toEmail}様

すでにやりたい事業が決まっているとのこと、素晴らしいですね！
あとは「具体的な手順」を知るだけで、すぐに起業できます。

━━━━━━━━━━━━━━━━━━
起業スタートキット（3,980円）
━━━━━━━━━━━━━━━━━━

✓ 事業計画書テンプレート
✓ SNS投稿テンプレート50個
✓ DM営業テンプレート10個
✓ 30分の個別相談（Zoom）1回付き

このキットがあれば、今日から起業準備を始められます。

今すぐ購入する：${stripeKitLink}

━━━━━━━━━━━━━━━━━━
さらにサポートが必要な方へ
━━━━━━━━━━━━━━━━━━

「MVPローンチ代行サービス」（49,800円）
事業計画書作成からWebサイト制作、SNS投稿代行まで
すべてお任せください。

詳細を見る：${stripeMvpLink}

━━━━━━━━━━━━━━━━━━

${senderName}
`;
  }

  try {
    await transporter.sendMail({
      from: gmailUser,
      to: toEmail,
      subject: subject,
      text: body,
    });

    console.log(`Email sent successfully to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}
