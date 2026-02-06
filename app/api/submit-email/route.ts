import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

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
    }));

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
