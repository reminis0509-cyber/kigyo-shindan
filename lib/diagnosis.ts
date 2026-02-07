import { DiagnosisAnswers, DiagnosisResult, Business } from './types';

// 事業データベース（20種類）
const BUSINESSES: Record<string, Business> = {
  // 1. TikTokアフィリエイト
  tiktokAffiliate: {
    name: 'TikTokアフィリエイト',
    cost: '0円',
    revenue: '月5〜15万円',
    time: '週5時間',
    successRate: '中',
    description: 'TikTokで商品紹介動画を投稿し、アフィリエイト報酬を得るビジネス。初期費用ゼロで始められ、スマホだけで完結します。',
  },
  // 2. SNS運用代行
  snsManagement: {
    name: 'SNS運用代行',
    cost: '0〜3万円',
    revenue: '月15〜40万円',
    time: '週10〜20時間',
    successRate: '高',
    description: '企業や個人のSNSアカウントを代わりに運用し、月額で報酬を得るビジネス。継続的な収入が見込めます。',
  },
  // 3. インスタコンサル
  instaConsulting: {
    name: 'インスタコンサル',
    cost: '3万円以下',
    revenue: '月20〜60万円',
    time: '週15時間',
    successRate: '高',
    description: 'Instagram運用のノウハウを教えるコンサルティングビジネス。高単価で受注できます。',
  },
  // 4. 営業代行
  salesAgency: {
    name: '営業代行',
    cost: '5〜10万円',
    revenue: '月30〜100万円',
    time: '週20時間以上',
    successRate: '高',
    description: '企業の代わりに営業活動を行い、成果報酬を得るビジネス。営業力があれば高収益が見込めます。',
  },
  // 5. 起業サポート・コンサル
  startupSupport: {
    name: '起業サポート・コンサル',
    cost: '5万円以下',
    revenue: '月15〜60万円',
    time: '週15時間',
    successRate: '中',
    description: '起業したい人をサポートし、事業計画書作成や集客支援を行うビジネス。',
  },
  // 6. Webマーケティングコンサル
  webMarketingConsulting: {
    name: 'Webマーケティングコンサル',
    cost: '10〜20万円',
    revenue: '月40〜150万円',
    time: '週20時間以上',
    successRate: '中',
    description: '企業のWebマーケティング戦略を支援し、広告運用やSEO対策を行うビジネス。',
  },
  // 7. EC物販（Amazon・Shopify）
  ecommerce: {
    name: 'EC物販（Amazon・Shopify）',
    cost: '30〜50万円',
    revenue: '月60〜250万円',
    time: '週30時間',
    successRate: '中',
    description: 'AmazonやShopifyで商品を販売するビジネス。在庫リスクはありますが、成功すれば大きな収益が見込めます。',
  },
  // 8. ブログアフィリエイト
  blogAffiliate: {
    name: 'ブログアフィリエイト',
    cost: '1〜3万円',
    revenue: '月8〜40万円',
    time: '週10時間',
    successRate: '低〜中',
    description: 'ブログ記事を書いてアフィリエイト報酬を得るビジネス。継続が必要ですが、自動化しやすいです。',
  },
  // 9. コンテンツ販売（note・Brain）
  contentSales: {
    name: 'コンテンツ販売（note・Brain）',
    cost: '0〜5万円',
    revenue: '月10〜60万円',
    time: '週10時間',
    successRate: '中',
    description: '自分の知識やノウハウをnoteやBrainで販売するビジネス。一度作れば継続的に売れます。',
  },
  // 10. Webライター（受注型）
  webWriting: {
    name: 'Webライター（受注型）',
    cost: '0円',
    revenue: '月8〜30万円',
    time: '週10〜20時間',
    successRate: '高',
    description: '企業のWebサイトやブログの記事を執筆するビジネス。安定した収入が見込めます。',
  },
  // 11. デザイン制作（ロゴ・バナー）
  designWork: {
    name: 'デザイン制作（ロゴ・バナー）',
    cost: '3〜5万円',
    revenue: '月15〜50万円',
    time: '週15時間',
    successRate: '中',
    description: '企業や個人のロゴ、バナー、名刺などをデザインするビジネス。',
  },
  // 12. 動画編集代行
  videoEditing: {
    name: '動画編集代行',
    cost: '5〜10万円',
    revenue: '月20〜60万円',
    time: '週20時間',
    successRate: '中',
    description: 'YouTubeやTikTokの動画を編集するビジネス。需要が高く、安定した収入が見込めます。',
  },
  // 13. LP制作代行
  lpCreation: {
    name: 'LP制作代行',
    cost: '10〜30万円',
    revenue: '月40〜120万円',
    time: '週20時間',
    successRate: '中',
    description: '企業のランディングページ（LP）を制作するビジネス。高単価で受注できます。',
  },
  // 14. Web制作（ホームページ制作）
  webCreation: {
    name: 'Web制作（ホームページ制作）',
    cost: '10〜30万円',
    revenue: '月40〜120万円',
    time: '週25時間',
    successRate: '中',
    description: '企業のホームページを制作するビジネス。継続的な保守契約も取れます。',
  },
  // 15. メルカリ転売
  mercariResale: {
    name: 'メルカリ転売',
    cost: '3〜10万円',
    revenue: '月8〜25万円',
    time: '週10時間',
    successRate: '中',
    description: 'メルカリで商品を仕入れて販売するビジネス。スマホだけで完結します。',
  },
  // 16. せどり（Amazon転売）
  sedori: {
    name: 'せどり（Amazon転売）',
    cost: '10〜30万円',
    revenue: '月15〜60万円',
    time: '週15時間',
    successRate: '中',
    description: 'Amazonで商品を仕入れて販売するビジネス。利益率が高い商品を見つければ稼げます。',
  },
  // 17. オンライン講座・スクール運営
  onlineCourse: {
    name: 'オンライン講座・スクール運営',
    cost: '5〜10万円',
    revenue: '月25〜120万円',
    time: '週20時間',
    successRate: '中',
    description: '自分の専門知識を教えるオンライン講座を販売するビジネス。継続収入が見込めます。',
  },
  // 18. YouTube運営（広告収入）
  youtube: {
    name: 'YouTube運営（広告収入）',
    cost: '5〜10万円',
    revenue: '月8〜60万円',
    time: '週15時間',
    successRate: '低〜中',
    description: 'YouTube動画を投稿して広告収入を得るビジネス。継続が必要ですが、自動化しやすいです。',
  },
  // 19. ストックフォト販売
  stockPhoto: {
    name: 'ストックフォト販売',
    cost: '5〜10万円',
    revenue: '月5〜20万円',
    time: '週5〜10時間',
    successRate: '低〜中',
    description: '撮影した写真をストックフォトサイトで販売するビジネス。一度アップすれば継続的に売れます。',
  },
  // 20. LINEスタンプ販売
  lineStamp: {
    name: 'LINEスタンプ販売',
    cost: '0〜3万円',
    revenue: '月3〜15万円',
    time: '週5時間',
    successRate: '低',
    description: 'オリジナルのLINEスタンプを制作して販売するビジネス。ヒットすれば大きな収益になります。',
  },
};

// 診断ロジック
export function diagnose(answers: DiagnosisAnswers): DiagnosisResult {
  const { budget, time, skill, risk, goal, pcSkill, personality } = answers;

  let rank1: Business;
  let rank2: Business;
  let rank3: Business;

  // ===== パターン1: SNS得意 × 低予算 × スキマ時間 =====
  if (skill === 'A' && budget === 'A' && time === 'A') {
    rank1 = BUSINESSES.tiktokAffiliate;
    rank2 = BUSINESSES.instaConsulting;
    rank3 = BUSINESSES.contentSales;
  }
  // ===== パターン2: 営業得意 × 中〜高予算 × 月100万狙い =====
  else if (skill === 'B' && (budget === 'C' || budget === 'D') && goal === 'D') {
    rank1 = BUSINESSES.salesAgency;
    rank2 = BUSINESSES.webMarketingConsulting;
    rank3 = BUSINESSES.lpCreation;
  }
  // ===== パターン3: デザイン得意 × パソコン上級 =====
  else if (skill === 'C' && pcSkill === 'C') {
    rank1 = BUSINESSES.lpCreation;
    rank2 = BUSINESSES.webCreation;
    rank3 = BUSINESSES.designWork;
  }
  // ===== パターン4: 特になし × 低予算 × 堅実派 =====
  else if (skill === 'E' && budget === 'A' && risk === 'A') {
    rank1 = BUSINESSES.tiktokAffiliate;
    rank2 = BUSINESSES.mercariResale;
    rank3 = BUSINESSES.webWriting;
  }
  // ===== パターン5: 高予算 × リスクOK × 月100万狙い =====
  else if (budget === 'D' && risk === 'C' && goal === 'D') {
    rank1 = BUSINESSES.ecommerce;
    rank2 = BUSINESSES.webMarketingConsulting;
    rank3 = BUSINESSES.salesAgency;
  }
  // ===== 低予算 × ライティング得意 =====
  else if (budget === 'A' && skill === 'D') {
    rank1 = BUSINESSES.webWriting;
    rank2 = BUSINESSES.blogAffiliate;
    rank3 = BUSINESSES.contentSales;
  }
  // ===== 低予算 × デザイン得意 =====
  else if (budget === 'A' && skill === 'C') {
    rank1 = BUSINESSES.designWork;
    rank2 = BUSINESSES.lineStamp;
    rank3 = BUSINESSES.snsManagement;
  }
  // ===== 中予算 × 営業得意 × 月20万狙い =====
  else if ((budget === 'B' || budget === 'C') && skill === 'B' && (goal === 'B' || goal === 'C')) {
    rank1 = BUSINESSES.salesAgency;
    rank2 = BUSINESSES.startupSupport;
    rank3 = BUSINESSES.webMarketingConsulting;
  }
  // ===== 高予算 × 時間多い × 目標高い =====
  else if (budget === 'D' && time === 'D' && (goal === 'C' || goal === 'D')) {
    rank1 = BUSINESSES.webMarketingConsulting;
    rank2 = BUSINESSES.ecommerce;
    rank3 = BUSINESSES.startupSupport;
  }
  // ===== コツコツ型 × 低〜中予算 =====
  else if (personality === 'A' && (budget === 'A' || budget === 'B')) {
    rank1 = BUSINESSES.blogAffiliate;
    rank2 = BUSINESSES.webWriting;
    rank3 = BUSINESSES.contentSales;
  }
  // ===== 短期集中型 × 中予算以上 =====
  else if (personality === 'B' && (budget === 'B' || budget === 'C' || budget === 'D')) {
    rank1 = BUSINESSES.mercariResale;
    rank2 = BUSINESSES.sedori;
    rank3 = BUSINESSES.salesAgency;
  }
  // ===== 人と関わるのが好き =====
  else if (personality === 'C' || skill === 'B') {
    rank1 = BUSINESSES.salesAgency;
    rank2 = BUSINESSES.instaConsulting;
    rank3 = BUSINESSES.startupSupport;
  }
  // ===== 一人で黙々型 × PC初心者 =====
  else if (personality === 'D' && pcSkill === 'A') {
    rank1 = BUSINESSES.tiktokAffiliate;
    rank2 = BUSINESSES.mercariResale;
    rank3 = BUSINESSES.contentSales;
  }
  // ===== 一人で黙々型 × PC中級以上 =====
  else if (personality === 'D' && (pcSkill === 'B' || pcSkill === 'C')) {
    rank1 = BUSINESSES.webWriting;
    rank2 = BUSINESSES.blogAffiliate;
    rank3 = BUSINESSES.designWork;
  }
  // ===== PC上級者 =====
  else if (pcSkill === 'C') {
    rank1 = BUSINESSES.lpCreation;
    rank2 = BUSINESSES.webCreation;
    rank3 = BUSINESSES.videoEditing;
  }
  // ===== SNS得意 =====
  else if (skill === 'A') {
    rank1 = BUSINESSES.tiktokAffiliate;
    rank2 = BUSINESSES.snsManagement;
    rank3 = BUSINESSES.instaConsulting;
  }
  // ===== 時間がある × 特になし =====
  else if ((time === 'C' || time === 'D') && skill === 'E') {
    rank1 = BUSINESSES.snsManagement;
    rank2 = BUSINESSES.videoEditing;
    rank3 = BUSINESSES.mercariResale;
  }
  // ===== 中予算 × 時間多め × リスクOK =====
  else if ((budget === 'B' || budget === 'C') && (time === 'C' || time === 'D') && risk === 'C') {
    rank1 = BUSINESSES.sedori;
    rank2 = BUSINESSES.ecommerce;
    rank3 = BUSINESSES.onlineCourse;
  }
  // ===== 低予算 × 時間多め × クリエイティブ =====
  else if (budget === 'A' && (time === 'C' || time === 'D') && skill === 'C') {
    rank1 = BUSINESSES.youtube;
    rank2 = BUSINESSES.stockPhoto;
    rank3 = BUSINESSES.designWork;
  }
  // ===== デフォルト（低リスク推奨） =====
  else {
    rank1 = BUSINESSES.snsManagement;
    rank2 = BUSINESSES.webWriting;
    rank3 = BUSINESSES.mercariResale;
  }

  return { rank1, rank2, rank3 };
}
