import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const STARTER_KIT_LINK = 'https://drive.google.com/drive/folders/1Imw2DNnTN3h4zGwE1TQrH5KOpWt2Fjgq?usp=sharing';
const SUPPORT_SERVICE_LINK = 'https://drive.google.com/drive/folders/1Imw2DNnTN3h4zGwE1TQrH5KOpWt2Fjgq?usp=sharing';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '');
}

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

async function sendStarterKitEmail(email: string) {
  const subject = '【購入完了】起業スタートキットをお届けします';
  const body = `${email}様

この度は「起業スタートキット」をご購入いただき、誠にありがとうございます！

━━━━━━━━━━━━━━━━━━
起業スタートキット ダウンロード
━━━━━━━━━━━━━━━━━━

以下のリンクからキットの内容をダウンロードしてください：

${STARTER_KIT_LINK}

━━━━━━━━━━━━━━━━━━
キット内容（12点セット）
━━━━━━━━━━━━━━━━━━

✓ 30日間起業ロードマップ
✓ 事業計画書テンプレート
✓ SNS投稿テンプレート50個
✓ DM営業テンプレート10個
✓ ターゲットリスト作成シート
✓ 価格設定シート
✓ 契約書・請求書テンプレート
✓ 進捗管理シート
✓ 強み発見シート
✓ 事業アイデア選定シート
✓ 商談マニュアル
✓ 顧客対応マニュアル

━━━━━━━━━━━━━━━━━━
30分の個別相談（Zoom）について
━━━━━━━━━━━━━━━━━━

ご購入特典の30分個別相談をご希望の場合は、
このメールに返信してご希望の日時をお知らせください。

━━━━━━━━━━━━━━━━━━

ご不明な点がございましたら、お気軽にご連絡ください。
あなたの起業成功を心より応援しています！

起業サポート
`;

  await getTransporter().sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: subject,
    text: body,
  });

  console.log(`Starter kit email sent to ${email}`);
}

async function sendSupportServiceEmail(email: string) {
  const subject = '【購入完了】起業サポートサービスへようこそ';
  const body = `${email}様

この度は「起業サポートサービス」にお申し込みいただき、誠にありがとうございます！

━━━━━━━━━━━━━━━━━━
資料ダウンロード
━━━━━━━━━━━━━━━━━━

まずは以下のリンクから資料をご確認ください：

${SUPPORT_SERVICE_LINK}

━━━━━━━━━━━━━━━━━━
今後の流れ
━━━━━━━━━━━━━━━━━━

1. 初回ヒアリング（90分）の日程調整
   → このメールに返信してご希望の日時をお知らせください

2. 事業設計（Week 1-2）
   - 市場調査・競合分析
   - 事業計画書作成
   - ターゲット顧客の明確化

3. MVP制作（Week 3-6）
   - あなたの事業に合わせた制作

4. 集客準備（Week 7-8）
   - SNS投稿作成・投稿代行
   - DM営業代行

5. ローンチ（Week 9）

━━━━━━━━━━━━━━━━━━
サポート体制
━━━━━━━━━━━━━━━━━━

✓ 月2回のZoom面談（計8回）
✓ チャットサポート（無制限）

━━━━━━━━━━━━━━━━━━

まずは初回ヒアリングの日程を調整させてください。
ご希望の日時を3つほどお知らせいただけると幸いです。

あなたの起業を全力でサポートいたします！

起業サポート
`;

  await getTransporter().sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: subject,
    text: body,
  });

  console.log(`Support service email sent to ${email}`);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('No stripe signature found');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const amountTotal = session.amount_total;

    console.log('Checkout completed:', { customerEmail, amountTotal });

    if (customerEmail) {
      try {
        // 金額で商品を判別（3,980円 = 398000 cents、49,800円 = 4980000 cents）
        if (amountTotal && amountTotal <= 500000) {
          // 起業スタートキット（3,980円）
          await sendStarterKitEmail(customerEmail);
        } else {
          // 起業サポートサービス（49,800円）
          await sendSupportServiceEmail(customerEmail);
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }
  }

  return NextResponse.json({ received: true });
}
