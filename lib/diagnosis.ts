import { DiagnosisAnswers, DiagnosisResult, Business } from './types';

// 事業データベース
const BUSINESSES: Record<string, Business> = {
  tiktokAffiliate: {
    name: 'TikTokアフィリエイト',
    cost: '0円',
    revenue: '月3〜10万円',
    time: '週5時間',
    successRate: '中',
    description: 'TikTokで商品紹介動画を投稿し、アフィリエイト報酬を得るビジネス。初期費用ゼロで始められ、スマホだけで完結します。継続的に投稿することで、月3〜10万円の収益が見込めます。',
  },
  snsManagement: {
    name: 'SNS運用代行',
    cost: '0〜3万円',
    revenue: '月10〜30万円',
    time: '週10時間',
    successRate: '高',
    description: '企業や個人のSNSアカウントを代わりに運用するビジネス。投稿作成、フォロワー増加施策、コメント対応などを代行。SNSが得意なら安定した収益が見込めます。',
  },
  instaConsulting: {
    name: 'インスタコンサル',
    cost: '0〜5万円',
    revenue: '月20〜50万円',
    time: '週15時間',
    successRate: '中',
    description: 'インスタグラムでのフォロワー増加や収益化のノウハウを教えるコンサルティングビジネス。自身の実績が必要ですが、高単価が狙えます。',
  },
  salesAgency: {
    name: '営業代行',
    cost: '5〜10万円',
    revenue: '月20〜50万円',
    time: '週20時間',
    successRate: '高',
    description: '企業の代わりに営業活動を行い、成果報酬を得るビジネス。営業力があれば高収益が見込めます。人脈や交渉力が活かせる仕事です。',
  },
  startupSupport: {
    name: '起業サポート',
    cost: '5〜15万円',
    revenue: '月30〜100万円',
    time: '週25時間',
    successRate: '中',
    description: '起業したい人をサポートするビジネス。事業計画作成、法人設立手続き、マーケティング支援などを行います。起業経験者に最適です。',
  },
  webMarketingConsulting: {
    name: 'Webマーケコンサル',
    cost: '10〜20万円',
    revenue: '月50〜150万円',
    time: '週30時間',
    successRate: '中',
    description: '企業のWebマーケティング戦略を立案・実行するコンサルティング。SEO、広告運用、SNS戦略などの知識が必要ですが、高単価が狙えます。',
  },
  ecommerce: {
    name: 'EC物販（Amazon・Shopify）',
    cost: '30〜50万円',
    revenue: '月50〜200万円',
    time: '週30時間',
    successRate: '中',
    description: 'AmazonやShopifyで商品を販売するビジネス。在庫リスクはありますが、成功すれば大きな収益が見込めます。',
  },
  blogAffiliate: {
    name: 'ブログアフィリエイト',
    cost: '1〜3万円',
    revenue: '月3〜30万円',
    time: '週10時間',
    successRate: '中',
    description: 'ブログで商品やサービスを紹介し、アフィリエイト報酬を得るビジネス。文章力があれば始めやすく、資産性のあるビジネスです。',
  },
  contentSales: {
    name: 'コンテンツ販売（note、Brain）',
    cost: '0円',
    revenue: '月5〜50万円',
    time: '週8時間',
    successRate: '中',
    description: '自分の知識やノウハウをnoteやBrainで販売するビジネス。初期費用ゼロで始められ、一度作れば継続的に売れる可能性があります。',
  },
  webWriting: {
    name: 'ライティング受注（Webライター）',
    cost: '0円',
    revenue: '月5〜20万円',
    time: '週15時間',
    successRate: '高',
    description: 'Webサイトやブログの記事を書いて報酬を得るビジネス。文章力があれば初期費用ゼロで始められます。クラウドソーシングで案件を獲得できます。',
  },
  designWork: {
    name: 'デザイン受注（ロゴ、バナー制作）',
    cost: '0〜5万円',
    revenue: '月10〜40万円',
    time: '週15時間',
    successRate: '高',
    description: 'ロゴやバナー、Webデザインを制作して報酬を得るビジネス。Canvaなどのツールが使えれば始められます。',
  },
  videoEditing: {
    name: '動画編集代行',
    cost: '3〜10万円',
    revenue: '月15〜50万円',
    time: '週20時間',
    successRate: '高',
    description: 'YouTubeやTikTokの動画編集を代行するビジネス。動画編集スキルがあれば需要が高く、安定した収益が見込めます。',
  },
  lpCreation: {
    name: 'LP制作代行',
    cost: '5〜15万円',
    revenue: '月20〜80万円',
    time: '週25時間',
    successRate: '中',
    description: 'ランディングページ（LP）を制作代行するビジネス。デザインとマーケティングの知識が必要ですが、高単価が狙えます。',
  },
  mercariResale: {
    name: 'メルカリ転売',
    cost: '3〜10万円',
    revenue: '月5〜30万円',
    time: '週10時間',
    successRate: '高',
    description: 'メルカリで商品を仕入れて販売するビジネス。リサーチ力があれば比較的堅実に稼げます。',
  },
  onlineCourse: {
    name: 'オンライン講座',
    cost: '5〜20万円',
    revenue: '月30〜100万円',
    time: '週15時間',
    successRate: '中',
    description: '自分の専門知識をオンライン講座として販売するビジネス。一度作れば継続的に販売でき、高収益が狙えます。',
  },
};

// 診断ロジック
export function diagnose(answers: DiagnosisAnswers): DiagnosisResult {
  const { budget, time, skill, risk, goal, pcSkill, personality } = answers;

  let rank1: Business;
  let rank2: Business;
  let rank3: Business;

  // 低予算 × 時間少ない × SNS得意
  if (budget === 'A' && time === 'A' && skill === 'A') {
    rank1 = BUSINESSES.tiktokAffiliate;
    rank2 = BUSINESSES.contentSales;
    rank3 = BUSINESSES.snsManagement;
  }
  // 低予算 × ライティング得意
  else if (budget === 'A' && skill === 'D') {
    rank1 = BUSINESSES.webWriting;
    rank2 = BUSINESSES.blogAffiliate;
    rank3 = BUSINESSES.contentSales;
  }
  // 低予算 × デザイン得意
  else if (budget === 'A' && skill === 'C') {
    rank1 = BUSINESSES.designWork;
    rank2 = BUSINESSES.snsManagement;
    rank3 = BUSINESSES.contentSales;
  }
  // 中予算 × 営業得意 × 月20万狙い
  else if ((budget === 'B' || budget === 'C') && skill === 'B' && (goal === 'B' || goal === 'C')) {
    rank1 = BUSINESSES.salesAgency;
    rank2 = BUSINESSES.startupSupport;
    rank3 = BUSINESSES.webMarketingConsulting;
  }
  // 高予算 × リスクOK × 月100万狙い
  else if (budget === 'D' && risk === 'C' && goal === 'D') {
    rank1 = BUSINESSES.ecommerce;
    rank2 = BUSINESSES.webMarketingConsulting;
    rank3 = BUSINESSES.onlineCourse;
  }
  // 高予算 × 時間多い × 目標高い
  else if (budget === 'D' && time === 'D' && (goal === 'C' || goal === 'D')) {
    rank1 = BUSINESSES.webMarketingConsulting;
    rank2 = BUSINESSES.ecommerce;
    rank3 = BUSINESSES.startupSupport;
  }
  // コツコツ型 × 低〜中予算
  else if (personality === 'A' && (budget === 'A' || budget === 'B')) {
    rank1 = BUSINESSES.blogAffiliate;
    rank2 = BUSINESSES.webWriting;
    rank3 = BUSINESSES.contentSales;
  }
  // 短期集中型 × 中予算以上
  else if (personality === 'B' && (budget === 'B' || budget === 'C' || budget === 'D')) {
    rank1 = BUSINESSES.mercariResale;
    rank2 = BUSINESSES.salesAgency;
    rank3 = BUSINESSES.ecommerce;
  }
  // 人と関わるのが好き
  else if (personality === 'C' || skill === 'B') {
    rank1 = BUSINESSES.salesAgency;
    rank2 = BUSINESSES.instaConsulting;
    rank3 = BUSINESSES.startupSupport;
  }
  // 一人で黙々型 × PC初心者
  else if (personality === 'D' && pcSkill === 'A') {
    rank1 = BUSINESSES.tiktokAffiliate;
    rank2 = BUSINESSES.mercariResale;
    rank3 = BUSINESSES.contentSales;
  }
  // 一人で黙々型 × PC中級以上
  else if (personality === 'D' && (pcSkill === 'B' || pcSkill === 'C')) {
    rank1 = BUSINESSES.webWriting;
    rank2 = BUSINESSES.blogAffiliate;
    rank3 = BUSINESSES.designWork;
  }
  // PC上級者
  else if (pcSkill === 'C') {
    rank1 = BUSINESSES.lpCreation;
    rank2 = BUSINESSES.videoEditing;
    rank3 = BUSINESSES.webMarketingConsulting;
  }
  // SNS得意（デフォルト）
  else if (skill === 'A') {
    rank1 = BUSINESSES.tiktokAffiliate;
    rank2 = BUSINESSES.snsManagement;
    rank3 = BUSINESSES.instaConsulting;
  }
  // 時間がある × 特になし
  else if ((time === 'C' || time === 'D') && skill === 'E') {
    rank1 = BUSINESSES.snsManagement;
    rank2 = BUSINESSES.videoEditing;
    rank3 = BUSINESSES.mercariResale;
  }
  // デフォルト（低リスク推奨）
  else {
    rank1 = BUSINESSES.tiktokAffiliate;
    rank2 = BUSINESSES.snsManagement;
    rank3 = BUSINESSES.webWriting;
  }

  return { rank1, rank2, rank3 };
}
