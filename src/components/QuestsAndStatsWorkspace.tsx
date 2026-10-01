import React from 'react';
import { ScholarQuest, StudyFeature } from '../types';
import {
  Trophy,
  Flame,
  Award,
  CheckCircle2,
  Circle,
  Sparkles,
  Zap,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface QuestsAndStatsWorkspaceProps {
  userXp: number;
  features: StudyFeature[];
  onAwardXp: (amount: number) => void;
}

const SCHOLAR_RANKS = [
  { level: 1, title: 'Novice Scholar', minXp: 0 },
  { level: 2, title: 'Active Apprentice', minXp: 500 },
  { level: 3, title: 'Cognitive Specialist', minXp: 1200 },
  { level: 4, title: 'Deep Work Master', minXp: 2200 },
  { level: 5, title: 'Spaced Memory Champion', minXp: 3500 },
  { level: 6, title: 'Feynman Conceptualist', minXp: 5000 },
  { level: 7, title: 'Polymath Virtuoso', minXp: 7500 },
  { level: 8, title: 'Grand Academic Archon', minXp: 10000 },
];

const BADGES = [
  { id: 'b1', name: 'Centurion', desc: 'Explore at least 100 study features in the catalog', icon: '🏛️', minFeatures: 100 },
  { id: 'b2', name: 'Feynman Disciple', desc: 'Complete 3 conceptual simplifications in plain English', icon: '💡', minFeatures: 20 },
  { id: 'b3', name: 'Spaced Repetition Virtuoso', desc: 'Review 50 flashcards across multiple Leitner boxes', icon: '⚡', minFeatures: 10 },
  { id: 'b4', name: 'Monastic Titan', desc: 'Accumulate 180+ minutes of deep Pomodoro focus', icon: '🧘', minFeatures: 15 },
  { id: 'b5', name: 'STEM Formula Prodigy', desc: 'Compute solutions across 5 distinct scientific equations', icon: '📐', minFeatures: 25 },
  { id: 'b6', name: 'Acoustic Coherence', desc: 'Synthesize custom multi-track ambient soundscapes', icon: '🎧', minFeatures: 5 },
  { id: 'b7', name: 'The Blurting Champion', desc: 'Perform active recall and achieve 80%+ concept yield', icon: '🧠', minFeatures: 30 },
  { id: 'b8', name: 'Zettelkasten Architect', desc: 'Establish 10+ bidirectional wiki-links between atomic notes', icon: '🔗', minFeatures: 40 },
];

export const QuestsAndStatsWorkspace: React.FC<QuestsAndStatsWorkspaceProps> = ({
  userXp,
  features,
  onAwardXp,
}) => {
  const masteredCount = features.filter((f) => f.mastered).length;

  // Determine current scholar rank
  const currentRank = [...SCHOLAR_RANKS].reverse().find((r) => userXp >= r.minXp) || SCHOLAR_RANKS[0];
  const nextRank = SCHOLAR_RANKS.find((r) => r.level === currentRank.level + 1);
  const xpInLevel = userXp - currentRank.minXp;
  const xpNeeded = nextRank ? nextRank.minXp - currentRank.minXp : 1000;
  const progressToNext = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <Trophy className="h-4 w-4" />
            <span>Scholar Gamification & Mastery Progression Engine</span>
            <span aria-hidden="true">·</span>
            <span>Habit Crucible</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            Scholar Quests & Achievement Hall
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Level up your academic rank, maintain study streaks, and unlock honors by mastering all 1,000 features.
          </p>
        </div>

        <button
          onClick={() => onAwardXp(100)}
          className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Claim Daily Study Bounty (+100 XP)</span>
        </button>
      </div>

      {/* Rank Overview Card */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
              <span>Level {currentRank.level} Scholar</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">{userXp.toLocaleString()} Total XP</span>
            </div>
            <h3 className="font-display text-3xl font-bold text-white">
              {currentRank.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {nextRank
                ? `Earn ${nextRank.minXp - userXp} more XP to ascend to Rank ${nextRank.level}: ${nextRank.title}.`
                : 'Maximum Scholar Ascension achieved. You stand among the Grand Academic Archons.'}
            </p>
          </div>

          <div className="text-right">
            <div className="font-mono-tabular text-3xl font-bold text-amber-400">
              {masteredCount} / 1,000
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Features Mastered</div>
          </div>
        </div>

        {/* Progress bar to next level */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Ascension Velocity</span>
            <span className="font-mono-tabular text-slate-200">{progressToNext}% to Next Rank</span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      </div>

      {/* 7-Day Study Habit Crucible Matrix */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              7-Day Study Habit Crucible
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <Flame className="h-4 w-4" />
            <span>5-Day Consecutive Active Streak</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center pt-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
            const isCompleted = idx < 5; // Simulates strong active streak
            return (
              <div
                key={day}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                    : 'border-slate-800 bg-slate-950/40 text-slate-500'
                }`}
              >
                <div className="text-[11px] font-semibold mb-1">{day}</div>
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-700 mx-auto" />
                )}
                <div className="text-[10px] mt-1 font-mono-tabular">
                  {isCompleted ? '+140 XP' : 'Pending'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlockable Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Academic Honors & Badges ({BADGES.length})
          </h3>
          <span className="text-xs text-slate-500">Earned through catalog feature mastery</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = masteredCount >= badge.minFeatures;
            return (
              <div
                key={badge.id}
                className={`rounded-xl border p-4 transition-all ${
                  isUnlocked
                    ? 'border-amber-500/30 bg-slate-900/80 shadow-md'
                    : 'border-slate-800/80 bg-slate-950/40 opacity-50'
                }`}
              >
                <div className="text-2xl mb-2">{badge.icon}</div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center justify-between">
                  <span>{badge.name}</span>
                  {isUnlocked && <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {badge.desc}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono-tabular">
                  Requirement: {badge.minFeatures} Mastered Features
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
