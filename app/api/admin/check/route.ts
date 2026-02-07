import { NextRequest, NextResponse } from 'next/server';

// マスターユーザー設定（直接埋め込み）
const ADMIN_EMAIL = 'reminis0509@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const isAdmin = email === ADMIN_EMAIL;

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json({ isAdmin: false });
  }
}
