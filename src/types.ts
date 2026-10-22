export interface CellPartInfo {
  id: string;
  name: string;
  color: string;
  hexColor: number;
  description: string;
  functionText: string;
  funFact: string;
  category: 'envelope' | 'cytoplasm' | 'genetic' | 'appendage';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  targetPartId?: string;
  explanation: string;
}

export type ViewMode = 'explore' | 'quiz' | 'info';
