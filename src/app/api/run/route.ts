import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Kod gerekli' },
        { status: 400 }
      );
    }

    // Basit kod çalıştırma (gerçek uygulamada Web Worker veya WASM kullanılmalı)
    let result: unknown;
    let error: string | null = null;

    try {
      switch (language) {
        case 'javascript':
        case 'typescript':
          // Güvenli eval (gerçek uygulamada sandbox gerekli)
          result = eval(code);
          break;
        case 'python':
          // Python kodu için mock response
          result = 'Python kodu çalıştırıldı (mock)';
          break;
        default:
          result = `Kod çalıştırıldı: ${language}`;
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'Bilinmeyen hata';
    }

    return NextResponse.json({
      result,
      error,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Kod çalıştırılamadı' },
      { status: 500 }
    );
  }
}
