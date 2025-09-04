'use client';

import { useState, useEffect, useRef } from 'react';
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink } from 'lucide-react';

interface LivePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const deviceSizes = {
  desktop: { width: '100%', height: '100%' },
  tablet: { width: '768px', height: '1024px' },
  mobile: { width: '375px', height: '667px' },
};

export default function LivePreview({
  isOpen,
  onClose,
  htmlContent,
  cssContent,
  jsContent,
}: LivePreviewProps) {
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile');
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const generatePreviewContent = () => {
    return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        ${cssContent}
    </style>
</head>
<body>
    ${htmlContent}
    <script>
        try {
            ${jsContent}
        } catch (error) {
            console.error('JavaScript Error:', error);
            document.body.innerHTML += '<div style="color: red; padding: 10px; border: 1px solid red; margin: 10px;">JavaScript Hatası: ' + error.message + '</div>';
        }
    </script>
</body>
</html>`;
  };

  const refreshPreview = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      const content = generatePreviewContent();
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
      
      // Clean up previous URL
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setIsLoading(false);
      }, 100);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshPreview();
    }
  }, [isOpen, htmlContent, cssContent, jsContent]);

  const openInNewTab = () => {
    const content = generatePreviewContent();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="w-full h-2/3 bg-gray-900 rounded-t-lg flex flex-col">
        {/* Preview Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">Canlı Önizleme</span>
            
            {/* Device Type Selector */}
            <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setDeviceType('mobile')}
                className={`p-2 rounded transition-colors ${
                  deviceType === 'mobile'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Mobil"
              >
                <Smartphone size={16} />
              </button>
              <button
                onClick={() => setDeviceType('tablet')}
                className={`p-2 rounded transition-colors ${
                  deviceType === 'tablet'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Tablet"
              >
                <Tablet size={16} />
              </button>
              <button
                onClick={() => setDeviceType('desktop')}
                className={`p-2 rounded transition-colors ${
                  deviceType === 'desktop'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Masaüstü"
              >
                <Monitor size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshPreview}
              disabled={isLoading}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              title="Yenile"
            >
              <RefreshCw size={16} className={`text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openInNewTab}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Yeni sekmede aç"
            >
              <ExternalLink size={16} className="text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Kapat"
            >
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
            style={deviceSizes[deviceType]}
          >
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
                title="Live Preview"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
