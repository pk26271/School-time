export type WorkspaceId =
  | 'directory'
  | 'flashcards'
  | 'focus'
  | 'recall'
  | 'feynman'
  | 'notes'
  | 'formulas'
  | 'mindmap'
  | 'speedread'
  | 'gpa'
  | 'quests';

export interface StudyFeature {
  id: number;
  code: string;
  name: string;
  category: string;
  categoryIndex: number;
  description: string;
  discipline: string;
  tags: string[];
  workspaceTarget?: WorkspaceId;
  mastered?: boolean;
  bookmarked?: boolean;
  proTip: string;
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  category?: string;
  hint?: string;
  repetitions: number;
  interval: number; // in days
  easeFactor: number;
  box: number; // Leitner box 1-5
  nextReviewDate: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  subject: string;
  cardCount?: number;
  cards: Flashcard[];
}

export interface CornellNote {
  id: string;
  title: string;
  subject: string;
  tags: string[];
  cues: string[];
  notes: string;
  summary: string;
  updatedAt: string;
  links: string[]; // Zettelkasten [[Note Title]]
}

export interface FormulaItem {
  id: string;
  name: string;
  category: 'Physics' | 'Calculus' | 'Chemistry' | 'Statistics' | 'Finance';
  latex: string;
  description: string;
  variables: { [key: string]: string };
  solveFor: string;
  compute: (inputs: { [key: string]: number }) => number;
  unit: string;
  defaultInputs: { [key: string]: number };
}

export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: string;
  period: number;
  group: number;
  electronConfig: string;
  summary: string;
}

export interface CourseGrade {
  id: string;
  name: string;
  credits: number;
  grade: string;
  percentage?: number;
}

export interface MindNode {
  id: string;
  title: string;
  category: string;
  x: number;
  y: number;
  notes?: string;
}

export interface MindEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface StudySessionLog {
  id: string;
  date: string;
  durationMinutes: number;
  technique: string;
  subject: string;
  xpEarned: number;
}

export interface ScholarQuest {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  targetCount: number;
  currentCount: number;
  badge?: string;
}
