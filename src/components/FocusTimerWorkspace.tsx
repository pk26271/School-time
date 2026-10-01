import React, { useState, useEffect, useRef } from 'react';
import { soundscapeEngine } from '../services/soundGenerator';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  Wind,
  ShieldAlert,
  Sparkles,
  Maximize2,
  Minimize2,
  Clock
} from 'lucide-react';

interface FocusTimerWorkspaceProps {
  onAwardXp: (amount: number) => void;
  onLogSession: (minutes: number, technique: string) => void;
}

type TimerMode = 'pomodoro' | 'fiftyTen' | 'ultradian' | 'flowmodoro';

export const FocusTimerWorkspace: React.FC<FocusTimerWorkspaceProps> = ({
  onAwardXp,
  onLogSession,
}) => {
  // Timer State
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [isFocusPhase, setIsFocusPhase] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [elapsedFlowSeconds, setElapsedFlowSeconds] = useState<number>(0);
  const [distractionCount, setDistractionCount] = useState<number>(0);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Soundscape track volumes (0 to 1)
  const [tracks, setTracks] = useState<{ [key: string]: number }>({
    pink: 0,
    brown: 0,
    white: 0,
    'binaural-alpha': 0,
    'binaural-theta': 0,
    rain: 0,
  });

  // Box breathing state
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [breathCount, setBreathCount] = useState<number>(4);

  // Interval references
  const timerRef = useRef<number | null>(null);
  const breathRef = useRef<number | null>(null);

  // Duration lookup by mode
  const getDurations = (m: TimerMode) => {
    if (m === 'pomodoro') return { focus: 25 * 60, break: 5 * 60 };
    if (m === 'fiftyTen') return { focus: 50 * 60, break: 10 * 60 };
    if (m === 'ultradian') return { focus: 90 * 60, break: 20 * 60 };
    return { focus: 0, break: 0 };
  };

  // Switch timer mode
  const handleSelectMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setIsFocusPhase(true);
    if (newMode === 'flowmodoro') {
      setElapsedFlowSeconds(0);
    } else {
      setTimeLeft(getDurations(newMode).focus);
    }
  };

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        if (mode === 'flowmodoro') {
          setElapsedFlowSeconds((prev) => prev + 1);
        } else {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              soundscapeEngine.playChime();
              if (isFocusPhase) {
                const completedMins = Math.round(getDurations(mode).focus / 60);
                onAwardXp(completedMins * 2);
                onLogSession(completedMins, `${mode.toUpperCase()} Focus Block`);
                setCompletedCycles((c) => c + 1);
                setIsFocusPhase(false);
                return getDurations(mode).break;
              } else {
                setIsFocusPhase(true);
                return getDurations(mode).focus;
              }
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, isFocusPhase]);

  // Box Breathing cycle (4s Inhale -> 4s Hold -> 4s Exhale -> 4s Hold)
  useEffect(() => {
    breathRef.current = window.setInterval(() => {
      setBreathCount((prev) => {
        if (prev <= 1) {
          setBreathPhase((curr) => {
            if (curr === 'Inhale') return 'Hold (Full)';
            if (curr === 'Hold (Full)') return 'Exhale';
            if (curr === 'Exhale') return 'Hold (Empty)';
            return 'Inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (breathRef.current) clearInterval(breathRef.current);
    };
  }, []);

  // Update soundscape track volume
  const handleVolumeChange = (trackId: string, val: number) => {
    setTracks((prev) => ({ ...prev, [trackId]: val }));
    soundscapeEngine.setTrackVolume(trackId, val);
  };

  const handleStopAllSounds = () => {
    setTracks({
      pink: 0,
      brown: 0,
      white: 0,
      'binaural-alpha': 0,
      'binaural-theta': 0,
      rain: 0,
    });
    soundscapeEngine.stopAll();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-8 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-8 overflow-y-auto' : ''}`}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <Clock className="h-4 w-4" />
            <span>Deep Focus Lab & Acoustic Synthesizer</span>
            <span aria-hidden="true">·</span>
            <span>Ultradian & Flow Engine</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            Focus & Acoustic Sanctuary
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronize neural oscillation rhythms with synthesized soundscapes and timed concentration blocks.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => handleSelectMode('pomodoro')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                mode === 'pomodoro' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              25/5 Pomodoro
            </button>
            <button
              onClick={() => handleSelectMode('fiftyTen')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                mode === 'fiftyTen' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              50/10 Lecture
            </button>
            <button
              onClick={() => handleSelectMode('ultradian')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                mode === 'ultradian' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              90/20 Ultradian
            </button>
            <button
              onClick={() => handleSelectMode('flowmodoro')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                mode === 'flowmodoro' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Flowmodoro (Count-up)
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-slate-200 cursor-pointer"
            title={isFullscreen ? 'Exit Monastic View' : 'Monastic Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Focus Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Big Timer Dial & Controls */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div
            className={`absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 ${
              isRunning ? 'bg-amber-500/10 opacity-100' : 'opacity-0'
            }`}
          />

          {/* Phase Badge */}
          <div className="mb-4">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                mode === 'flowmodoro'
                  ? 'bg-amber-400/20 text-amber-300'
                  : isFocusPhase
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-sky-500/20 text-sky-300'
              }`}
            >
              {mode === 'flowmodoro'
                ? 'Unbounded Flow Sprint'
                : isFocusPhase
                ? 'Deep Work Concentration'
                : 'Cognitive Reset Break'}
            </span>
          </div>

          {/* Time Display */}
          <div className="font-mono-tabular text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white my-4 select-none">
            {mode === 'flowmodoro' ? formatTime(elapsedFlowSeconds) : formatTime(timeLeft)}
          </div>

          {/* Cycles & Status */}
          <div className="text-xs text-slate-400 mb-8 flex items-center gap-3">
            <span>Completed Blocks: <strong className="text-slate-200">{completedCycles}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Distractions Logged: <strong className="text-slate-200">{distractionCount}</strong></span>
          </div>

          {/* Timer Primary Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-8 py-3.5 text-sm font-bold text-slate-950 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/10 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Start Focus Session</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                if (mode === 'flowmodoro') {
                  setElapsedFlowSeconds(0);
                } else {
                  setTimeLeft(getDurations(mode).focus);
                }
                setIsFocusPhase(true);
              }}
              className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => {
                setDistractionCount((c) => c + 1);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/20 px-4 py-3.5 text-xs font-semibold text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Click whenever you feel an urge to check phone or switch tabs"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Log Urge ({distractionCount})</span>
            </button>
          </div>
        </div>

        {/* Right Column: Web Audio Ambient Sound Mixer & Box Breathing */}
        <div className="lg:col-span-5 space-y-6">
          {/* Box Breathing Pacer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                <Wind className="h-4 w-4" />
                <span>Box Breathing Pacer (4-4-4-4)</span>
              </div>
              <span className="text-[11px] text-slate-500">Autonomic Regulation</span>
            </div>

            <div className="flex items-center justify-between bg-slate-950/70 rounded-xl p-4 border border-slate-800/80">
              <div>
                <div className="text-xs text-slate-400">Current Phase</div>
                <div className="font-semibold text-slate-100 text-sm mt-0.5">{breathPhase}</div>
              </div>
              <div className="h-12 w-12 rounded-full border-2 border-sky-400 flex items-center justify-center font-mono-tabular text-xl font-bold text-sky-300">
                {breathCount}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Synchronize deep diaphragmatic inhalation and exhalation to reduce pre-study sympathetic arousal.
            </p>
          </div>

          {/* Acoustic Soundscape Synthesizer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <Sliders className="h-4 w-4" />
                <span>Acoustic Soundscapes (Web Audio Synthesizer)</span>
              </div>
              <button
                onClick={handleStopAllSounds}
                className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Mute All
              </button>
            </div>

            <div className="space-y-3.5">
              {[
                { id: 'pink', name: 'Pink Noise', desc: 'Broadband acoustic masking' },
                { id: 'brown', name: 'Brown Noise', desc: 'Deep sub-bass waterfall rumble' },
                { id: 'white', name: 'White Noise', desc: 'Crisp uniform spectral mask' },
                { id: 'binaural-alpha', name: 'Binaural Alpha (10 Hz)', desc: 'Flow state & creative retrieval' },
                { id: 'binaural-theta', name: 'Binaural Theta (6 Hz)', desc: 'Deep memory encoding wave' },
                { id: 'rain', name: 'Rainfall Field', desc: 'Filtered acoustic rainfall' },
              ].map((sound) => {
                const vol = tracks[sound.id] || 0;
                return (
                  <div key={sound.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-slate-200">{sound.name}</span>
                        <span className="text-slate-500 text-[10px] ml-1.5">({sound.desc})</span>
                      </div>
                      <span className="font-mono-tabular text-[11px] text-slate-400">
                        {Math.round(vol * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {vol > 0 ? (
                        <Volume2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      ) : (
                        <VolumeX className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                      )}
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={vol}
                        onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                        className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
