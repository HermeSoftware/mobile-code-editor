'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Square, Trash2 } from 'lucide-react';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export default function Terminal({ isOpen, onClose }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: 'Terminal hazır. Komutlarınızı yazabilirsiniz.',
      timestamp: new Date(),
    },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = (type: 'input' | 'output' | 'error', content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setLines(prev => [...prev, newLine]);
  };

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;

    addLine('input', `$ ${command}`);
    setCurrentInput('');
    setIsRunning(true);

    try {
      // Basit komut işleme
      if (command === 'clear') {
        setLines([]);
        return;
      }

      if (command === 'help') {
        addLine('output', 'Mevcut komutlar:');
        addLine('output', '  clear - Terminali temizle');
        addLine('output', '  help - Bu yardım mesajını göster');
        addLine('output', '  ls - Dosyaları listele');
        addLine('output', '  pwd - Mevcut dizini göster');
        addLine('output', '  echo <text> - Metni yazdır');
        return;
      }

      if (command === 'ls') {
        addLine('output', 'index.html');
        addLine('output', 'style.css');
        addLine('output', 'script.js');
        addLine('output', 'package.json');
        return;
      }

      if (command === 'pwd') {
        addLine('output', '/workspace');
        return;
      }

      if (command.startsWith('echo ')) {
        const text = command.substring(5);
        addLine('output', text);
        return;
      }

      // JavaScript kod çalıştırma (güvenli sandbox)
      if (command.startsWith('run ')) {
        const code = command.substring(4);
        try {
          // Basit eval (gerçek uygulamada Web Worker kullanılmalı)
          const result = eval(code);
          addLine('output', `Sonuç: ${result}`);
        } catch (error) {
          addLine('error', `Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
        }
        return;
      }

      addLine('error', `Komut bulunamadı: ${command}`);
    } catch (error) {
      addLine('error', `Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    }
  };

  const clearTerminal = () => {
    setLines([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="w-full h-2/3 bg-gray-900 rounded-t-lg flex flex-col">
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <TerminalIcon size={20} className="text-green-400" />
            <span className="text-white font-medium">Terminal</span>
            {isRunning && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Çalışıyor...</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearTerminal}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Temizle"
            >
              <Trash2 size={16} className="text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Kapat"
            >
              <Square size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-sm"
        >
          {lines.map((line) => (
            <div
              key={line.id}
              className={`mb-1 ${
                line.type === 'error'
                  ? 'text-red-400'
                  : line.type === 'input'
                  ? 'text-green-400'
                  : 'text-gray-300'
              }`}
            >
              {line.content}
            </div>
          ))}
        </div>

        {/* Terminal Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-green-400">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRunning}
              className="flex-1 bg-transparent text-white outline-none disabled:opacity-50"
              placeholder="Komut yazın..."
            />
            <button
              onClick={() => executeCommand(currentInput)}
              disabled={isRunning || !currentInput.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Play size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
