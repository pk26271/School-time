import React, { useState } from 'react';
import { CornellNote } from '../types';
import {
  BookOpen,
  Plus,
  Save,
  Download,
  Printer,
  Tag,
  Link2,
  Trash2,
  CheckCircle,
  FileText
} from 'lucide-react';

interface CornellNotesWorkspaceProps {
  notes: CornellNote[];
  onUpdateNote: (note: CornellNote) => void;
  onAddNote: (note: CornellNote) => void;
  onDeleteNote: (id: string) => void;
  onAwardXp: (amount: number) => void;
}

export const CornellNotesWorkspace: React.FC<CornellNotesWorkspaceProps> = ({
  notes,
  onUpdateNote,
  onAddNote,
  onDeleteNote,
  onAwardXp,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [savedAlert, setSavedAlert] = useState<boolean>(false);

  const currentNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  // Local draft states
  const [draftTitle, setDraftTitle] = useState(currentNote?.title || '');
  const [draftSubject, setDraftSubject] = useState(currentNote?.subject || '');
  const [draftCues, setDraftCues] = useState(currentNote?.cues?.join('\n') || '');
  const [draftNotes, setDraftNotes] = useState(currentNote?.notes || '');
  const [draftSummary, setDraftSummary] = useState(currentNote?.summary || '');

  // Synchronize when selected note changes
  React.useEffect(() => {
    if (currentNote) {
      setDraftTitle(currentNote.title);
      setDraftSubject(currentNote.subject);
      setDraftCues(currentNote.cues?.join('\n') || '');
      setDraftNotes(currentNote.notes || '');
      setDraftSummary(currentNote.summary || '');
    }
  }, [selectedNoteId]);

  const handleSave = () => {
    if (!currentNote) return;

    const cuesArray = draftCues
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    // Extract [[WikiLinks]]
    const linkMatches = draftNotes.match(/\[\[(.*?)\]\]/g) || [];
    const extractedLinks = linkMatches.map((m) => m.replace(/\[\[|\]\]/g, ''));

    const updated: CornellNote = {
      ...currentNote,
      title: draftTitle,
      subject: draftSubject,
      cues: cuesArray,
      notes: draftNotes,
      summary: draftSummary,
      links: extractedLinks,
      updatedAt: new Date().toISOString(),
    };

    onUpdateNote(updated);
    setSavedAlert(true);
    onAwardXp(30);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleCreateNewNote = () => {
    const newNote: CornellNote = {
      id: `note-${Date.now()}`,
      title: 'Untitled Cornell Note',
      subject: 'General Study',
      tags: ['New'],
      cues: [
        'What is the central thesis?',
        'What are the 3 supporting arguments?',
        'How does this apply to upcoming exams?'
      ],
      notes: '### Key Concepts & Arguments\n\n- Write detailed lecture observations here...\n- Link concepts using [[Zettelkasten Note Title]] syntax\n- Add supporting formulas and data points',
      summary: 'Concise 2-3 sentence synthesis consolidating the major ideas of this study session.',
      updatedAt: new Date().toISOString(),
      links: []
    };

    onAddNote(newNote);
    setSelectedNoteId(newNote.id);
  };

  const handleExportMarkdown = () => {
    if (!currentNote) return;

    const md = `# ${draftTitle}
**Subject:** ${draftSubject} | **Date:** ${new Date().toLocaleDateString()}

---

## 1. Cornell Cues & Questions
${draftCues.split('\n').filter(Boolean).map((q) => `- [ ] ${q}`).join('\n')}

---

## 2. Core Lecture & Reading Notes
${draftNotes}

---

## 3. Executive Synthesis & Summary
> ${draftSummary}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${draftTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_cornell.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <BookOpen className="h-4 w-4" />
            <span>Cornell 3-Zone Architecture & Zettelkasten Vault</span>
            <span aria-hidden="true">·</span>
            <span>Atomic Knowledge Graphs</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            Cornell Note Architect
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Divide your notes into Cues (Recall Prompts), Main Notes (Markdown), and Executive Summary.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCreateNewNote}
            className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Note</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Save className="h-3.5 w-3.5 text-amber-400" />
            <span>Save Note</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-slate-200 cursor-pointer"
            title="Export Markdown (.md)"
          >
            <Download className="h-4 w-4" />
          </button>

          <button
            onClick={() => window.print()}
            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-slate-200 cursor-pointer"
            title="Print Cornell Format"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </div>

      {savedAlert && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>Note changes successfully updated and saved in local storage!</span>
        </div>
      )}

      {/* Main 2-Column Split: Sidebar + Cornell Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar: Notes List */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            Vault Notes ({notes.length})
          </div>

          <div className="space-y-1.5">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                  selectedNoteId === note.id
                    ? 'bg-amber-400/10 border border-amber-400/30 text-white'
                    : 'border border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold truncate">{note.title}</div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                  <span>{note.subject}</span>
                  <span aria-hidden="true">·</span>
                  <span>{note.cues?.length || 0} Cues</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* The 3-Zone Cornell Sheet */}
        {currentNote && (
          <div className="lg:col-span-9 rounded-2xl border border-slate-700 bg-slate-900/90 shadow-xl overflow-hidden">
            {/* Top Bar of the Note: Title & Subject */}
            <div className="border-b border-slate-800 p-5 bg-slate-950/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full font-display text-lg font-bold text-white bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                  Subject / Discipline
                </label>
                <input
                  type="text"
                  value={draftSubject}
                  onChange={(e) => setDraftSubject(e.target.value)}
                  className="w-full text-xs font-medium text-amber-400 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                />
              </div>
            </div>

            {/* Middle Split: Zone 1 (Cue Column 30%) and Zone 2 (Notes Column 70%) */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
              {/* Zone 1: Cue Column */}
              <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-800 p-5 bg-slate-950/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Zone 1: Cues & Exam Questions
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Write prompt questions, terms, and test triggers (one per line). Cover the right side to test yourself!
                </p>
                <textarea
                  value={draftCues}
                  onChange={(e) => setDraftCues(e.target.value)}
                  rows={14}
                  placeholder="e.g. What is the rate-limiting step?&#10;What are the 2 major exceptions?&#10;Define the term..."
                  className="w-full bg-transparent text-xs text-amber-200/90 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed font-sans"
                />
              </div>

              {/* Zone 2: Main Notes Column */}
              <div className="md:col-span-8 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Zone 2: Lecture & Reading Notes (Markdown)
                  </span>
                  <span className="text-[10px] text-slate-500">Supports [[WikiLinks]]</span>
                </div>
                <textarea
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  rows={14}
                  placeholder="Write clear, organized bullet points, definitions, data, and citations..."
                  className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed font-sans"
                />
              </div>
            </div>

            {/* Bottom Split: Zone 3 (Summary Section) */}
            <div className="border-t border-slate-800 p-5 bg-slate-950/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Zone 3: Bottom Summary (2-3 Sentence Synthesis)
                </span>
                <span className="text-[10px] text-slate-500">Consolidate before ending study block</span>
              </div>
              <textarea
                value={draftSummary}
                onChange={(e) => setDraftSummary(e.target.value)}
                rows={3}
                placeholder="Distill the core essence of this entire note into 2-3 powerful sentences..."
                className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed font-sans"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
