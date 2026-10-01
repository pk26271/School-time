import React, { useState } from 'react';
import {
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Save,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface FeynmanWorkspaceProps {
  onAwardXp: (amount: number) => void;
}

const COMMON_JARGON_LIST = [
  'thermodynamic', 'electrochemical', 'hyperpolarize', 'depolarization',
  'concomitant', 'ubiquitous', 'postulate', 'paradigm', 'heuristic',
  'stochastic', 'epistemic', 'isomorphic', 'orthogonal', 'asymptotic',
  'quantum', 'relativity', 'entropy', 'equilibrium', 'allosteric',
  'catalytic', 'stoichiometry', 'mitochondrial', 'endogenous', 'exogenous'
];

export const FeynmanWorkspace: React.FC<FeynmanWorkspaceProps> = ({
  onAwardXp,
}) => {
  const [conceptTitle, setConceptTitle] = useState('Quantum Tunneling');
  const [targetAudience, setTargetAudience] = useState('A 10-year-old middle school student');
  const [explanation, setExplanation] = useState(
    'Imagine you are kicking a soccer ball toward a high brick wall. In normal everyday life, if you kick it gently, the ball always bounces straight back. But in the tiny quantum world of atoms, particles act like fuzzy waves instead of solid marbles. Because the particle is like a spread-out cloud of chances, there is a tiny probability that the cloud actually reaches through to the other side of the wall. Suddenly, the particle pops out on the other side without ever having to climb over the top!'
  );
  const [gapsIdentified, setGapsIdentified] = useState(
    'I need to make sure I clarify that the particle does not smash a physical hole in the barrier, and explain why tennis balls cannot do this.'
  );
  const [analogy, setAnalogy] = useState(
    'A ghost passing through a castle wall, or sound waves from a stereo in the living room penetrating through a solid wooden bedroom door.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compute detected jargon words
  const detectedJargon = React.useMemo(() => {
    const words = explanation.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    return Array.from(new Set(words.filter((w) => COMMON_JARGON_LIST.includes(w))));
  }, [explanation]);

  // Simplicity calculation
  const wordCount = explanation.trim().split(/\s+/).filter(Boolean).length;
  const avgWordLength = wordCount > 0 ? (explanation.replace(/\s+/g, '').length / wordCount).toFixed(1) : '0';
  const simplicityRating = Number(avgWordLength) < 5.0 && detectedJargon.length === 0 ? 'High' : Number(avgWordLength) < 5.6 ? 'Moderate' : 'Dense';

  const handleSave = () => {
    setSavedSuccess(true);
    onAwardXp(40);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <Lightbulb className="h-4 w-4" />
            <span>Feynman Technique & Conceptual Simplification Studio</span>
            <span aria-hidden="true">·</span>
            <span>4-Stage Cognitive Deconstruction</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            The Feynman Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            "If you cannot explain it to a six-year-old, you don't understand it yourself." — Richard Feynman
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save to Concept Vault (+40 XP)</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>Feynman Deconstruction safely consolidated into your permanent knowledge vault!</span>
        </div>
      )}

      {/* 4 Steps Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: The 4 Steps */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Select Concept */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Stage 01: Concept Selection
              </span>
              <span className="text-xs text-slate-500">Pick the topic you find most intimidating</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Concept Name</label>
                <input
                  type="text"
                  value={conceptTitle}
                  onChange={(e) => setConceptTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Target Listener Persona</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Teach it to a child (The Plain English Arena) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Stage 02: Teach in Plain Everyday English
              </span>
              <span className="text-xs text-slate-400">Zero academic jargon permitted</span>
            </div>

            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={6}
              placeholder="Explain the mechanism using only simple words, concrete physical verbs, and sensory descriptions..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none leading-relaxed"
            />

            {/* Jargon Warning Pill */}
            {detectedJargon.length > 0 && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200">
                <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Academic Jargon Detected:</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  You used: <strong className="text-amber-300">{detectedJargon.join(', ')}</strong>. Try explaining these words using physical actions rather than technical labels.
                </p>
              </div>
            )}
          </div>

          {/* Step 3: Identify Gaps */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Stage 03: Pinpoint Knowledge Gaps & Questions
              </span>
              <span className="text-xs text-slate-400">Where did your explanation stutter?</span>
            </div>

            <textarea
              value={gapsIdentified}
              onChange={(e) => setGapsIdentified(e.target.value)}
              rows={3}
              placeholder="What questions would a sharp 10-year-old ask that you cannot immediately answer? Return to the textbook for these specific mechanics..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Step 4: Analogy & Metaphor Forge */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Stage 04: The Analogy & Metaphor Forge
              </span>
              <span className="text-xs text-slate-400">Connect to an everyday physical intuition</span>
            </div>

            <textarea
              value={analogy}
              onChange={(e) => setAnalogy(e.target.value)}
              rows={3}
              placeholder="Create an analogy comparing this concept to a kitchen recipe, water flowing in pipes, traffic jams, or sports..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Right Column: Simplicity Diagnostics & Guidelines */}
        <div className="lg:col-span-4 space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Explanation Diagnostics
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800">
                <span className="text-slate-400">Word Count</span>
                <span className="font-mono-tabular font-bold text-slate-200">{wordCount} words</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800">
                <span className="text-slate-400">Average Word Length</span>
                <span className="font-mono-tabular font-bold text-slate-200">{avgWordLength} chars</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800">
                <span className="text-slate-400">Jargon Flags</span>
                <span className={`font-mono-tabular font-bold ${detectedJargon.length === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {detectedJargon.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-2">
                <span className="text-slate-400">Simplicity Rating</span>
                <span className={`font-semibold ${simplicityRating === 'High' ? 'text-emerald-400' : simplicityRating === 'Moderate' ? 'text-amber-400' : 'text-rose-400'}`}>
                  {simplicityRating} Clarity
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/80 p-3.5 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-amber-300">The 3 Feynman Rules:</div>
              <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-300">
                <li>Never use a multi-syllabic noun when a simple verb will do.</li>
                <li>If you get stuck on a transition, that is your genuine knowledge gap—not just phrasing.</li>
                <li>Anchor the entire mechanism to a tangible, physical metaphor.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
