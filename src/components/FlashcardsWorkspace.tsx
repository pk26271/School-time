import React, { useState } from 'react';
import { FlashcardDeck, Flashcard } from '../types';
import {
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Plus,
  Shuffle,
  Download,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';

interface FlashcardsWorkspaceProps {
  decks: FlashcardDeck[];
  onUpdateDeck: (updatedDeck: FlashcardDeck) => void;
  onAddDeck: (newDeck: FlashcardDeck) => void;
  onAwardXp: (amount: number) => void;
}

export const FlashcardsWorkspace: React.FC<FlashcardsWorkspaceProps> = ({
  decks,
  onUpdateDeck,
  onAddDeck,
  onAwardXp,
}) => {
  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks[0]?.id || '');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newHint, setNewHint] = useState('');

  const currentDeck = decks.find((d) => d.id === selectedDeckId) || decks[0];
  const cards = currentDeck?.cards || [];
  const currentCard = cards[currentCardIndex] as Flashcard | undefined;

  // Deck metrics
  const boxCounts = [1, 2, 3, 4, 5].map((b) => cards.filter((c) => c.box === b).length);

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentCardIndex((prev) => (prev + 1) % (cards.length || 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % (cards.length || 1));
  };

  // SM-2 Review Action
  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard || !currentDeck) return;

    let newInterval = currentCard.interval;
    let newEase = currentCard.easeFactor;
    let newBox = currentCard.box;
    let newReps = currentCard.repetitions + 1;
    let xpGain = 10;

    if (rating === 'again') {
      newInterval = 1;
      newEase = Math.max(1.3, newEase - 0.2);
      newBox = 1;
      xpGain = 5;
    } else if (rating === 'hard') {
      newInterval = Math.max(1, Math.round(newInterval * 1.2));
      newEase = Math.max(1.3, newEase - 0.15);
      newBox = Math.max(1, newBox);
      xpGain = 15;
    } else if (rating === 'good') {
      newInterval = Math.max(2, Math.round(newInterval * newEase));
      newBox = Math.min(5, newBox + 1);
      xpGain = 25;
    } else if (rating === 'easy') {
      newInterval = Math.max(4, Math.round(newInterval * newEase * 1.3));
      newEase = Math.min(3.0, newEase + 0.15);
      newBox = Math.min(5, newBox + 1);
      xpGain = 35;
    }

    const updatedCard: Flashcard = {
      ...currentCard,
      repetitions: newReps,
      interval: newInterval,
      easeFactor: Number(newEase.toFixed(2)),
      box: newBox,
      nextReviewDate: new Date(Date.now() + newInterval * 86400000).toISOString(),
    };

    const updatedCards = cards.map((c) => (c.id === currentCard.id ? updatedCard : c));
    onUpdateDeck({ ...currentDeck, cards: updatedCards });
    onAwardXp(xpGain);
    handleNext();
  };

  const handleShuffle = () => {
    if (!currentDeck) return;
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    onUpdateDeck({ ...currentDeck, cards: shuffled });
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleExportAnkiTsv = () => {
    if (!currentDeck) return;
    const tsvContent = currentDeck.cards
      .map((c) => `${c.front.replace(/\t|\n/g, ' ')}\t${c.back.replace(/\t|\n/g, ' ')}`)
      .join('\n');

    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentDeck.title.toLowerCase().replace(/\s+/g, '_')}_anki.tsv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim() || !currentDeck) return;

    const newCard: Flashcard = {
      id: `card-${Date.now()}`,
      deckId: currentDeck.id,
      front: newFront.trim(),
      back: newBack.trim(),
      hint: newHint.trim() || undefined,
      repetitions: 0,
      interval: 1,
      easeFactor: 2.5,
      box: 1,
      nextReviewDate: new Date().toISOString(),
    };

    onUpdateDeck({
      ...currentDeck,
      cards: [...currentDeck.cards, newCard],
    });

    setNewFront('');
    setNewBack('');
    setNewHint('');
    setShowAddCardModal(false);
    onAwardXp(20);
  };

  return (
    <div className="space-y-6">
      {/* Deck Selector & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <Flame className="h-4 w-4" />
            <span>SuperMemo SM-2 & Leitner Box Engine</span>
            <span aria-hidden="true">·</span>
            <span>Spaced Repetition Algorithm</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            {currentDeck?.title || 'Flashcards'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentDeck?.description}
          </p>
        </div>

        {/* Deck Dropdown & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedDeckId}
            onChange={(e) => {
              setSelectedDeckId(e.target.value);
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.title} ({deck.cards.length} cards)
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddCardModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Card</span>
          </button>

          <button
            onClick={handleShuffle}
            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Shuffle deck"
          >
            <Shuffle className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleExportAnkiTsv}
            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Export to Anki TSV"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Leitner Box Progress Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((boxNum) => {
          const count = boxCounts[boxNum - 1];
          const isCurrentBox = currentCard?.box === boxNum;
          return (
            <div
              key={boxNum}
              className={`rounded-xl border p-3 text-center transition-all ${
                isCurrentBox
                  ? 'border-amber-400/80 bg-amber-950/20 ring-1 ring-amber-400/30'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="text-[11px] text-slate-400 font-medium">Box {boxNum}</div>
              <div className="font-mono-tabular text-lg font-bold text-slate-100 my-0.5">
                {count}
              </div>
              <div className="text-[10px] text-slate-500">
                {boxNum === 1 ? '1 Day' : boxNum === 2 ? '3 Days' : boxNum === 3 ? '1 Wk' : boxNum === 4 ? '2 Wks' : 'Mastered'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Flashcard Interactive Stage */}
      {cards.length > 0 && currentCard ? (
        <div className="flex flex-col items-center">
          {/* Card Meta Indicator */}
          <div className="w-full max-w-2xl flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
            <span className="font-mono-tabular">
              Card {currentCardIndex + 1} of {cards.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono-tabular">Interval: {currentCard.interval}d</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">Ease: {currentCard.easeFactor}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-medium">Box {currentCard.box}</span>
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-2xl min-h-[300px] md:min-h-[360px] rounded-2xl border border-slate-700/80 bg-slate-900/90 p-8 flex flex-col justify-between shadow-xl cursor-pointer hover:border-slate-600 transition-all select-none relative group"
          >
            {/* Top Prompt Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {isFlipped ? 'Answer / Solution' : 'Question / Cue'}
              </span>
              <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors flex items-center gap-1">
                <RotateCcw className="h-3 w-3" /> Click card to flip
              </span>
            </div>

            {/* Main Content Area */}
            <div className="my-auto py-6">
              {!isFlipped ? (
                <div className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed text-center">
                  {currentCard.front}
                </div>
              ) : (
                <div className="text-sm md:text-base text-slate-200 leading-relaxed whitespace-pre-line">
                  {currentCard.back}
                </div>
              )}
            </div>

            {/* Hint Drawer */}
            <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
              {currentCard.hint ? (
                <div>
                  {showHint ? (
                    <div className="text-xs text-amber-300 italic flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{currentCard.hint}</span>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint(true);
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>Reveal Hint</span>
                    </button>
                  )}
                </div>
              ) : (
                <div />
              )}
              <span className="text-xs text-slate-500 font-mono-tabular">
                Repetitions: {currentCard.repetitions}
              </span>
            </div>
          </div>

          {/* SM-2 Rating Controls */}
          {isFlipped ? (
            <div className="w-full max-w-2xl mt-5 grid grid-cols-4 gap-2 sm:gap-3">
              <button
                onClick={() => handleRate('again')}
                className="rounded-xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 p-3 text-center transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold text-rose-300">Again</div>
                <div className="text-[11px] text-slate-400">&lt; 1 min</div>
              </button>
              <button
                onClick={() => handleRate('hard')}
                className="rounded-xl border border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/40 p-3 text-center transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold text-amber-300">Hard</div>
                <div className="text-[11px] text-slate-400">{Math.max(1, Math.round(currentCard.interval * 1.2))}d</div>
              </button>
              <button
                onClick={() => handleRate('good')}
                className="rounded-xl border border-sky-500/30 bg-sky-950/20 hover:bg-sky-950/40 p-3 text-center transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold text-sky-300">Good</div>
                <div className="text-[11px] text-slate-400">{Math.max(2, Math.round(currentCard.interval * currentCard.easeFactor))}d</div>
              </button>
              <button
                onClick={() => handleRate('easy')}
                className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 p-3 text-center transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold text-emerald-300">Easy</div>
                <div className="text-[11px] text-slate-400">{Math.max(4, Math.round(currentCard.interval * currentCard.easeFactor * 1.3))}d</div>
              </button>
            </div>
          ) : (
            <div className="w-full max-w-2xl mt-5 flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Previous Card
              </button>
              <button
                onClick={() => setIsFlipped(true)}
                className="rounded-lg bg-amber-400 px-6 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 cursor-pointer"
              >
                Show Answer (Space)
              </button>
              <button
                onClick={handleNext}
                className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Skip Card
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl">
          <BookOpen className="h-10 w-10 text-slate-500 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-300">Deck is currently empty</h4>
          <p className="text-xs text-slate-500 mt-1">Add your first card to begin active recall.</p>
          <button
            onClick={() => setShowAddCardModal(true)}
            className="mt-4 px-4 py-2 text-xs font-medium bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 cursor-pointer"
          >
            Add New Flashcard
          </button>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-white mb-4">
              Add Card to {currentDeck?.title}
            </h3>
            <form onSubmit={handleCreateCard} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Front (Prompt / Question / Term)
                </label>
                <textarea
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="e.g. What is the rate-limiting enzyme of glycolysis?"
                  rows={2}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Back (Answer / Explanation / Formula)
                </label>
                <textarea
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="e.g. Phosphofructokinase-1 (PFK-1), which converts Fructose-6-phosphate to Fructose-1,6-bisphosphate."
                  rows={4}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Hint (Optional Scaffolding)
                </label>
                <input
                  type="text"
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                  placeholder="e.g. Allosterically inhibited by ATP and Citrate"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 cursor-pointer"
                >
                  Save Flashcard (+20 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
