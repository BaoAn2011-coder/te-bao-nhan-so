import React from 'react';
import { BookOpen, HelpCircle, RotateCcw, Box, Presentation } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentMode: ViewMode;
  onSetMode: (mode: ViewMode) => void;
  onResetCamera: () => void;
  presentationMode: boolean;
  onTogglePresentationMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSetMode,
  onResetCamera,
  presentationMode,
  onTogglePresentationMode
}) => {
  return (
    <header className={`flex items-center justify-between gap-8 px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs relative z-30 transition-all ${presentationMode ? 'opacity-40 hover:opacity-100' : ''}`}>
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
          <Box className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            Khám Phá Tế Bào Nhân Sơ 3D
          </h1>
          <p className="text-xs text-slate-500 font-medium">Mô hình sinh học THPT</p>
        </div>
      </div>

      {/* Zone 2: Navigation */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => onSetMode('explore')}
          className={`transition-colors whitespace-nowrap ${currentMode === 'explore' ? 'text-teal-600 font-semibold' : 'hover:text-slate-900'}`}
        >
          Mô hình 3D
        </button>
        <button
          onClick={() => onSetMode('info')}
          className={`transition-colors whitespace-nowrap ${currentMode === 'info' ? 'text-teal-600 font-semibold' : 'hover:text-slate-900'}`}
        >
          Tài liệu cấu tạo
        </button>
        <button
          onClick={() => onSetMode('quiz')}
          className={`transition-colors whitespace-nowrap flex items-center gap-1.5 ${currentMode === 'quiz' ? 'text-teal-600 font-semibold' : 'hover:text-slate-900'}`}
        >
          <HelpCircle className="w-4 h-4 text-teal-600" />
          Kiểm tra kiến thức
        </button>
      </nav>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onTogglePresentationMode}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            presentationMode
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          title="Bật/tắt chế độ thuyết trình (ẩn bớt giao diện)"
        >
          <Presentation className="w-4 h-4" />
          <span>{presentationMode ? 'Thoát Thuyết trình' : 'Thuyết trình'}</span>
        </button>

        <button
          onClick={onResetCamera}
          title="Đặt lại góc nhìn camera"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Góc nhìn chuẩn</span>
        </button>

        <button
          onClick={() => onSetMode(currentMode === 'quiz' ? 'explore' : 'quiz')}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
        >
          {currentMode === 'quiz' ? (
            <>
              <Box className="w-4 h-4" />
              <span>Quay lại Mô hình</span>
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4" />
              <span>Làm trắc nghiệm</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
