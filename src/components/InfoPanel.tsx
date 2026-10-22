import React from 'react';
import { Info, Lightbulb, Sparkles, X, Focus, EyeOff } from 'lucide-react';
import { CellPartInfo } from '../types';

interface InfoPanelProps {
  selectedPart: CellPartInfo | null;
  onClose: () => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  selectedPart,
  onClose,
  focusMode,
  onToggleFocusMode
}) => {
  if (!selectedPart) {
    return (
      <div className="absolute top-20 right-4 z-20 w-80 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xl p-5 hidden xl:block pointer-events-none">
        <div className="flex items-center gap-3 text-slate-400">
          <Info className="w-5 h-5 text-teal-600 shrink-0" />
          <p className="text-xs text-slate-600 font-medium">
            Nhấp vào bất kỳ bộ phận nào trên mô hình 3D hoặc trong bảng chú giải để xem thông tin chi tiết và cô lập cấu trúc (Focus Mode).
          </p>
        </div>
      </div>
    );
  }

  return (
    <aside className="absolute top-20 right-4 z-20 w-80 sm:w-96 max-h-[calc(100vh-140px)] bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xl flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-4 h-4 rounded-full shadow-xs border border-black/10 shrink-0"
            style={{ backgroundColor: `#${selectedPart.hexColor.toString(16).padStart(6, '0')}` }}
          />
          <h2 className="text-base font-bold text-slate-900 truncate">{selectedPart.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-y-auto p-5 space-y-4 text-xs text-slate-600 flex-1">
        {/* Focus Mode Toggle Button */}
        <button
          onClick={onToggleFocusMode}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold transition-all shadow-xs ${
            focusMode
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
          }`}
        >
          <Focus className="w-4 h-4" />
          <span>{focusMode ? 'Thoát tập trung (Hiện tất cả)' : 'Tập trung cô lập cấu trúc này'}</span>
        </button>

        <div className="space-y-1.5">
          <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] text-teal-600 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Cấu tạo chi tiết
          </h3>
          <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {selectedPart.description}
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] text-teal-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Chức năng sinh học
          </h3>
          <p className="leading-relaxed bg-teal-50/50 p-3 rounded-xl border border-teal-100/60 text-teal-950 font-medium">
            {selectedPart.functionText}
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] text-amber-600 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            Góc sinh học vui
          </h3>
          <p className="leading-relaxed bg-amber-50/60 p-3 rounded-xl border border-amber-100/80 text-amber-950">
            {selectedPart.funFact}
          </p>
        </div>
      </div>
    </aside>
  );
};
