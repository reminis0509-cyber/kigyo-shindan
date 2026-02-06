// Stripeリンク設定
// 環境変数が設定されていればそれを使用、なければデフォルト値を使用
export const STRIPE_PAYMENT_LINK =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ||
  'https://buy.stripe.com/00w4gyejb5Lebqsd5D18c00';

export const STRIPE_MVP_LINK =
  process.env.NEXT_PUBLIC_STRIPE_MVP_LINK ||
  'https://buy.stripe.com/00w4gyejb5Lebqsd5D18c00';
