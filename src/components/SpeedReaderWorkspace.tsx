import React, { useState, useEffect, useRef } from 'react';
import { Eye, Play, Pause, RotateCcw, FastForward, BookOpen } from 'lucide-react';

interface SpeedReaderWorkspaceProps {
  onAwardXp: (amount: number) => void;
}

const SAMPLE_TEXT = `The human brain possesses roughly 86 billion neurons, each connected to thousands of synaptic junctions. When information is learned through deliberate practice and retrieval testing, structural dendritic spine enlargement occurs. This process, termed Long-Term Potentiation, transforms transient electrical patterns into stable synaptic architectures. However, passive re-reading provides an illusion of competence without stimulating the biochemical cascade required for durable neuroplasticity. To achieve genuine intellectual mastery, the student must strain to retrieve ideas from memory, deconstruct jargon into first-principles analogies, and interleave distinct problem types.`;

export const SpeedReaderWorkspace: React.FC<SpeedReaderWorkspaceProps> = ({
  onAwardXp,
}) => {
  const [text, setText] = useState<string>(SAMPLE_TEXT);
  const [wpm, setWpm] = useState<number>(350);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);

  const words = React.useMemo(() => {
    return text.trim().split(/\s+/).filter(Boolean);
  }, [text]);

  const currentWord = words[currentIndex] || '';

  // Optimal Recognition Point (ORP): usually at ~30% of word length
  const orpIndex = Math.max(0, Math.floor(currentWord.length * 0.35));
  const beforeOrp = currentWord.slice(0, orpIndex);
  const orpChar = currentWord.charAt(orpIndex);
  const afterOrp = currentWord.slice(orpIndex + 1);

  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying) {
      const delayMs = (60 / wpm) * 1000;
      interval = window.setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= words.length - 1) {
            setIsPlaying(false);
            onAwardXp(30);
            return 0;
          }
          return prev + 1;
        });
      }, delayMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, wpm, words.length]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <Eye className="h-4 w-4" />
            <span>Rapid Serial Visual Presentation (RSVP) Engine</span>
            <span aria-hidden="true">·</span>
            <span>Saccadic Fixation Optimization</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            Speed Reading & RSVP Trainer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Eliminate vocal subvocalization and unnecessary eye saccades with centered Optimal Recognition Point (ORP) flashing.
          </p>
        </div>

        <button
          onClick={() => setIsEditingText(!isEditingText)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
        >
          {isEditingText ? 'Hide Text Input' : 'Paste Custom Reading Material'}
        </button>
      </div>

      {isEditingText && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">
            Target Academic Article or Chapter Excerpt
          </label>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setCurrentIndex(0);
              setIsPlaying(false);
            }}
            rows={5}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-sans leading-relaxed"
          />
        </div>
      )}

      {/* Main Flash Stage */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Fixation Marker Guides (Top and Bottom notches) */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-1.5 h-3 bg-amber-400/80 rounded-full mb-1" />
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
            Optical Fixation Center (ORP)
          </div>
        </div>

        {/* Word Display with highlighted ORP letter */}
        <div className="min-h-[100px] flex items-center justify-center select-none">
          <div className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-normal">
            <span className="text-slate-100">{beforeOrp}</span>
            <span className="text-amber-400 underline decoration-amber-400/40 decoration-4 underline-offset-8">
              {orpChar}
            </span>
            <span className="text-slate-100">{afterOrp}</span>
          </div>
        </div>

        {/* Bottom fixation notch */}
        <div className="w-1.5 h-3 bg-amber-400/80 rounded-full mt-6" />

        {/* Progress bar */}
        <div className="w-full max-w-md mt-8 space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400 font-mono-tabular">
            <span>Progress: Word {currentIndex + 1} of {words.length}</span>
            <span>{Math.round(((currentIndex + 1) / (words.length || 1)) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-100"
              style={{ width: `${((currentIndex + 1) / (words.length || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Primary RSVP Controls */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentIndex(0)}
            className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-400 hover:text-slate-200 cursor-pointer"
            title="Restart from beginning"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 rounded-xl bg-amber-400 px-8 py-3 text-sm font-bold text-slate-950 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/10 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Start RSVP Flash</span>
              </>
            )}
          </button>

          {/* Speed Slider */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
            <FastForward className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="font-mono-tabular text-xs font-bold text-slate-200 w-16 text-right">
              {wpm} WPM
            </span>
            <input
              type="range"
              min="150"
              max="900"
              step="25"
              value={wpm}
              onChange={(e) => setWpm(parseInt(e.target.value))}
              className="w-24 sm:w-32 accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
