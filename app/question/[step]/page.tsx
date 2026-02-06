'use client';

import { useRouter, useParams } from 'next/navigation';
import { useDiagnosis } from '@/lib/context';
import { QUESTIONS, DiagnosisAnswers } from '@/lib/types';

export default function QuestionPage() {
  const router = useRouter();
  const params = useParams();
  const { userData, setAnswer } = useDiagnosis();

  const step = parseInt(params.step as string);
  const questionIndex = step - 1;
  const question = QUESTIONS[questionIndex];
  const totalQuestions = QUESTIONS.length;

  // メールアドレスがない場合はトップページへ
  if (!userData.email) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  // 層Bでない場合はキットページへ
  if (userData.layer !== 'B') {
    if (typeof window !== 'undefined') {
      router.push('/kit');
    }
    return null;
  }

  // 無効なステップの場合
  if (!question || step < 1 || step > totalQuestions) {
    if (typeof window !== 'undefined') {
      router.push('/question/1');
    }
    return null;
  }

  const handleSelect = (value: string) => {
    setAnswer(question.id, value);

    if (step < totalQuestions) {
      router.push(`/question/${step + 1}`);
    } else {
      router.push('/result');
    }
  };

  // 現在の回答を取得
  const currentAnswer = userData.answers?.[question.id as keyof DiagnosisAnswers] || '';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* プログレスバー */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>質問 {step}/{totalQuestions}</span>
            <span>{Math.round((step / totalQuestions) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* 質問 */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {question.title}
          </h1>
        </div>

        {/* 選択肢 */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = currentAnswer === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full bg-white hover:bg-gray-50 border-2 rounded-xl p-4 text-left transition-all group ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}>
                    <span className="font-semibold text-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  <p className={`text-sm sm:text-base ${
                    isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 戻るボタン */}
        {step > 1 && (
          <button
            onClick={() => router.push(`/question/${step - 1}`)}
            className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition-colors"
          >
            前の質問に戻る
          </button>
        )}
      </div>
    </main>
  );
}
