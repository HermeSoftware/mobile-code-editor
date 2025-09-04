import { NextRequest, NextResponse } from 'next/server';

// Mock data
const mockProjects = new Map([
  ['1', {
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
  }],
]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = mockProjects.get(id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      { error: 'Proje yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const project = mockProjects.get(id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    const updatedProject = {
      ...project,
      ...body,
      id: id,
      updatedAt: new Date(),
    };

    mockProjects.set(id, updatedProject);

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    return NextResponse.json(
      { error: 'Proje güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = mockProjects.get(id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    mockProjects.delete(id);

    return NextResponse.json({ message: 'Proje silindi' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Proje silinemedi' },
      { status: 500 }
    );
  }
}
