import React from 'react';
import { BookOpen, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import { CELL_PARTS } from '../data/cellData';

interface DocumentationViewProps {
  onBack: () => void;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({ onBack }) => {
  return (
    <div className="absolute inset-0 bg-slate-50 z-30 overflow-y-auto p-6 sm:p-12">
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <span className="text-teal-600 font-semibold text-xs tracking-wider uppercase">Tài liệu sinh học THPT</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Cấu tạo tế bào nhân sơ điển hình
            </h1>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Mô hình 3D</span>
          </button>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Tổng quan về tế bào nhân sơ (Prokaryotic Cell)
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Tế bào nhân sơ là dạng tế bào chưa có màng nhân hoàn chỉnh (nhân chưa được bao bọc bởi màng nhân). Vi khuẩn (Bacteria) và Vi khuẩn cổ (Archaea) là những đại diện điển hình cho nhóm sinh vật nhân sơ. Kích thước của tế bào nhân sơ rất nhỏ (thường từ 1 - 5 µm), cấu tạo đơn giản nhưng có tốc độ sinh sản và thích nghi cực cao.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Chi tiết các cấu trúc tế bào</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CELL_PARTS.map((part) => (
              <div key={part.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full shadow-xs border border-black/10 shrink-0"
                    style={{ backgroundColor: `#${part.hexColor.toString(16).padStart(6, '0')}` }}
                  />
                  <h3 className="text-base font-bold text-slate-900">{part.name}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{part.description}</p>
                <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-xs text-teal-950 font-medium">
                  <strong>Chức năng:</strong> {part.functionText}
                </div>
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-950">
                  <strong>💡 Góc vui:</strong> {part.funFact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
