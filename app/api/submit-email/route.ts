import { NextRequest, NextResponse } from 'next/server';
import { userStorage } from '@/lib/userStorage';

export async function POST(request: NextRequest) {
  try {
    const { email, layer, answers, result } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // ログ出力（Vercelのログに記録される）
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      action: 'email_registered',
      email: email,
      layer: layer || 'initial',
    }));

    // インメモリストレージに保存（管理画面と共有）
    const resultData = result ? {
      rank1: result.rank1?.name || result.rank1 || '',
      rank2: result.rank2?.name || result.rank2 || '',
      rank3: result.rank3?.name || result.rank3 || '',
    } : undefined;

    userStorage.upsert({
      email,
      layer: layer || '',
      answers: answers || undefined,
      result: resultData,
    });

    console.log('User saved to storage. Total users:', userStorage.count());

    // GASにメールアドレスを送信（Google Sheetsに保存）
    const gasUrl = process.env.GAS_EMAIL_COLLECTOR_URL;

    if (gasUrl) {
      try {
        const gasResponse = await fetch(gasUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            layer: layer || '',
            answers: answers || {},
            result: result || {},
          }),
        });

        const gasResult = await gasResponse.json();
        console.log('GAS response:', gasResult);
      } catch (gasError) {
        console.error('GAS error:', gasError);
        // GASエラーでも処理は続行
      }
    } else {
      console.log('GAS_EMAIL_COLLECTOR_URL is not set, skipping GAS submission');
    }

    return NextResponse.json({
      success: true,
      message: 'Email registered successfully',
    });
  } catch (error) {
    console.error('Error in submit-email:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
