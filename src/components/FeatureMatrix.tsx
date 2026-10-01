import React, { useState, useMemo } from 'react';
import { StudyFeature, WorkspaceId } from '../types';
import { STUDY_CATEGORIES } from '../data/features1000';
import {
  Search,
  Bookmark,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Filter,
  Layers,
  BookOpen
} from 'lucide-react';

interface FeatureMatrixProps {
  features: StudyFeature[];
  onToggleMastered: (id: number) => void;
  onToggleBookmark: (id: number) => void;
  onLaunchWorkspace: (workspace: WorkspaceId) => void;
  userXp: number;
}

export const FeatureMatrix: React.FC<FeatureMatrixProps> = ({
  features,
  onToggleMastered,
  onToggleBookmark,
  onLaunchWorkspace,
  userXp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'mastered' | 'pending' | 'bookmarked'>('all');
  const [expandedFeatureId, setExpandedFeatureId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Disciplines list
  const disciplines = useMemo(() => {
    const set = new Set<string>();
    features.forEach((f) => set.add(f.discipline));
    return Array.from(set).sort();
  }, [features]);

  // Mastered & bookmarked metrics
  const masteredCount = useMemo(() => features.filter((f) => f.mastered).length, [features]);
  const bookmarkedCount = useMemo(() => features.filter((f) => f.bookmarked).length, [features]);
  const percentComplete = ((masteredCount / features.length) * 100).toFixed(1);

  // Filtered features
  const filteredFeatures = useMemo(() => {
    return features.filter((f) => {
      // Category filter
      if (selectedCategory !== 'all' && f.categoryIndex !== selectedCategory) {
        return false;
      }
      // Discipline filter
      if (selectedDiscipline !== 'all' && f.discipline !== selectedDiscipline) {
        return false;
      }
      // Status filter
      if (statusFilter === 'mastered' && !f.mastered) return false;
      if (statusFilter === 'pending' && f.mastered) return false;
      if (statusFilter === 'bookmarked' && !f.bookmarked) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.code.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          f.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [features, selectedCategory, selectedDiscipline, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredFeatures.length / itemsPerPage) || 1;
  const currentFeatures = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFeatures.slice(start, start + itemsPerPage);
  }, [filteredFeatures, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner with clean typography and high-density stats */}
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span>Verified Comprehensive Learning Framework</span>
              <span aria-hidden="true">·</span>
              <span>20 Categories</span>
              <span aria-hidden="true">·</span>
              <span>1,000 Study Features</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white" style={{ textWrap: 'balance' }}>
              The 1,000-Feature Study Operating System
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Every evidence-based learning mechanism, spaced retrieval algorithm, cognitive ergonomics rule, and STEM problem-solving engine systematically indexed, interactive, and executable.
            </p>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="text-xs text-slate-400 block mb-1">Total Catalog</span>
              <span className="font-mono-tabular text-2xl font-bold text-white">1,000</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Active Specifications</span>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4">
              <span className="text-xs text-emerald-400 block mb-1">Mastered</span>
              <span className="font-mono-tabular text-2xl font-bold text-emerald-300">
                {masteredCount}
              </span>
              <span className="text-[11px] text-emerald-400/70 block mt-0.5">{percentComplete}% Completed</span>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4">
              <span className="text-xs text-amber-400 block mb-1">Scholar XP</span>
              <span className="font-mono-tabular text-2xl font-bold text-amber-300">
                {userXp.toLocaleString()}
              </span>
              <span className="text-[11px] text-amber-400/70 block mt-0.5">Level {Math.floor(userXp / 500) + 1} Scholar</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="text-xs text-slate-400 block mb-1">Saved Hooks</span>
              <span className="font-mono-tabular text-2xl font-bold text-slate-200">
                {bookmarkedCount}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Quick Access Items</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Overall Study System Mastery Progress</span>
            <span className="font-mono-tabular font-medium text-slate-200">{masteredCount} / 1,000 Features ({percentComplete}%)</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.max(0.5, Number(percentComplete))}%` }}
            />
          </div>
        </div>
      </section>

      {/* Filter and Search Controls */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search across all 1,000 features by name, code, concept, or tag..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status selector tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 p-1 shrink-0 overflow-x-auto">
            <button
              onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-slate-100 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All (1,000)
            </button>
            <button
              onClick={() => { setStatusFilter('mastered'); setCurrentPage(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'mastered'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mastered ({masteredCount})
            </button>
            <button
              onClick={() => { setStatusFilter('pending'); setCurrentPage(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pending ({features.length - masteredCount})
            </button>
            <button
              onClick={() => { setStatusFilter('bookmarked'); setCurrentPage(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'bookmarked'
                  ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bookmarked ({bookmarkedCount})
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-400 text-slate-950 font-semibold'
                : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            All 20 Categories
          </button>
          {STUDY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="font-mono-tabular mr-1 text-[10px] opacity-70">#{cat.id}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Results header */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <span className="font-mono-tabular font-semibold text-slate-200">{filteredFeatures.length}</span>
          <span>matching features</span>
          {selectedCategory !== 'all' && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-medium">Category {selectedCategory}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono-tabular">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentFeatures.map((feat) => {
          const isExpanded = expandedFeatureId === feat.id;

          return (
            <div
              key={feat.id}
              className={`rounded-xl border transition-all duration-200 p-5 flex flex-col justify-between ${
                feat.mastered
                  ? 'border-emerald-500/30 bg-slate-900/70 hover:border-emerald-500/50'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Clean unboxed metadata with typographic separators */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-mono-tabular text-amber-400 font-medium">{feat.code}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{feat.category}</span>
                  </div>
                  <button
                    onClick={() => onToggleBookmark(feat.id)}
                    className="text-slate-400 hover:text-amber-400 transition-colors p-1 cursor-pointer shrink-0"
                    title={feat.bookmarked ? 'Remove bookmark' : 'Bookmark feature'}
                  >
                    <Bookmark
                      className={`h-4 w-4 ${feat.bookmarked ? 'fill-amber-400 text-amber-400' : ''}`}
                    />
                  </button>
                </div>

                {/* Feature Title */}
                <h3 className="font-semibold text-slate-100 text-base leading-snug mb-2">
                  {feat.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {feat.description}
                </p>

                {/* Pro-Tip Expandable section */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-amber-200/90 bg-amber-950/20 p-2.5 rounded-lg mb-3">
                    <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span>Academic Protocol & Pro Tip:</span>
                    </div>
                    {feat.proTip}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleMastered(feat.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer ${
                      feat.mastered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                    title={feat.mastered ? 'Mark as Unmastered' : 'Mark as Mastered (+50 XP)'}
                  >
                    {feat.mastered ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Mastered</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-3.5 w-3.5 text-slate-400" />
                        <span>Master</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setExpandedFeatureId(isExpanded ? null : feat.id)}
                    className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 cursor-pointer"
                  >
                    {isExpanded ? 'Less' : 'Tips'}
                  </button>
                </div>

                {feat.workspaceTarget && (
                  <button
                    onClick={() => onLaunchWorkspace(feat.workspaceTarget!)}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 transition-colors cursor-pointer group"
                    title={`Open ${feat.workspaceTarget} workspace`}
                  >
                    <span>Launch</span>
                    <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredFeatures.length === 0 && (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <BookOpen className="h-10 w-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No matching features found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, clearing filters, or switching categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-medium text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 pt-6">
          <span className="text-xs text-slate-400 font-mono-tabular">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredFeatures.length)} of {filteredFeatures.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-8 w-8 rounded-lg text-xs font-mono-tabular font-medium transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
