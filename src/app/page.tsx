'use client';

import { useState, useEffect } from 'react';
import BottomBar from '@/components/BottomBar';
import CodeEditor from '@/components/CodeEditor';
import FileExplorer from '@/components/FileExplorer';
import Terminal from '@/components/Terminal';
import LivePreview from '@/components/LivePreview';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
  children?: FileItem[];
  isOpen?: boolean;
}

export default function HomePage() {
  // State for bottom bar panels
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(false);
  const [isGitOpen, setIsGitOpen] = useState(false);
  const [isRunOpen, setIsRunOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isErrorsOpen, setIsErrorsOpen] = useState(false);
  const [isDeviceOpen, setIsDeviceOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Editor state
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // File system state
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'index.html',
      type: 'file',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Merhaba Dünya</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Merhaba Dünya!</h1>
        <p>Bu bir mobil kod editörü örneğidir.</p>
        <button onclick="showAlert()">Tıkla</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
    },
    {
      id: '2',
      name: 'style.css',
      type: 'file',
      language: 'css',
      content: `body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    text-align: center;
}

h1 {
    color: #333;
    margin-bottom: 20px;
}

button {
    background: #007bff;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;
}

button:hover {
    background: #0056b3;
}`,
    },
    {
      id: '3',
      name: 'script.js',
      type: 'file',
      language: 'javascript',
      content: `function showAlert() {
    alert('Merhaba! Mobil kod editörü çalışıyor!');
}

// Örnek JavaScript kodu
const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
let currentColor = 0;

function changeBackground() {
    document.body.style.background = colors[currentColor];
    currentColor = (currentColor + 1) % colors.length;
}

// Her 3 saniyede bir arka plan rengini değiştir
setInterval(changeBackground, 3000);`,
    },
  ]);

  // Initialize with first file
  useEffect(() => {
    if (files.length > 0 && !currentFile) {
      const firstFile = files.find(f => f.type === 'file');
      if (firstFile) {
        setCurrentFile(firstFile);
        setEditorContent(firstFile.content || '');
      }
    }
  }, [files, currentFile]);

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      setCurrentFile(file);
      setEditorContent(file.content || '');
    } else {
      // Toggle folder
      setFiles(prev => 
        prev.map(f => 
          f.id === file.id 
            ? { ...f, isOpen: !f.isOpen }
            : f
        )
      );
    }
  };

  const handleFileCreate = (name: string, type: 'file' | 'folder', parentId?: string) => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name,
      type,
      language: type === 'file' ? 'javascript' : undefined,
      content: type === 'file' ? '// Yeni dosya\n' : undefined,
      children: type === 'folder' ? [] : undefined,
      isOpen: false,
    };

    setFiles(prev => [...prev, newFile]);
  };

  const handleFileRename = (id: string, newName: string) => {
    setFiles(prev =>
      prev.map(f =>
        f.id === id ? { ...f, name: newName } : f
      )
    );
  };

  const handleFileDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (currentFile?.id === id) {
      const remainingFiles = files.filter(f => f.id !== id);
      const nextFile = remainingFiles.find(f => f.type === 'file');
      if (nextFile) {
        setCurrentFile(nextFile);
        setEditorContent(nextFile.content || '');
      } else {
        setCurrentFile(null);
        setEditorContent('');
      }
    }
  };

  const handleContentChange = (content: string) => {
    setEditorContent(content);
    if (currentFile) {
      setFiles(prev =>
        prev.map(f =>
          f.id === currentFile.id ? { ...f, content } : f
        )
      );
    }
  };

  const getCurrentFileContent = (language: string) => {
    switch (language) {
      case 'html':
        return files.find(f => f.language === 'html')?.content || '';
      case 'css':
        return files.find(f => f.language === 'css')?.content || '';
      case 'javascript':
        return files.find(f => f.language === 'javascript')?.content || '';
      default:
        return '';
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer Sidebar */}
        {isFileExplorerOpen && (
          <div className="w-80 border-r border-gray-700">
            <FileExplorer
              files={files}
              onFileSelect={handleFileSelect}
              onFileCreate={handleFileCreate}
              onFileRename={handleFileRename}
              onFileDelete={handleFileDelete}
              selectedFileId={currentFile?.id}
            />
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-4 text-sm text-gray-300">
              {currentFile ? currentFile.name : 'Dosya seçin'}
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1">
            {currentFile ? (
              <CodeEditor
                value={editorContent}
                onChange={handleContentChange}
                language={currentFile.language || 'javascript'}
                theme={theme}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h2 className="text-xl font-semibold mb-2">Kod Editörü</h2>
                  <p>Dosya seçmek için sol menüyü açın</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <BottomBar
        onFileExplorerToggle={() => setIsFileExplorerOpen(!isFileExplorerOpen)}
        onGitToggle={() => setIsGitOpen(!isGitOpen)}
        onRunToggle={() => setIsRunOpen(!isRunOpen)}
        onTerminalToggle={() => setIsTerminalOpen(!isTerminalOpen)}
        onErrorsToggle={() => setIsErrorsOpen(!isErrorsOpen)}
        onDeviceToggle={() => setIsDeviceOpen(!isDeviceOpen)}
        onSettingsToggle={() => setIsSettingsOpen(!isSettingsOpen)}
        isFileExplorerOpen={isFileExplorerOpen}
        isGitOpen={isGitOpen}
        isRunOpen={isRunOpen}
        isTerminalOpen={isTerminalOpen}
        isErrorsOpen={isErrorsOpen}
        isDeviceOpen={isDeviceOpen}
        isSettingsOpen={isSettingsOpen}
      />

      {/* Modals */}
      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      <LivePreview
        isOpen={isRunOpen}
        onClose={() => setIsRunOpen(false)}
        htmlContent={getCurrentFileContent('html')}
        cssContent={getCurrentFileContent('css')}
        jsContent={getCurrentFileContent('javascript')}
      />
    </div>
  );
}