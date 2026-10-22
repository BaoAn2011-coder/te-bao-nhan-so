import React, { useState } from 'react';
import { Layers, Scissors, Play, Pause, ChevronUp, ChevronDown, RotateCcw, Maximize2, Shield, Compass } from 'lucide-react';

interface ControlDockProps {
  cellMode: 'cutaway' | 'intact' | 'exploded';
  onCellModeChange: (mode: 'cutaway' | 'intact' | 'exploded') => void;
  crossSectionEnabled: boolean;
  onToggleCrossSection: () => void;
  flagellaAnimated: boolean;
  onToggleFlagellaAnimation: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onResetView: () => void;
  onToggleFullscreen: () => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  cellMode,
  onCellModeChange,
  crossSectionEnabled,
  onToggleCrossSection,
  flagellaAnimated,
  onToggleFlagellaAnimation,
  autoRotate,
  onToggleAutoRotate,
  onResetView,
  onToggleFullscreen
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-25 w-[92%] max-w-[920px] transition-all duration-300">
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-full text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <span>{isExpanded ? 'Ẩn bảng điều khiển' : 'Hiển thị công cụ 3D'}</span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
            <button
              onClick={() => onCellModeChange('cutaway')}
              className={`flex-1 md:flex-initial px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                cellMode === 'cutaway'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Khoét vỏ (Cutaway)</span>
            </button>
            <button
              onClick={() => onCellModeChange('intact')}
              className={`flex-1 md:flex-initial px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                cellMode === 'intact'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Nguyên vẹn</span>
            </button>
            <button
              onClick={() => onCellModeChange('exploded')}
              className={`flex-1 md:flex-initial px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                cellMode === 'exploded'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tách lớp</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            <button
              onClick={onToggleAutoRotate}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-all shadow-xs ${
                autoRotate
                  ? 'bg-teal-600 text-white shadow-teal-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Bật/tắt tự động xoay mô hình"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Tự động xoay</span>
            </button>

            <button
              onClick={onToggleFlagellaAnimation}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-all shadow-xs ${
                flagellaAnimated
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Bật/tắt chuyển động roi"
            >
              {flagellaAnimated ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>Roi chuyển động</span>
            </button>

            <button
              onClick={onResetView}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="Đặt lại góc nhìn"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleFullscreen}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="Toàn màn hình"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
