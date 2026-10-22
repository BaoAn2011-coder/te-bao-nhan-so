import React, { useState } from 'react';
import { Header } from './components/Header';
import { LegendSidebar } from './components/LegendSidebar';
import { InfoPanel } from './components/InfoPanel';
import { ControlDock } from './components/ControlDock';
import { CellCanvas } from './components/CellCanvas';
import { QuizModal } from './components/QuizModal';
import { DocumentationView } from './components/DocumentationView';
import { CELL_PARTS } from './data/cellData';
import { CellPartInfo, ViewMode } from './types';

export default function App() {
  const [currentMode, setCurrentMode] = useState<ViewMode>('explore');
  const [selectedPart, setSelectedPart] = useState<CellPartInfo | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Visibility state for all parts
  const [visibleParts, setVisibleParts] = useState<Record<string, boolean>>(
    CELL_PARTS.reduce((acc, part) => ({ ...acc, [part.id]: true }), {})
  );

  // 3D Cutaway, Focus & Presentation modes
  const [cellMode, setCellMode] = useState<'cutaway' | 'intact' | 'exploded'>('cutaway');
  const [crossSectionEnabled, setCrossSectionEnabled] = useState(false);
  const [flagellaAnimated, setFlagellaAnimated] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const handleToggleVisibility = (partId: string) => {
    setVisibleParts(prev => ({ ...prev, [partId]: !prev[partId] }));
  };

  const handleToggleAllVisibility = (show: boolean) => {
    setVisibleParts(CELL_PARTS.reduce((acc, part) => ({ ...acc, [part.id]: show }), {}));
    if (show) setFocusMode(false);
  };

  const handleToggleFocusMode = (part?: CellPartInfo) => {
    if (part) {
      setSelectedPart(part);
      setFocusMode(true);
    } else {
      setFocusMode(!focusMode);
    }
  };

  const handleResetCamera = () => {
    setCellMode('cutaway');
    setCrossSectionEnabled(false);
    setAutoRotate(false);
    setFocusMode(false);
    setSelectedPart(null);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 font-sans select-none">
      <Header
        currentMode={currentMode}
        onSetMode={(mode) => setCurrentMode(mode)}
        onResetCamera={handleResetCamera}
        presentationMode={presentationMode}
        onTogglePresentationMode={() => setPresentationMode(!presentationMode)}
      />

      <main className="flex-1 relative overflow-hidden flex">
        {currentMode === 'info' ? (
          <DocumentationView onBack={() => setCurrentMode('explore')} />
        ) : (
          <>
            {/* 3D Viewport */}
            <div className="absolute inset-0">
              <CellCanvas
                selectedPart={selectedPart}
                onSelectPart={(part) => {
                  setSelectedPart(part);
                  // If focus mode is active, selecting another part keeps it focused on that new part
                }}
                visibleParts={visibleParts}
                cellMode={cellMode}
                crossSectionEnabled={crossSectionEnabled}
                flagellaAnimated={flagellaAnimated}
                autoRotate={autoRotate}
                focusMode={focusMode}
                onUserInteract={() => setAutoRotate(false)}
              />
            </div>

            {/* Legend Sidebar (Hidden in Presentation Mode) */}
            {!presentationMode && (
              <LegendSidebar
                selectedPart={selectedPart}
                onSelectPart={(part) => setSelectedPart(part)}
                visibleParts={visibleParts}
                onToggleVisibility={handleToggleVisibility}
                onToggleAllVisibility={handleToggleAllVisibility}
                focusMode={focusMode}
                onToggleFocusMode={handleToggleFocusMode}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            )}

            {/* Info Panel */}
            {(!presentationMode || selectedPart) && (
              <InfoPanel
                selectedPart={selectedPart}
                onClose={() => setSelectedPart(null)}
                focusMode={focusMode}
                onToggleFocusMode={() => handleToggleFocusMode(selectedPart || undefined)}
              />
            )}

            {/* Bottom Control Dock (Hidden in Presentation Mode) */}
            {!presentationMode && (
              <ControlDock
                cellMode={cellMode}
                onCellModeChange={(mode) => setCellMode(mode)}
                crossSectionEnabled={crossSectionEnabled}
                onToggleCrossSection={() => setCrossSectionEnabled(!crossSectionEnabled)}
                flagellaAnimated={flagellaAnimated}
                onToggleFlagellaAnimation={() => setFlagellaAnimated(!flagellaAnimated)}
                autoRotate={autoRotate}
                onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
                onResetView={handleResetCamera}
                onToggleFullscreen={handleToggleFullscreen}
              />
            )}

            {/* Quiz Modal */}
            {currentMode === 'quiz' && (
              <QuizModal
                onClose={() => setCurrentMode('explore')}
                onSelectPartById={(partId) => {
                  const part = CELL_PARTS.find(p => p.id === partId);
                  if (part) setSelectedPart(part);
                  setCurrentMode('explore');
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
