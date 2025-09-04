'use client';

import { useState } from 'react';
import { 
  FileText, 
  GitBranch, 
  Play, 
  Terminal, 
  AlertCircle, 
  Smartphone, 
  Settings
} from 'lucide-react';

interface BottomBarProps {
  onFileExplorerToggle: () => void;
  onGitToggle: () => void;
  onRunToggle: () => void;
  onTerminalToggle: () => void;
  onErrorsToggle: () => void;
  onDeviceToggle: () => void;
  onSettingsToggle: () => void;
  isFileExplorerOpen: boolean;
  isGitOpen: boolean;
  isRunOpen: boolean;
  isTerminalOpen: boolean;
  isErrorsOpen: boolean;
  isDeviceOpen: boolean;
  isSettingsOpen: boolean;
}

export default function BottomBar({
  onFileExplorerToggle,
  onGitToggle,
  onRunToggle,
  onTerminalToggle,
  onErrorsToggle,
  onDeviceToggle,
  onSettingsToggle,
  isFileExplorerOpen,
  isGitOpen,
  isRunOpen,
  isTerminalOpen,
  isErrorsOpen,
  isDeviceOpen,
  isSettingsOpen,
}: BottomBarProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const buttons = [
    {
      id: 'files',
      icon: FileText,
      label: 'Dosyalar',
      onClick: onFileExplorerToggle,
      isActive: isFileExplorerOpen,
    },
    {
      id: 'git',
      icon: GitBranch,
      label: 'Git',
      onClick: onGitToggle,
      isActive: isGitOpen,
    },
    {
      id: 'run',
      icon: Play,
      label: 'Çalıştır',
      onClick: onRunToggle,
      isActive: isRunOpen,
    },
    {
      id: 'terminal',
      icon: Terminal,
      label: 'Terminal',
      onClick: onTerminalToggle,
      isActive: isTerminalOpen,
    },
    {
      id: 'errors',
      icon: AlertCircle,
      label: 'Hatalar',
      onClick: onErrorsToggle,
      isActive: isErrorsOpen,
    },
    {
      id: 'device',
      icon: Smartphone,
      label: 'Cihaz',
      onClick: onDeviceToggle,
      isActive: isDeviceOpen,
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Ayarlar',
      onClick: onSettingsToggle,
      isActive: isSettingsOpen,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700">
      <div className="flex items-center justify-around py-2 px-4">
        {buttons.map(({ id, icon: Icon, label, onClick, isActive }) => (
          <button
            key={id}
            onClick={onClick}
            onMouseEnter={() => setShowTooltip(id)}
            onMouseLeave={() => setShowTooltip(null)}
            className={`
              relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }
            `}
            aria-label={label}
          >
            <Icon size={20} />
            <span className="text-xs mt-1 hidden sm:block">{label}</span>
            
            {/* Tooltip */}
            {showTooltip === id && (
              <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
                {label}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
