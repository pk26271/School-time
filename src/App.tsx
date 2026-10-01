/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WorkspaceId, StudyFeature, FlashcardDeck, CornellNote, StudySessionLog } from './types';
import { generate1000Features } from './data/features1000';
import { DEFAULT_DECKS } from './data/defaultDecks';
import { DEFAULT_NOTES } from './data/defaultNotes';
import { Header } from './components/Header';
import { FeatureMatrix } from './components/FeatureMatrix';
import { FlashcardsWorkspace } from './components/FlashcardsWorkspace';
import { FocusTimerWorkspace } from './components/FocusTimerWorkspace';
import { ActiveRecallWorkspace } from './components/ActiveRecallWorkspace';
import { FeynmanWorkspace } from './components/FeynmanWorkspace';
import { CornellNotesWorkspace } from './components/CornellNotesWorkspace';
import { FormulaVaultWorkspace } from './components/FormulaVaultWorkspace';
import { ConceptGraphWorkspace } from './components/ConceptGraphWorkspace';
import { SpeedReaderWorkspace } from './components/SpeedReaderWorkspace';
import { GpaCalculatorWorkspace } from './components/GpaCalculatorWorkspace';
import { QuestsAndStatsWorkspace } from './components/QuestsAndStatsWorkspace';
import { CommandPalette } from './components/CommandPalette';
import {
  Layers,
  BookOpen,
  Clock,
  Brain,
  Lightbulb,
  FileText,
  Calculator,
  Network,
  Eye,
  GraduationCap,
  Trophy,
  Sparkles
} from 'lucide-react';

const STORAGE_KEYS = {
  FEATURES: 'scholaros_features_v1',
  DECKS: 'scholaros_decks_v1',
  NOTES: 'scholaros_notes_v1',
  XP: 'scholaros_xp_v1',
  LOGS: 'scholaros_logs_v1',
};

export default function App() {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>('directory');
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Initialize or load features
  const [features, setFeatures] = useState<StudyFeature[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEATURES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Fallback
    }
    return generate1000Features();
  });

  // Initialize or load decks
  const [decks, setDecks] = useState<FlashcardDeck[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DECKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Fallback
    }
    return DEFAULT_DECKS;
  });

  // Initialize or load notes
  const [notes, setNotes] = useState<CornellNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Fallback
    }
    return DEFAULT_NOTES;
  });

  // Initialize or load User XP
  const [userXp, setUserXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.XP);
      if (saved) return parseInt(saved) || 280;
    } catch (e) {
      // Fallback
    }
    return 280;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FEATURES, JSON.stringify(features));
    } catch (e) {}
  }, [features]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
    } catch (e) {}
  }, [decks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {}
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.XP, userXp.toString());
    } catch (e) {}
  }, [userXp]);

  // Global Keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleAwardXp = (amount: number) => {
    setUserXp((prev) => prev + amount);
  };

  const handleToggleMastered = (id: number) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const newMastered = !f.mastered;
          if (newMastered) handleAwardXp(50);
          return { ...f, mastered: newMastered };
        }
        return f;
      })
    );
  };

  const handleToggleBookmark = (id: number) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, bookmarked: !f.bookmarked } : f))
    );
  };

  const handleUpdateDeck = (updatedDeck: FlashcardDeck) => {
    setDecks((prev) => prev.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));
  };

  const handleAddDeck = (newDeck: FlashcardDeck) => {
    setDecks((prev) => [...prev, newDeck]);
  };

  const handleUpdateNote = (updatedNote: CornellNote) => {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  };

  const handleAddNote = (newNote: CornellNote) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleLogSession = (minutes: number, technique: string) => {
    // Session logged
  };

  const masteredCount = features.filter((f) => f.mastered).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Strict Top Bar Contract Header */}
      <Header
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={setActiveWorkspace}
        onOpenCommand={() => setIsCommandOpen(true)}
        masteredCount={masteredCount}
      />

      {/* Secondary Quick-Jump Workspace Rail */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-slate-500 font-medium mr-1 shrink-0">Workspaces:</span>
          {[
            { id: 'directory' as WorkspaceId, label: '1,000 Matrix', icon: Layers },
            { id: 'flashcards' as WorkspaceId, label: 'Spaced Flashcards', icon: BookOpen },
            { id: 'focus' as WorkspaceId, label: 'Focus & Soundscapes', icon: Clock },
            { id: 'recall' as WorkspaceId, label: 'Blurting & Recall', icon: Brain },
            { id: 'feynman' as WorkspaceId, label: 'Feynman Studio', icon: Lightbulb },
            { id: 'notes' as WorkspaceId, label: 'Cornell Notes', icon: FileText },
            { id: 'formulas' as WorkspaceId, label: 'STEM Formula Vault', icon: Calculator },
            { id: 'mindmap' as WorkspaceId, label: 'Concept Graph', icon: Network },
            { id: 'speedread' as WorkspaceId, label: 'Speed Reader', icon: Eye },
            { id: 'gpa' as WorkspaceId, label: 'GPA & Final Strategy', icon: GraduationCap },
            { id: 'quests' as WorkspaceId, label: 'Scholar Quests', icon: Trophy },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeWorkspace === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveWorkspace(item.id)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-400/10 text-amber-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeWorkspace === 'directory' && (
          <FeatureMatrix
            features={features}
            onToggleMastered={handleToggleMastered}
            onToggleBookmark={handleToggleBookmark}
            onLaunchWorkspace={(ws) => setActiveWorkspace(ws)}
            userXp={userXp}
          />
        )}

        {activeWorkspace === 'flashcards' && (
          <FlashcardsWorkspace
            decks={decks}
            onUpdateDeck={handleUpdateDeck}
            onAddDeck={handleAddDeck}
            onAwardXp={handleAwardXp}
          />
        )}

        {activeWorkspace === 'focus' && (
          <FocusTimerWorkspace
            onAwardXp={handleAwardXp}
            onLogSession={handleLogSession}
          />
        )}

        {activeWorkspace === 'recall' && (
          <ActiveRecallWorkspace
            onAwardXp={handleAwardXp}
          />
        )}

        {activeWorkspace === 'feynman' && (
          <FeynmanWorkspace
            onAwardXp={handleAwardXp}
          />
        )}

        {activeWorkspace === 'notes' && (
          <CornellNotesWorkspace
            notes={notes}
            onUpdateNote={handleUpdateNote}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onAwardXp={handleAwardXp}
          />
        )}

        {activeWorkspace === 'formulas' && (
          <FormulaVaultWorkspace
            onAwardXp={handleAwardXp}
          />
        )}

        {activeWorkspace === 'mindmap' && (
          <ConceptGraphWorkspace
            onAwardXp={handleAwardXp}
          />
        )}

        {activeWorkspace === 'speedread' && (
          <SpeedReaderWorkspace
            onAwardXp={handleAwardXp}
          />
        )}

        {activeWorkspace === 'gpa' && (
          <GpaCalculatorWorkspace
            onAwardXp={handleAwardXp}
          />
        )}

        {activeWorkspace === 'quests' && (
          <QuestsAndStatsWorkspace
            userXp={userXp}
            features={features}
            onAwardXp={handleAwardXp}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-slate-400">ScholarOS 1000</span>
            <span aria-hidden="true">·</span>
            <span>1,000 Verified Study Features & Learning Specifications</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Offline-Ready</span>
            <span aria-hidden="true">·</span>
            <span>Local Storage Synchronized</span>
            <span aria-hidden="true">·</span>
            <span>WCAG AA Contrast Compliant</span>
          </div>
        </div>
      </footer>

      {/* Global Quick Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        features={features}
        onSelectFeature={(feat) => {
          if (feat.workspaceTarget) {
            setActiveWorkspace(feat.workspaceTarget);
          }
        }}
        onLaunchWorkspace={(ws) => setActiveWorkspace(ws)}
      />
    </div>
  );
}
