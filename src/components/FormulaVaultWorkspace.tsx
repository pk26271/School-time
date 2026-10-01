import React, { useState } from 'react';
import { STEM_FORMULAS } from '../data/formulas';
import { PERIODIC_ELEMENTS } from '../data/periodicTable';
import { FormulaItem, ElementData } from '../types';
import {
  Calculator,
  Atom,
  Search,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Layers
} from 'lucide-react';

interface FormulaVaultWorkspaceProps {
  onAwardXp: (amount: number) => void;
}

export const FormulaVaultWorkspace: React.FC<FormulaVaultWorkspaceProps> = ({
  onAwardXp,
}) => {
  const [activeTab, setActiveTab] = useState<'formulas' | 'periodic'>('formulas');
  const [selectedFormula, setSelectedFormula] = useState<FormulaItem>(STEM_FORMULAS[0]);
  const [inputs, setInputs] = useState<{ [key: string]: number }>(STEM_FORMULAS[0].defaultInputs);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Periodic Table selected element
  const [selectedElement, setSelectedElement] = useState<ElementData>(PERIODIC_ELEMENTS[5]); // Carbon

  const handleSelectFormula = (formula: FormulaItem) => {
    setSelectedFormula(formula);
    setInputs(formula.defaultInputs);
  };

  const handleInputChange = (variableKey: string, val: number) => {
    setInputs((prev) => ({
      ...prev,
      [variableKey]: val,
    }));
  };

  const computedResult = React.useMemo(() => {
    try {
      return selectedFormula.compute(inputs);
    } catch (e) {
      return 0;
    }
  }, [selectedFormula, inputs]);

  const filteredFormulas = STEM_FORMULAS.filter((f) => {
    if (categoryFilter !== 'All' && f.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.latex.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <Calculator className="h-4 w-4" />
            <span>STEM Formula Precision Solvers & Chemical Analytics</span>
            <span aria-hidden="true">·</span>
            <span>Interactive Visual Engines</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            STEM Formula & Periodic Vault
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compute multi-variable physics and calculus equations in real time, or inspect atomic electron configurations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('formulas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'formulas'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>Formula Solvers</span>
          </button>
          <button
            onClick={() => setActiveTab('periodic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'periodic'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Atom className="h-3.5 w-3.5" />
            <span>Periodic Elements</span>
          </button>
        </div>
      </div>

      {activeTab === 'formulas' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Formulas List & Filter */}
          <div className="lg:col-span-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formulas..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 pl-9 pr-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['All', 'Physics', 'Calculus', 'Chemistry', 'Statistics', 'Finance'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-slate-800 text-amber-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Formula Cards */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredFormulas.map((formula) => (
                <button
                  key={formula.id}
                  onClick={() => handleSelectFormula(formula)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedFormula.id === formula.id
                      ? 'border-amber-400/50 bg-amber-950/20 text-white'
                      : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="text-amber-400 font-medium">{formula.category}</span>
                    <span className="font-mono text-slate-500">{formula.unit}</span>
                  </div>
                  <div className="text-xs font-semibold">{formula.name}</div>
                  <div className="font-mono-tabular text-xs text-slate-400 mt-1 truncate">
                    {formula.latex}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Live Interactive Solver */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-700 bg-slate-900/80 p-6 md:p-8 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-amber-400">{selectedFormula.category} Equation</span>
                <span className="text-xs text-slate-500">Unit: {selectedFormula.unit}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                {selectedFormula.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {selectedFormula.description}
              </p>
            </div>

            {/* LaTeX Display Box */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-center">
              <span className="text-xs text-slate-500 block mb-1">Mathematical Relation</span>
              <div className="font-mono-tabular text-lg md:text-xl font-semibold text-amber-300 tracking-wide">
                {selectedFormula.latex}
              </div>
            </div>

            {/* Interactive Inputs */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Variable Inputs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(selectedFormula.variables).map(([key, label]) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-xs text-slate-300 flex justify-between">
                      <span>{label}</span>
                      <span className="font-mono-tabular text-amber-400 font-bold">{inputs[key] ?? 0}</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={inputs[key] ?? 0}
                      onChange={(e) => handleInputChange(key, parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs text-emerald-400 font-medium block">
                  Computed Output ({selectedFormula.solveFor})
                </span>
                <div className="font-mono-tabular text-3xl font-bold text-emerald-300 mt-1">
                  {typeof computedResult === 'number'
                    ? computedResult.toLocaleString(undefined, { maximumFractionDigits: 4 })
                    : computedResult}
                  <span className="text-sm font-normal text-emerald-400/80 ml-2">
                    {selectedFormula.unit}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onAwardXp(15)}
                className="px-4 py-2 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors cursor-pointer self-start sm:self-auto"
              >
                Log Solution (+15 XP)
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Periodic Table Visualizer */
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
            {PERIODIC_ELEMENTS.map((el) => {
              const isSelected = selectedElement.number === el.number;
              return (
                <button
                  key={el.number}
                  onClick={() => setSelectedElement(el)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/30 ring-1 ring-amber-400'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span className="font-mono">{el.number}</span>
                    <span className="truncate max-w-[40px]">{el.period}P</span>
                  </div>
                  <div className="font-display text-xl font-bold text-white my-1">
                    {el.symbol}
                  </div>
                  <div className="text-[11px] text-slate-300 truncate font-medium">
                    {el.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {el.mass.toFixed(2)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Element Detailed Drawer */}
          {selectedElement && (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-500 font-mono block mb-1">
                  Atomic Number {selectedElement.number}
                </span>
                <span className="font-display text-5xl font-bold text-amber-400 mb-2">
                  {selectedElement.symbol}
                </span>
                <span className="text-base font-semibold text-slate-100">
                  {selectedElement.name}
                </span>
                <span className="text-xs text-slate-400 font-mono mt-1">
                  Standard Atomic Mass: {selectedElement.mass} u
                </span>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <span className="text-xs text-amber-400 font-medium">
                    {selectedElement.category} · Period {selectedElement.period}, Group {selectedElement.group}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white mt-0.5">
                    Electronic & Physical Characteristics
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {selectedElement.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Electron Configuration</span>
                    <span className="font-mono text-sm font-semibold text-slate-200 mt-0.5 block">
                      {selectedElement.electronConfig}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Chemical Classification</span>
                    <span className="text-sm font-semibold text-slate-200 mt-0.5 block">
                      {selectedElement.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
