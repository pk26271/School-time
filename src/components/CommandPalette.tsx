import React, { useState, useEffect } from 'react';
import { StudyFeature, WorkspaceId } from '../types';
import { Search, X, ExternalLink, Zap, BookOpen, Layers } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  features: StudyFeature[];
  onSelectFeature: (feature: StudyFeature) => void;
  onLaunchWorkspace: (workspace: WorkspaceId) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  features,
  onSelectFeature,
  onLaunchWorkspace,
}) => {
  const [query, setQuery] = useState('');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matches = query.trim()
    ? features
        .filter((f) => {
          const q = query.toLowerCase();
          return (
            f.name.toLowerCase().includes(q) ||
            f.code.toLowerCase().includes(q) ||
            f.category.toLowerCase().includes(q) ||
            f.discipline.toLowerCase().includes(q)
          );
        })
        .slice(0, 10)
    : features.slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-16 sm:pt-24 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="h-4 w-4 text-amber-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            placeholder="Type to find any of the 1,000 features or workspaces..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Nav Workspaces */}
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-medium">Jumps:</span>
          <button
            onClick={() => { onLaunchWorkspace('flashcards'); onClose(); }}
            className="text-slate-300 hover:text-amber-400 cursor-pointer whitespace-nowrap"
          >
            Flashcards
          </button>
          <span className="text-slate-700">/</span>
          <button
            onClick={() => { onLaunchWorkspace('focus'); onClose(); }}
            className="text-slate-300 hover:text-amber-400 cursor-pointer whitespace-nowrap"
          >
            Focus Lab
          </button>
          <span className="text-slate-700">/</span>
          <button
            onClick={() => { onLaunchWorkspace('feynman'); onClose(); }}
            className="text-slate-300 hover:text-amber-400 cursor-pointer whitespace-nowrap"
          >
            Feynman Studio
          </button>
          <span className="text-slate-700">/</span>
          <button
            onClick={() => { onLaunchWorkspace('notes'); onClose(); }}
            className="text-slate-300 hover:text-amber-400 cursor-pointer whitespace-nowrap"
          >
            Cornell Notes
          </button>
          <span className="text-slate-700">/</span>
          <button
            onClick={() => { onLaunchWorkspace('formulas'); onClose(); }}
            className="text-slate-300 hover:text-amber-400 cursor-pointer whitespace-nowrap"
          >
            STEM Vault
          </button>
          <span className="text-slate-700">/</span>
          <button
            onClick={() => { onLaunchWorkspace('speedread'); onClose(); }}
            className="text-slate-300 hover:text-amber-400 cursor-pointer whitespace-nowrap"
          >
            Speed Reader
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1">
          {matches.map((feat) => (
            <div
              key={feat.id}
              onClick={() => {
                onSelectFeature(feat);
                if (feat.workspaceTarget) {
                  onLaunchWorkspace(feat.workspaceTarget);
                }
                onClose();
              }}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer group"
            >
              <div className="flex-1 pr-3">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                  <span className="font-mono text-amber-400 font-semibold">{feat.code}</span>
                  <span aria-hidden="true">·</span>
                  <span>{feat.category}</span>
                </div>
                <div className="text-xs font-semibold text-slate-100 group-hover:text-amber-300">
                  {feat.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {feat.description}
                </div>
              </div>

              {feat.workspaceTarget && (
                <div className="flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-lg shrink-0">
                  <span>Launch</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              )}
            </div>
          ))}

          {matches.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching study features found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>Search across all 1,000 indexed study techniques</span>
          <div className="flex items-center gap-2">
            <span>Press Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
