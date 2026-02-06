// 診断の回答データの型定義
export interface DiagnosisAnswers {
  budget: string;        // 初期投資額
  time: string;          // 使える時間
  skill: string;         // 得意なスキル
  risk: string;          // リスク許容度
  goal: string;          // 目標月収
  pcSkill: string;       // パソコンスキル
  personality: string;   // 行動力・性格
}

// 診断結果の事業データの型定義
export interface Business {
  name: string;
  cost: string;
  revenue: string;
  time: string;
  successRate: string;
  description: string;
}

// 診断結果の型定義
export interface DiagnosisResult {
  rank1: Business;
  rank2: Business;
  rank3: Business;
}

// ユーザーデータの型定義
export interface UserData {
  email: string;
  layer: 'A' | 'B' | null;
  answers: DiagnosisAnswers | null;
  result: DiagnosisResult | null;
}

// 質問の型定義
export interface Question {
  id: keyof DiagnosisAnswers;
  title: string;
  options: {
    value: string;
    label: string;
  }[];
}

// 質問データ
export const QUESTIONS: Question[] = [
  {
    id: 'budget',
    title: '起業にいくらまで投資できますか？',
    options: [
      { value: 'A', label: '0円〜3万円（ほぼゼロ円で始めたい）' },
      { value: 'B', label: '3万円〜10万円（少し投資してもいい）' },
      { value: 'C', label: '10万円〜30万円（しっかり投資したい）' },
      { value: 'D', label: '30万円以上（本気で投資する）' },
    ],
  },
  {
    id: 'time',
    title: '週に何時間、事業に使えますか？',
    options: [
      { value: 'A', label: '5時間以下（スキマ時間でやりたい）' },
      { value: 'B', label: '5〜10時間（週末メイン）' },
      { value: 'C', label: '10〜20時間（平日夜＋週末）' },
      { value: 'D', label: '20時間以上（ほぼフルコミット）' },
    ],
  },
  {
    id: 'skill',
    title: 'あなたが一番得意なことは何ですか？',
    options: [
      { value: 'A', label: 'SNS・TikTok（フォロワー増やすの得意）' },
      { value: 'B', label: '営業・交渉（人と話すのが得意）' },
      { value: 'C', label: 'デザイン・クリエイティブ（Canvaとか使える）' },
      { value: 'D', label: 'ライティング・文章（ブログとか書ける）' },
      { value: 'E', label: '特になし（でも学ぶ意欲はある）' },
    ],
  },
  {
    id: 'risk',
    title: '失敗のリスクについて、どう考えていますか？',
    options: [
      { value: 'A', label: '絶対に失敗したくない（堅実に行きたい）' },
      { value: 'B', label: '少しのリスクならOK（試行錯誤したい）' },
      { value: 'C', label: '大きなリスクも取れる（ハイリターン狙い）' },
    ],
  },
  {
    id: 'goal',
    title: 'まず最初に、月いくら稼ぎたいですか？',
    options: [
      { value: 'A', label: '月3〜5万円（副業レベル）' },
      { value: 'B', label: '月10〜20万円（本業の足しに）' },
      { value: 'C', label: '月30万円以上（本業にしたい）' },
      { value: 'D', label: '月100万円以上（ガッツリ稼ぎたい）' },
    ],
  },
  {
    id: 'pcSkill',
    title: 'パソコンのスキルはどれくらいですか？',
    options: [
      { value: 'A', label: '初心者（メール・SNSくらいしか使わない）' },
      { value: 'B', label: '中級者（Excel、Canva、Notionとか使える）' },
      { value: 'C', label: '上級者（コーディング、デザインツールも使える）' },
    ],
  },
  {
    id: 'personality',
    title: 'あなたの性格に一番近いのはどれですか？',
    options: [
      { value: 'A', label: 'コツコツ継続するのが得意（地道な作業も苦じゃない）' },
      { value: 'B', label: '短期集中型（一気にやって早く結果を出したい）' },
      { value: 'C', label: '人と関わるのが好き（営業・交渉が得意）' },
      { value: 'D', label: '一人で黙々とやりたい（人と関わるのは苦手）' },
    ],
  },
];
