import React, { useState, useEffect } from 'react';
import {
  Brain,
  Timer,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface ActiveRecallWorkspaceProps {
  onAwardXp: (amount: number) => void;
}

interface BlurtPreset {
  id: string;
  title: string;
  domain: string;
  coreConcepts: string[];
  summaryReference: string;
}

const BLURT_PRESETS: BlurtPreset[] = [
  {
    id: 'blurt-etc',
    title: 'Mitochondrial Electron Transport Chain (ETC)',
    domain: 'Biochemistry / Cellular Biology',
    coreConcepts: [
      'Complex I (NADH Dehydrogenase)',
      'Complex II (Succinate Dehydrogenase)',
      'Coenzyme Q (Ubiquinone)',
      'Complex III (Cytochrome bc1)',
      'Cytochrome c',
      'Complex IV (Cytochrome c oxidase)',
      'Proton Gradient (Intermembrane Space)',
      'ATP Synthase (F0-F1 motor)',
      'Oxygen as final electron acceptor',
      'Chemiosmosis (Peter Mitchell)'
    ],
    summaryReference: 'Electrons from NADH and FADH2 pass sequentially through Complexes I-IV, pumping protons from matrix into the intermembrane space to create an electrochemical proton-motive force. Protons re-enter the matrix via ATP Synthase to drive phosphorylation of ADP to ATP, with molecular oxygen serving as the terminal electron acceptor reducing to water.'
  },
  {
    id: 'blurt-clt',
    title: 'Central Limit Theorem & Statistical Sampling',
    domain: 'Statistics & Probability',
    coreConcepts: [
      'Sample mean distribution',
      'Independent and identically distributed (i.i.d.)',
      'Normal Gaussian distribution',
      'Sample size n >= 30 heuristic',
      'Standard error (sigma / sqrt(n))',
      'Finite variance requirement',
      'Population shape independence',
      'Law of Large Numbers distinction'
    ],
    summaryReference: 'The Central Limit Theorem establishes that when independent random variables with finite variance are summed, their normalized sum tends toward a normal distribution, even if original variables are non-normal, provided sample size is sufficiently large.'
  },
  {
    id: 'blurt-photosynthesis',
    title: 'Photosynthesis: Light Reactions & Calvin Cycle',
    domain: 'Plant Biology',
    coreConcepts: [
      'Thylakoid membrane',
      'Photosystem II (P680)',
      'Photolysis of water (O2 release)',
      'Plastoquinone and Cytochrome b6f',
      'Photosystem I (P700)',
      'Ferredoxin & NADPH formation',
      'Stroma of chloroplast',
      'RuBisCO enzyme',
      'Carbon fixation (3-PGA)',
      'G3P triose phosphate generation'
    ],
    summaryReference: 'Light reactions in thylakoid membranes capture photons to drive photolysis of water, creating ATP and NADPH. These energy carriers enter the stroma to power the Calvin Cycle, where RuBisCO fixes CO2 into 3-PGA to synthesize glyceraldehyde-3-phosphate sugars.'
  }
];

export const ActiveRecallWorkspace: React.FC<ActiveRecallWorkspaceProps> = ({
  onAwardXp,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<BlurtPreset>(BLURT_PRESETS[0]);
  const [blurtText, setBlurtText] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(300); // 5 min
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [retrievedConcepts, setRetrievedConcepts] = useState<string[]>([]);
  const [missedConcepts, setMissedConcepts] = useState<string[]>([]);

  // Timer Tick
  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const handleEvaluate = () => {
    setIsTimerRunning(false);
    setIsEvaluated(true);

    const userLower = blurtText.toLowerCase();
    const retrieved: string[] = [];
    const missed: string[] = [];

    selectedPreset.coreConcepts.forEach((concept) => {
      // Check keywords of concept
      const keywords = concept.toLowerCase().split(/[\s()/,-]+/).filter((w) => w.length > 3);
      const isPresent = keywords.some((kw) => userLower.includes(kw));

      if (isPresent) {
        retrieved.push(concept);
      } else {
        missed.push(concept);
      }
    });

    setRetrievedConcepts(retrieved);
    setMissedConcepts(missed);

    const scoreRatio = retrieved.length / selectedPreset.coreConcepts.length;
    const earnedXp = Math.round(scoreRatio * 100) + 20;
    onAwardXp(earnedXp);
  };

  const handleReset = () => {
    setBlurtText('');
    setTimerSeconds(300);
    setIsTimerRunning(false);
    setIsEvaluated(false);
    setRetrievedConcepts([]);
    setMissedConcepts([]);
  };

  const formatTimer = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const coveragePercent = selectedPreset.coreConcepts.length
    ? Math.round((retrievedConcepts.length / selectedPreset.coreConcepts.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <Brain className="h-4 w-4" />
            <span>Active Recall & The Blurting Method Arena</span>
            <span aria-hidden="true">·</span>
            <span>Retrieval Testing Effect</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            The Blurting Method & Gap Auditor
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test true long-term retrieval by dumping unassisted recall, then run algorithmic gap detection against reference models.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Target Topic:</label>
          <select
            value={selectedPreset.id}
            onChange={(e) => {
              const found = BLURT_PRESETS.find((p) => p.id === e.target.value);
              if (found) {
                setSelectedPreset(found);
                handleReset();
              }
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {BLURT_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: The Recall Stage */}
        <div className="lg:col-span-8 space-y-4">
          {/* Blurting Canvas Controls */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">
                {selectedPreset.title}
              </span>
              <span className="text-slate-500 text-xs">({selectedPreset.domain})</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-mono-tabular text-sm font-bold text-amber-400">
                <Timer className="h-4 w-4" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>

              {!isTimerRunning && !isEvaluated && (
                <button
                  onClick={() => setIsTimerRunning(true)}
                  className="px-3 py-1 text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-lg cursor-pointer"
                >
                  Start Timer
                </button>
              )}
            </div>
          </div>

          {/* Typing Area */}
          <div className="relative">
            <textarea
              value={blurtText}
              onChange={(e) => {
                setBlurtText(e.target.value);
                if (!isTimerRunning && !isEvaluated) setIsTimerRunning(true);
              }}
              disabled={isEvaluated}
              rows={12}
              placeholder="Close your notes. Write down every single equation, mechanism, enzyme, step, and relationship you can remember from pure memory..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 p-5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 leading-relaxed font-sans"
            />

            <div className="absolute right-4 bottom-4 text-xs text-slate-500 font-mono-tabular">
              {blurtText.trim().split(/\s+/).filter(Boolean).length} words recalled
            </div>
          </div>

          {/* Evaluation Trigger Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-2 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear & Start Over</span>
            </button>

            {!isEvaluated ? (
              <button
                onClick={handleEvaluate}
                disabled={!blurtText.trim()}
                className="flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-40 transition-colors shadow-md cursor-pointer"
              >
                <span>Analyze Recall & Reveal Gaps</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Recall Analysis Complete!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Key Concepts & Knowledge Gap Analysis */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Concept Gap Detector
              </h3>
              {isEvaluated && (
                <span className="font-mono-tabular text-xs font-bold text-amber-400">
                  {coveragePercent}% Yield
                </span>
              )}
            </div>

            {!isEvaluated ? (
              <div className="text-xs text-slate-400 space-y-3">
                <p>
                  Target syllabus requires active retrieval of <strong>{selectedPreset.coreConcepts.length}</strong> foundational mechanisms.
                </p>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-400">
                  <span className="font-medium text-amber-300 block mb-1">Testing Protocol:</span>
                  Do not look at the concept list during recall. When you hit a mental wall, wait 30 seconds before submitting. Straining to retrieve is what activates synaptic remodeling.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Retrieved Items */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Successfully Retrieved ({retrievedConcepts.length})</span>
                  </div>
                  <div className="space-y-1">
                    {retrievedConcepts.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-emerald-200 bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg"
                      >
                        {item}
                      </div>
                    ))}
                    {retrievedConcepts.length === 0 && (
                      <span className="text-xs text-slate-500 italic">None detected</span>
                    )}
                  </div>
                </div>

                {/* Missed Gaps */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400 mb-2">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Knowledge Gaps to Review ({missedConcepts.length})</span>
                  </div>
                  <div className="space-y-1">
                    {missedConcepts.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-amber-200 bg-amber-950/20 border border-amber-500/20 px-2.5 py-1.5 rounded-lg"
                      >
                        {item}
                      </div>
                    ))}
                    {missedConcepts.length === 0 && (
                      <span className="text-xs text-emerald-400 italic">100% Perfect Recall!</span>
                    )}
                  </div>
                </div>

                {/* Reference Summary */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                    <span>Reference Master Model:</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    {selectedPreset.summaryReference}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
