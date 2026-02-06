import { NextRequest, NextResponse } from 'next/server';
import { diagnose } from '@/lib/diagnosis';
import { sendDiagnosisEmail } from '@/lib/email';
import { DiagnosisAnswers } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { email, layer, answers } = await request.json();

    if (!email || !layer) {
      return NextResponse.json(
        { success: false, message: 'Email and layer are required' },
        { status: 400 }
      );
    }

    let result = null;

    if (layer === 'B') {
      if (!answers) {
        return NextResponse.json(
          { success: false, message: 'Answers are required for layer B' },
          { status: 400 }
        );
      }

      const requiredKeys: (keyof DiagnosisAnswers)[] = [
        'budget', 'time', 'skill', 'risk', 'goal', 'pcSkill', 'personality'
      ];

      for (const key of requiredKeys) {
        if (!answers[key]) {
          return NextResponse.json(
            { success: false, message: `Missing answer: ${key}` },
            { status: 400 }
          );
        }
      }

      result = diagnose(answers as DiagnosisAnswers);

      // ログ出力
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        action: 'diagnosis_completed',
        email: email,
        layer: layer,
        answers: answers,
        result: {
          rank1: result.rank1.name,
          rank2: result.rank2.name,
          rank3: result.rank3.name,
        },
      }));
    } else {
      // 層Aのログ
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        action: 'layer_a_selected',
        email: email,
        layer: layer,
      }));
    }

    // メール送信
    const emailSent = await sendDiagnosisEmail(email, result, layer);

    return NextResponse.json({
      success: true,
      result: result,
      emailSent: emailSent,
      message: 'Diagnosis completed',
    });
  } catch (error) {
    console.error('Error in diagnose:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
