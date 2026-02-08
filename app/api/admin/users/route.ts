import { NextRequest, NextResponse } from 'next/server';
import { userStorage } from '@/lib/userStorage';

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

    // GASが設定されていない場合は共有ストレージのデータを返す
    const users = userStorage.getAll();
    console.log('Returning users from shared storage:', users.length);

    return NextResponse.json({
      success: true,
      users: users,
      source: 'memory',
      message: gasUrl ? 'GASからの取得に失敗しました' : 'GAS_EMAIL_COLLECTOR_URLが設定されていません（インメモリで動作中）',
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

    // 共有ストレージに保存
    userStorage.upsert({
      email,
      layer,
      answers,
      result,
    });

    console.log('User saved via admin API. Total users:', userStorage.count());

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
