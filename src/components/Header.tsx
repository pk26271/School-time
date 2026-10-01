import React from 'react';
import { WorkspaceId } from '../types';
import { Search, Trophy } from 'lucide-react';

interface HeaderProps {
  activeWorkspace: WorkspaceId;
  onSelectWorkspace: (id: WorkspaceId) => void;
  onOpenCommand: () => void;
  masteredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeWorkspace,
  onSelectWorkspace,
  onOpenCommand,
  masteredCount,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-3.5 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onSelectWorkspace('directory')}
        className="text-left group cursor-pointer focus:outline-none"
      >
        <span className="font-display text-xl font-bold tracking-tight text-slate-100 group-hover:text-amber-400 transition-colors">
          ScholarOS 1000
        </span>
      </button>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
        <button
          onClick={() => onSelectWorkspace('directory')}
          className={`transition-colors cursor-pointer ${
            activeWorkspace === 'directory'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          1,000 Matrix
        </button>
        <button
          onClick={() => onSelectWorkspace('flashcards')}
          className={`transition-colors cursor-pointer ${
            activeWorkspace === 'flashcards'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          Flashcards SRS
        </button>
        <button
          onClick={() => onSelectWorkspace('focus')}
          className={`transition-colors cursor-pointer ${
            activeWorkspace === 'focus'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          Focus & Sound
        </button>
        <button
          onClick={() => onSelectWorkspace('feynman')}
          className={`transition-colors cursor-pointer ${
            activeWorkspace === 'feynman'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          Feynman Studio
        </button>
        <button
          onClick={() => onSelectWorkspace('notes')}
          className={`transition-colors cursor-pointer ${
            activeWorkspace === 'notes'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          Cornell Notes
        </button>
        <button
          onClick={() => onSelectWorkspace('formulas')}
          className={`transition-colors cursor-pointer ${
            activeWorkspace === 'formulas'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          STEM Vault
        </button>
        <button
          onClick={() => onSelectWorkspace('mindmap')}
          className={`transition-colors cursor-pointer ${
            activeWorkspace === 'mindmap'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          Concept Graph
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCommand}
          className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors"
          title="Search all 1,000 features"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Find 1,000 Features</span>
          <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5 text-[10px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => onSelectWorkspace('quests')}
          className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors whitespace-nowrap cursor-pointer"
        >
          <Trophy className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-mono-tabular">{masteredCount} / 1000 Mastered</span>
        </button>
      </div>
    </header>
  );
};
