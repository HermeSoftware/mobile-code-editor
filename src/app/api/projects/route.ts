import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration
const mockProjects = [
  {
    id: '1',
    name: 'Örnek Proje',
    files: [
      {
        id: '1',
        name: 'index.html',
        type: 'file',
        language: 'html',
        content: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Örnek</title>\n</head>\n<body>\n    <h1>Merhaba Dünya!</h1>\n</body>\n</html>',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    settings: {
      theme: 'dark',
      fontSize: 14,
      tabSize: 2,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({ projects: mockProjects });
  } catch (error) {
    return NextResponse.json(
      { error: 'Projeler yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, files = [], settings = {} } = body;

    const newProject = {
      id: Date.now().toString(),
      name: name || 'Yeni Proje',
      files,
      settings: {
        theme: 'dark',
        fontSize: 14,
        tabSize: 2,
        ...settings,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProjects.push(newProject);

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Proje oluşturulamadı' },
      { status: 500 }
    );
  }
}
