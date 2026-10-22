import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, X } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';

interface QuizModalProps {
  onClose: () => void;
  onSelectPartById?: (partId: string) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === question.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!quizFinished ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">
                Câu hỏi {currentIndex + 1} / {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">Điểm: {score}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-6 leading-snug">
              {question.question}
            </h3>

            <div className="space-y-3 mb-6">
              {question.options.map((option, idx) => {
                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                if (isAnswered) {
                  if (idx === question.correctIndex) {
                    btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between text-sm ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && idx === question.correctIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== question.correctIndex && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed animate-in fade-in">
                <span className="font-bold text-slate-900 block mb-1">Giải thích sinh học:</span>
                {question.explanation}
              </div>
            )}

            <div className="flex justify-end">
              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-teal-600/20 transition-all"
                >
                  <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600 shadow-inner">
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Hoàn thành bài kiểm tra!</h3>
            <p className="text-sm text-slate-600 mb-6">
              Bạn đã trả lời đúng <strong className="text-teal-600 font-bold">{score}</strong> / <strong className="text-slate-900">{QUIZ_QUESTIONS.length}</strong> câu hỏi.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-teal-600/20 transition-all"
              >
                Quay lại Mô hình 3D
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
