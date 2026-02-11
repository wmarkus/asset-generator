import { useState, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header, Sidebar } from '@/components/Layout';
import { SocialCardCanvas, HeaderCanvas, CanvasControls } from '@/components/Canvas';
import { useCanvasZoom } from '@/hooks/useCanvasZoom';
import { DEFAULT_CONFIG, getHeaderHeight, type AssetConfig, type AssetType, type FocusedField } from '@/types';

function App() {
  const [config, setConfig] = useState<AssetConfig>(DEFAULT_CONFIG);
  const [activeAsset, setActiveAsset] = useState<AssetType>('social');
  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  
  const {
    canvasState,
    containerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetView,
    zoomIn,
    zoomOut,
  } = useCanvasZoom(0.3);

  const handleExport = useCallback(() => {
    // Clear focus highlight during export
    setFocusedField(null);
    
    // Small delay to allow canvas to redraw without highlight
    setTimeout(() => {
      const canvasId = activeAsset === 'social' ? 'social-card-canvas' : 'header-canvas';
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    
      if (!canvas) {
        console.error('Canvas not found');
        return;
      }

      const filename = activeAsset === 'social' 
        ? 'github-copilot-social-card.png'
        : 'github-copilot-header.png';

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        },
        'image/png',
        1.0
      );
    }, 50);
  }, [activeAsset]);

  return (
    <div className="h-screen flex flex-col bg-background dark">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          config={config}
          activeAsset={activeAsset}
          onConfigChange={setConfig}
          onExport={handleExport}
          focusedField={focusedField}
          onFocusField={setFocusedField}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Asset Type Tabs */}
          <div className="border-b px-4 py-2 bg-muted/20 flex justify-center">
            <Tabs value={activeAsset} onValueChange={(v) => setActiveAsset(v as AssetType)}>
              <TabsList>
                <TabsTrigger value="social">
                  Social Card (2400×1260)
                </TabsTrigger>
                <TabsTrigger value="header">
                  Header Image (2064×{getHeaderHeight(config.heroCount)})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Canvas Area */}
          <div
            ref={containerRef}
            className="flex-1 overflow-hidden relative bg-neutral-900 flex items-center justify-center cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {activeAsset === 'social' ? (
              <SocialCardCanvas
                config={config}
                zoom={canvasState.zoom}
                panX={canvasState.panX}
                panY={canvasState.panY}
                focusedField={focusedField}
              />
            ) : (
              <HeaderCanvas
                config={config}
                zoom={canvasState.zoom}
                panX={canvasState.panX}
                panY={canvasState.panY}
                focusedField={focusedField}
              />
            )}

            <CanvasControls
              zoom={canvasState.zoom}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onResetView={resetView}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
