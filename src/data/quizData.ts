import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Cấu trúc nào sau đây chứa vật chất di truyền chính (DNA vùng nhân) của tế bào nhân sơ?',
    options: [
      'Màng nhân',
      'Vùng nhân chứa DNA',
      'Plasmid',
      'Ribosome'
    ],
    correctIndex: 1,
    targetPartId: 'nucleoid',
    explanation: 'Tế bào nhân sơ chưa có màng nhân hoàn chỉnh, vật chất di truyền tập trung ở vùng nhân (nucleoid) dạng sợi xoắn.'
  },
  {
    id: 2,
    question: 'Bào quan nào có nhiệm vụ chính là tổng hợp protein cho tế bào vi khuẩn?',
    options: [
      'Plasmid',
      'Roi (Flagella)',
      'Ribosome',
      'Thành tế bào'
    ],
    correctIndex: 2,
    targetPartId: 'ribosome',
    explanation: 'Ribosome là bào quan không có màng bọc, phân bố trong tế bào chất, chịu trách nhiệm tổng hợp protein.'
  },
  {
    id: 3,
    question: 'Phân tử DNA nhỏ dạng vòng nằm ngoài DNA vùng nhân chính ở nhiều vi khuẩn được gọi là gì?',
    options: [
      'Plasmid',
      'Chromatin',
      'Centromere',
      'Nucleolus'
    ],
    correctIndex: 0,
    targetPartId: 'plasmid',
    explanation: 'Plasmid là phân tử DNA nhỏ dạng vòng, thường mang các gen kháng thuốc kháng sinh.'
  },
  {
    id: 4,
    question: 'Cấu trúc nào giúp vi khuẩn có khả năng bám dính vào các bề mặt hoặc tế bào chủ?',
    options: [
      'Roi (Flagellum)',
      'Lông (Pili)',
      'Màng ngoài',
      'Tế bào chất'
    ],
    correctIndex: 1,
    targetPartId: 'pili',
    explanation: 'Lông (pili/fimbriae) là các sợi ngắn giúp vi khuẩn bám chắc vào bề mặt hoặc tế bào khác.'
  },
  {
    id: 5,
    question: 'Thành phần nào quy định hình dạng và bảo vệ tế bào vi khuẩn khỏi bị vỡ do áp suất thẩm thấu?',
    options: [
      'Màng tế bào',
      'Thành tế bào',
      'Tế bào chất',
      'Vùng nhân'
    ],
    correctIndex: 1,
    targetPartId: 'cellWall',
    explanation: 'Thành tế bào (được cấu tạo bởi peptidoglycan) giúp duy trì hình dạng và chịu lực căng thẩm thấu.'
  }
];
