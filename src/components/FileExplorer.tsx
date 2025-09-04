'use client';

import { useState } from 'react';
import { 
  File, 
  Folder, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Edit3,
  FileText,
  FileCode,
  FileJson
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
  children?: FileItem[];
  isOpen?: boolean;
}

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  onFileCreate: (name: string, type: 'file' | 'folder', parentId?: string) => void;
  onFileRename: (id: string, newName: string) => void;
  onFileDelete: (id: string) => void;
  selectedFileId?: string;
}

const getFileIcon = (file: FileItem) => {
  if (file.type === 'folder') {
    return file.isOpen ? FolderOpen : Folder;
  }
  
  switch (file.language) {
    case 'html':
      return FileCode;
    case 'css':
      return FileCode;
    case 'javascript':
    case 'typescript':
      return FileCode;
    case 'json':
      return FileJson;
    case 'markdown':
      return FileText;
    default:
      return File;
  }
};

export default function FileExplorer({
  files,
  onFileSelect,
  onFileCreate,
  onFileRename,
  onFileDelete,
  selectedFileId,
}: FileExplorerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [createMenuPosition, setCreateMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      // Toggle folder open/close
      onFileSelect({ ...file, isOpen: !file.isOpen });
    } else {
      onFileSelect(file);
    }
  };

  const handleRename = (file: FileItem) => {
    setEditingId(file.id);
    setEditingName(file.name);
  };

  const handleRenameSubmit = () => {
    if (editingName.trim()) {
      onFileRename(editingId!, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleCreateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCreateMenuPosition({ x: e.clientX, y: e.clientY });
    setShowCreateMenu(true);
  };

  const handleCreateFile = (type: 'file' | 'folder') => {
    const name = prompt(`Yeni ${type === 'file' ? 'dosya' : 'klasör'} adı:`);
    if (name?.trim()) {
      onFileCreate(name.trim(), type);
    }
    setShowCreateMenu(false);
  };

  const renderFile = (file: FileItem, depth = 0) => {
    const Icon = getFileIcon(file);
    const isSelected = selectedFileId === file.id;
    const isEditing = editingId === file.id;

    return (
      <div key={file.id}>
        <div
          className={`
            flex items-center py-2 px-3 cursor-pointer group hover:bg-gray-700 transition-colors
            ${isSelected ? 'bg-blue-600' : ''}
          `}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => handleFileClick(file)}
        >
          <Icon size={16} className="mr-2 text-gray-400" />
          
          {isEditing ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit();
                if (e.key === 'Escape') setEditingId(null);
              }}
              className="flex-1 bg-gray-800 text-white px-2 py-1 rounded text-sm"
              autoFocus
            />
          ) : (
            <span className="flex-1 text-sm text-white truncate">{file.name}</span>
          )}
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRename(file);
              }}
              className="p-1 hover:bg-gray-600 rounded"
            >
              <Edit3 size={12} className="text-gray-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
                  onFileDelete(file.id);
                }
              }}
              className="p-1 hover:bg-gray-600 rounded"
            >
              <Trash2 size={12} className="text-red-400" />
            </button>
          </div>
        </div>
        
        {file.type === 'folder' && file.isOpen && file.children && (
          <div>
            {file.children.map((child) => renderFile(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Dosyalar</h3>
          <button
            onClick={handleCreateClick}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Yeni dosya/klasör"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {files.map((file) => renderFile(file))}
      </div>
      
      {showCreateMenu && createMenuPosition && (
        <div
          className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-lg py-2 z-50"
          style={{
            left: createMenuPosition.x,
            top: createMenuPosition.y,
          }}
        >
          <button
            onClick={() => handleCreateFile('file')}
            className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center"
          >
            <File size={16} className="mr-2" />
            Yeni Dosya
          </button>
          <button
            onClick={() => handleCreateFile('folder')}
            className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center"
          >
            <Folder size={16} className="mr-2" />
            Yeni Klasör
          </button>
        </div>
      )}
    </div>
  );
}
