import { render, screen, fireEvent } from '@testing-library/react';
import BottomBar from '../BottomBar';

const mockProps = {
  onFileExplorerToggle: jest.fn(),
  onGitToggle: jest.fn(),
  onRunToggle: jest.fn(),
  onTerminalToggle: jest.fn(),
  onErrorsToggle: jest.fn(),
  onDeviceToggle: jest.fn(),
  onSettingsToggle: jest.fn(),
  isFileExplorerOpen: false,
  isGitOpen: false,
  isRunOpen: false,
  isTerminalOpen: false,
  isErrorsOpen: false,
  isDeviceOpen: false,
  isSettingsOpen: false,
};

describe('BottomBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all navigation buttons', () => {
    render(<BottomBar {...mockProps} />);
    
    expect(screen.getByLabelText('Dosyalar')).toBeInTheDocument();
    expect(screen.getByLabelText('Git')).toBeInTheDocument();
    expect(screen.getByLabelText('Çalıştır')).toBeInTheDocument();
    expect(screen.getByLabelText('Terminal')).toBeInTheDocument();
    expect(screen.getByLabelText('Hatalar')).toBeInTheDocument();
    expect(screen.getByLabelText('Cihaz')).toBeInTheDocument();
    expect(screen.getByLabelText('Ayarlar')).toBeInTheDocument();
  });

  it('calls appropriate handler when button is clicked', () => {
    render(<BottomBar {...mockProps} />);
    
    fireEvent.click(screen.getByLabelText('Dosyalar'));
    expect(mockProps.onFileExplorerToggle).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByLabelText('Git'));
    expect(mockProps.onGitToggle).toHaveBeenCalledTimes(1);
  });

  it('shows active state for open panels', () => {
    render(
      <BottomBar
        {...mockProps}
        isFileExplorerOpen={true}
        isRunOpen={true}
      />
    );
    
    const filesButton = screen.getByLabelText('Dosyalar');
    const runButton = screen.getByLabelText('Çalıştır');
    
    expect(filesButton).toHaveClass('bg-blue-600');
    expect(runButton).toHaveClass('bg-blue-600');
  });

  it('shows tooltips on hover', () => {
    render(<BottomBar {...mockProps} />);
    
    const filesButton = screen.getByLabelText('Dosyalar');
    fireEvent.mouseEnter(filesButton);
    
    expect(screen.getByText('Dosyalar')).toBeInTheDocument();
  });
});
