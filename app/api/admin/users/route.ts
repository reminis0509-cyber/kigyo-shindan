import { NextRequest, NextResponse } from 'next/server';

// インメモリストレージ（開発用 - Vercel再デプロイで消える）
// 本番ではGASまたはデータベースを使用
const users: Array<{
  email: string;
  registeredAt: string;
  layer?: string;
  answers?: Record<string, string>;
  result?: { rank1: string; rank2: string; rank3: string };
}> = [];

export async function GET(request: NextRequest) {
  try {
    // GASからデータを取得
    const gasUrl = process.env.GAS_EMAIL_COLLECTOR_URL;

    if (gasUrl) {
      try {
        const response = await fetch(`${gasUrl}?action=list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        if (data.success) {
          return NextResponse.json({
            success: true,
            users: data.data || [],
            source: 'gas',
          });
        }
      } catch (gasError) {
        console.error('GAS fetch error:', gasError);
      }
    }

    // GASが設定されていない場合はインメモリデータを返す
    return NextResponse.json({
      success: true,
      users: users,
      source: 'memory',
      message: gasUrl ? 'GASからの取得に失敗しました' : 'GAS_EMAIL_COLLECTOR_URLが設定されていません',
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { success: false, message: 'エラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, layer, answers, result } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // インメモリに保存
    const existingIndex = users.findIndex(u => u.email === email);
    if (existingIndex >= 0) {
      // 既存ユーザーを更新
      users[existingIndex] = {
        ...users[existingIndex],
        layer: layer || users[existingIndex].layer,
        answers: answers || users[existingIndex].answers,
        result: result || users[existingIndex].result,
      };
    } else {
      // 新規ユーザー
      users.push({
        email,
        registeredAt: new Date().toISOString(),
        layer,
        answers,
        result,
      });
    }

    // GASにも送信
    const gasUrl = process.env.GAS_EMAIL_COLLECTOR_URL;
    if (gasUrl) {
      try {
        await fetch(gasUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, layer, answers, result }),
        });
      } catch (gasError) {
        console.error('GAS save error:', gasError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User saved',
    });
  } catch (error) {
    console.error('Admin users POST error:', error);
    return NextResponse.json(
      { success: false, message: 'エラーが発生しました' },
      { status: 500 }
    );
  }
}
