import { NextRequest, NextResponse } from 'next/server';

// マスターユーザー設定（直接埋め込み）
const ADMIN_EMAIL = 'reminis0509@gmail.com';
const ADMIN_PASSWORD = 'r20250509s';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, message: 'メールアドレスが一致しません' },
        { status: 401 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: 'パスワードが正しくありません' },
        { status: 401 }
      );
    }

    // シンプルなトークン生成
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      token: token,
      message: 'ログイン成功',
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: 'エラーが発生しました' },
      { status: 500 }
    );
  }
}
