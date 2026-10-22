import React from 'react';
import { Eye, EyeOff, Focus, X } from 'lucide-react';
import { CELL_PARTS } from '../data/cellData';
import { CellPartInfo } from '../types';

interface LegendSidebarProps {
  selectedPart: CellPartInfo | null;
  onSelectPart: (part: CellPartInfo | null) => void;
  visibleParts: Record<string, boolean>;
  onToggleVisibility: (partId: string) => void;
  onToggleAllVisibility: (show: boolean) => void;
  focusMode: boolean;
  onToggleFocusMode: (part?: CellPartInfo) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const LegendSidebar: React.FC<LegendSidebarProps> = ({
  selectedPart,
  onSelectPart,
  visibleParts,
  onToggleVisibility,
  onToggleAllVisibility,
  focusMode,
  onToggleFocusMode,
  isOpen,
  onClose
}) => {
  const allVisible = Object.values(visibleParts).every(Boolean);

  return (
    <aside
      className={`absolute top-20 left-4 z-20 w-80 max-h-[calc(100vh-140px)] bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xl flex flex-col transition-all duration-300 transform ${
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto'
      }`}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Chú giải cấu trúc</h2>
          <p className="text-xs text-slate-500">Nhấp để chọn & cô lập bộ phận</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleAllVisibility(!allVisible)}
            title={allVisible ? 'Ẩn tất cả' : 'Hiển thị tất cả'}
            className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
          >
            {allVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Focus Mode Active Banner */}
      {focusMode && selectedPart && (
        <div className="mx-3 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Focus className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-amber-900 truncate">Đang tập trung:</p>
              <p className="text-xs text-amber-800 truncate font-semibold">{selectedPart.name}</p>
            </div>
          </div>
          <button
            onClick={() => onToggleFocusMode()}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold shrink-0 transition-colors shadow-xs"
          >
            Thoát
          </button>
        </div>
      )}

      <div className="overflow-y-auto p-3 space-y-1.5 flex-1">
        {CELL_PARTS.map((part) => {
          const isSelected = selectedPart?.id === part.id;
          const isVisible = visibleParts[part.id] ?? true;
          const isFocused = focusMode && isSelected;

          return (
            <div
              key={part.id}
              className={`group flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                isFocused
                  ? 'bg-amber-50 border border-amber-300 shadow-xs'
                  : isSelected
                  ? 'bg-teal-50 border border-teal-200 shadow-xs'
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
              onClick={() => {
                onSelectPart(isSelected ? null : part);
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-4 h-4 rounded-full shrink-0 shadow-xs border border-black/10"
                  style={{ backgroundColor: `#${part.hexColor.toString(16).padStart(6, '0')}` }}
                />
                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate ${isFocused ? 'text-amber-900 font-bold' : isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                    {part.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{part.color}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFocusMode(part);
                  }}
                  title={isFocused ? 'Thoát tập trung' : 'Tập trung (Cô lập cấu trúc này)'}
                  className={`p-1 rounded-md transition-colors ${
                    isFocused
                      ? 'text-amber-700 bg-amber-100 hover:bg-amber-200'
                      : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <Focus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(part.id);
                  }}
                  title={isVisible ? 'Ẩn bộ phận này' : 'Hiện bộ phận này'}
                  className={`p-1 rounded-md transition-colors ${
                    isVisible
                      ? 'text-slate-500 hover:text-teal-600 hover:bg-teal-100/50'
                      : 'text-slate-300 hover:text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <p className="text-[11px] text-slate-500 text-center">
          💡 Nhấp icon ⊙ để cô lập riêng cấu trúc đó.
        </p>
      </div>
    </aside>
  );
};
