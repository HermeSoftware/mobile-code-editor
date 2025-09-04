import { NextRequest, NextResponse } from 'next/server';

// Mock Git operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, message, files } = body;

    switch (action) {
      case 'status':
        return NextResponse.json({
          status: 'clean',
          modified: [],
          untracked: [],
          staged: [],
        });

      case 'commit':
        if (!message) {
          return NextResponse.json(
            { error: 'Commit mesajı gerekli' },
            { status: 400 }
          );
        }
        
        return NextResponse.json({
          success: true,
          commitId: Date.now().toString(),
          message,
          timestamp: new Date().toISOString(),
        });

      case 'push':
        return NextResponse.json({
          success: true,
          message: 'Değişiklikler başarıyla push edildi',
          timestamp: new Date().toISOString(),
        });

      case 'pull':
        return NextResponse.json({
          success: true,
          message: 'Değişiklikler başarıyla pull edildi',
          timestamp: new Date().toISOString(),
        });

      case 'log':
        return NextResponse.json({
          commits: [
            {
              id: '1',
              message: 'İlk commit',
              author: 'Kullanıcı',
              date: new Date().toISOString(),
            },
          ],
        });

      default:
        return NextResponse.json(
          { error: 'Geçersiz Git işlemi' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Git işlemi başarısız' },
      { status: 500 }
    );
  }
}
