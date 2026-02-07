import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

// 商品のダウンロードリンク
const STARTER_KIT_LINK = 'https://drive.google.com/drive/folders/1Imw2DNnTN3h4zGwE1TQrH5KOpWt2Fjgq?usp=sharing';
const SUPPORT_SERVICE_LINK = 'https://drive.google.com/drive/folders/1Imw2DNnTN3h4zGwE1TQrH5KOpWt2Fjgq?usp=sharing';

// 環境判別とStripe設定を取得
function getStripeConfig() {
  // テスト環境変数があればテストモード、なければ本番モード
  const isTestMode = !!process.env.STRIPE_TEST_SECRET_KEY;

  const secretKey = isTestMode
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY;

  const webhookSecret = isTestMode
    ? process.env.STRIPE_TEST_WEBHOOK_SECRET
    : process.env.STRIPE_WEBHOOK_SECRET;

  return {
    isTestMode,
    secretKey: secretKey || '',
    webhookSecret: webhookSecret || '',
  };
}

// 環境変数のチェック
function validateEnvVars(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const config = getStripeConfig();

  if (!config.secretKey) {
    errors.push('Stripe Secret Keyが設定されていません（STRIPE_TEST_SECRET_KEY または STRIPE_SECRET_KEY）');
  }

  if (!config.webhookSecret) {
    errors.push('Stripe Webhook Secretが設定されていません（STRIPE_TEST_WEBHOOK_SECRET または STRIPE_WEBHOOK_SECRET）');
  }

  if (!process.env.GMAIL_USER) {
    errors.push('GMAIL_USERが設定されていません');
  }

  if (!process.env.GMAIL_APP_PASSWORD) {
    errors.push('GMAIL_APP_PASSWORDが設定されていません');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function getStripe() {
  const config = getStripeConfig();
  return new Stripe(config.secretKey);
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

  console.log(`[メール送信成功] スタートキット -> ${email}`);
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

  console.log(`[メール送信成功] サポートサービス -> ${email}`);
}

// 環境変数の状態を取得（デバッグ用）
function getEnvVarsStatus() {
  const testWebhookSecret = process.env.STRIPE_TEST_WEBHOOK_SECRET || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  return {
    hasStripeTestKey: !!process.env.STRIPE_TEST_SECRET_KEY,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasTestWebhookSecret: !!process.env.STRIPE_TEST_WEBHOOK_SECRET,
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    hasGmailUser: !!process.env.GMAIL_USER,
    hasGmailPass: !!process.env.GMAIL_APP_PASSWORD,
    gmailUser: process.env.GMAIL_USER ? `${process.env.GMAIL_USER.substring(0, 5)}...` : 'undefined',
    // Webhook Secretの先頭を表示（デバッグ用）
    testWebhookSecretPrefix: testWebhookSecret ? `${testWebhookSecret.substring(0, 10)}...` : 'not set',
    webhookSecretPrefix: webhookSecret ? `${webhookSecret.substring(0, 10)}...` : 'not set',
  };
}

export async function POST(request: NextRequest) {
  const config = getStripeConfig();
  const envStatus = getEnvVarsStatus();

  // デバッグログ: 環境情報
  console.log('========================================');
  console.log('[Webhook受信]', new Date().toISOString());
  console.log(`[環境] ${config.isTestMode ? 'テストモード' : '本番モード'}`);
  console.log(`[使用キー] ${config.isTestMode ? 'STRIPE_TEST_SECRET_KEY' : 'STRIPE_SECRET_KEY'}`);
  console.log('[環境変数状態]', JSON.stringify(envStatus, null, 2));
  console.log('========================================');

  try {
    // 環境変数チェック
    const envCheck = validateEnvVars();
    if (!envCheck.valid) {
      console.error('[エラー] 環境変数が不足しています:');
      envCheck.errors.forEach(err => console.error(`  - ${err}`));
      console.error('[環境変数状態]', JSON.stringify(envStatus, null, 2));
      return NextResponse.json(
        { error: '環境変数の設定エラー', details: envCheck.errors, envStatus },
        { status: 500 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    console.log(`[デバッグ] リクエストボディ長: ${body.length}`);
    console.log(`[デバッグ] 署名: ${signature ? signature.substring(0, 30) + '...' : 'なし'}`);

    // 署名チェック
    if (!signature) {
      console.error('[エラー] Stripe署名がありません');
      return NextResponse.json(
        { error: 'Stripe署名がありません' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    // テスト用: 署名検証をスキップするオプション（本番では必ず無効にすること）
    const skipSignatureVerification = process.env.SKIP_WEBHOOK_SIGNATURE === 'true';

    if (skipSignatureVerification) {
      console.warn('[警告] 署名検証をスキップしています（テストモード）');
      console.warn('[警告] 本番環境では SKIP_WEBHOOK_SIGNATURE を削除してください');
      try {
        event = JSON.parse(body) as Stripe.Event;
        console.log(`[Webhook] イベント受信（署名スキップ）: ${event.type}`);
        console.log(`[Webhook] イベントID: ${event.id}`);
      } catch (parseError) {
        console.error('[エラー] JSONパースに失敗:', parseError);
        return NextResponse.json({ error: 'JSONパースエラー' }, { status: 400 });
      }
    } else {
      try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          config.webhookSecret
        );
        console.log(`[Webhook] イベント受信: ${event.type}`);
        console.log(`[Webhook] イベントID: ${event.id}`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '不明なエラー';
        const errorStack = err instanceof Error ? err.stack : '';
        console.error('[エラー] Webhook署名の検証に失敗しました:', errorMessage);
        console.error('[エラースタック]', errorStack);
        console.error('[ヒント] Webhook Secretが正しく設定されているか確認してください');
        console.error(`[ヒント] 現在使用中: ${config.isTestMode ? 'STRIPE_TEST_WEBHOOK_SECRET' : 'STRIPE_WEBHOOK_SECRET'}`);
        console.error('[環境変数状態]', JSON.stringify(envStatus, null, 2));
        return NextResponse.json(
          { error: '署名の検証に失敗しました', message: errorMessage, envStatus },
          { status: 400 }
        );
      }
    }

    // checkout.session.completed イベントの処理
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;
      const amountTotal = session.amount_total;

      console.log('[購入完了]');
      console.log(`  - メールアドレス: ${customerEmail || '未取得'}`);
      console.log(`  - 金額: ¥${amountTotal ? amountTotal / 100 : 0}`);
      console.log(`  - セッションID: ${session.id}`);
      console.log(`  - 顧客ID: ${session.customer || '未取得'}`);
      console.log(`  - 支払い状態: ${session.payment_status}`);

      if (!customerEmail) {
        console.error('[エラー] 顧客のメールアドレスが取得できませんでした');
        console.error('[セッション詳細]', JSON.stringify({
          id: session.id,
          customer_details: session.customer_details,
          customer: session.customer,
        }, null, 2));
        return NextResponse.json({ received: true, warning: 'メールアドレスなし' });
      }

      try {
        // line_itemsを取得して商品名で判別（テスト/本番環境で商品IDが異なるため）
        console.log('[処理] line_items取得中...');
        const stripe = getStripe();
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        console.log(`[デバッグ] line_items数: ${lineItems.data.length}`);
        if (lineItems.data.length > 0) {
          console.log('[デバッグ] line_items詳細:', JSON.stringify(lineItems.data.map(item => ({
            description: item.description,
            amount_total: item.amount_total,
            quantity: item.quantity,
          })), null, 2));
        }

        const productDescription = lineItems.data[0]?.description || '';

        console.log(`  - 商品名: ${productDescription}`);

        // 商品名で判別（環境に依存しない）
        if (productDescription.includes('起業スタートキット') || productDescription.includes('スタートキット')) {
          console.log('[処理] スタートキット購入 -> メール送信');
          await sendStarterKitEmail(customerEmail);
        } else if (productDescription.includes('起業サポートサービス') || productDescription.includes('サポートサービス')) {
          console.log('[処理] サポートサービス購入 -> メール送信');
          await sendSupportServiceEmail(customerEmail);
        } else {
          // フォールバック: 金額で判別
          console.log(`[警告] 商品名で判別できませんでした: "${productDescription}"`);
          console.log('[処理] 金額で判別します');
          if (amountTotal && amountTotal <= 500000) {
            console.log('[処理] スタートキット購入（金額判定） -> メール送信');
            await sendStarterKitEmail(customerEmail);
          } else {
            console.log('[処理] サポートサービス購入（金額判定） -> メール送信');
            await sendSupportServiceEmail(customerEmail);
          }
        }
        console.log('[完了] メール送信成功');
      } catch (processingError) {
        const errorMessage = processingError instanceof Error ? processingError.message : '不明なエラー';
        const errorStack = processingError instanceof Error ? processingError.stack : '';
        console.error('[エラー] 処理中にエラーが発生しました:', errorMessage);
        console.error('[エラースタック]', errorStack);
        console.error('[環境変数状態]', JSON.stringify(envStatus, null, 2));
        // エラーでもWebhookは成功として返す（再送防止）
        return NextResponse.json({
          received: true,
          error: errorMessage,
          envStatus,
        });
      }
    } else {
      console.log(`[スキップ] イベント「${event.type}」は処理対象外です`);
    }

    console.log('[Webhook処理完了]');
    console.log('========================================');

    return NextResponse.json({ received: true });

  } catch (unexpectedError) {
    // 予期しないエラーのキャッチ
    const errorMessage = unexpectedError instanceof Error ? unexpectedError.message : '不明なエラー';
    const errorStack = unexpectedError instanceof Error ? unexpectedError.stack : '';

    console.error('========================================');
    console.error('[致命的エラー] Webhook処理で予期しないエラーが発生しました');
    console.error('[エラーメッセージ]', errorMessage);
    console.error('[エラースタック]', errorStack);
    console.error('[環境変数状態]', JSON.stringify(envStatus, null, 2));
    console.error('========================================');

    return NextResponse.json(
      {
        error: '予期しないエラーが発生しました',
        message: errorMessage,
        envStatus,
      },
      { status: 500 }
    );
  }
}
