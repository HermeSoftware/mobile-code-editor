import { render, screen, fireEvent } from '@testing-library/react';
import FileExplorer from '../FileExplorer';

const mockFiles = [
  {
    id: '1',
    name: 'index.html',
    type: 'file' as const,
    language: 'html',
    content: '<h1>Hello</h1>',
  },
  {
    id: '2',
    name: 'styles',
    type: 'folder' as const,
    isOpen: false,
    children: [
      {
        id: '3',
        name: 'style.css',
        type: 'file' as const,
        language: 'css',
        content: 'body { margin: 0; }',
      },
    ],
  },
];

const mockProps = {
  files: mockFiles,
  onFileSelect: jest.fn(),
  onFileCreate: jest.fn(),
  onFileRename: jest.fn(),
  onFileDelete: jest.fn(),
  selectedFileId: '1',
};

describe('FileExplorer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders file list', () => {
    render(<FileExplorer {...mockProps} />);
    
    expect(screen.getByText('index.html')).toBeInTheDocument();
    expect(screen.getByText('styles')).toBeInTheDocument();
  });

  it('calls onFileSelect when file is clicked', () => {
    render(<FileExplorer {...mockProps} />);
    
    fireEvent.click(screen.getByText('index.html'));
    expect(mockProps.onFileSelect).toHaveBeenCalledWith(mockFiles[0]);
  });

  it('shows create menu when plus button is clicked', () => {
    render(<FileExplorer {...mockProps} />);
    
    const createButton = screen.getByTitle('Yeni dosya/klasör');
    fireEvent.click(createButton);
    
    expect(screen.getByText('Yeni Dosya')).toBeInTheDocument();
    expect(screen.getByText('Yeni Klasör')).toBeInTheDocument();
  });

  it('calls onFileCreate when creating new file', () => {
    render(<FileExplorer {...mockProps} />);
    
    const createButton = screen.getByTitle('Yeni dosya/klasör');
    fireEvent.click(createButton);
    
    // Mock prompt
    window.prompt = jest.fn().mockReturnValue('new-file.js');
    
    fireEvent.click(screen.getByText('Yeni Dosya'));
    
    expect(mockProps.onFileCreate).toHaveBeenCalledWith('new-file.js', 'file', undefined);
  });

  it('shows selected file with active styling', () => {
    render(<FileExplorer {...mockProps} />);
    
    const selectedFile = screen.getByText('index.html').closest('div');
    expect(selectedFile).toHaveClass('bg-blue-600');
  });
});
