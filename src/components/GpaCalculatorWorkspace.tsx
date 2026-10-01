import React, { useState } from 'react';
import { CourseGrade } from '../types';
import { GraduationCap, Plus, Trash2, Calculator, Target, Award } from 'lucide-react';

interface GpaCalculatorWorkspaceProps {
  onAwardXp: (amount: number) => void;
}

const GRADE_POINTS_4_0: { [key: string]: number } = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0,
};

const INITIAL_COURSES: CourseGrade[] = [
  { id: 'c1', name: 'Advanced Neurobiology', credits: 4, grade: 'A' },
  { id: 'c2', name: 'Algorithms & Complexity', credits: 4, grade: 'A-' },
  { id: 'c3', name: 'Organic Chemistry II', credits: 3, grade: 'B+' },
  { id: 'c4', name: 'Multivariable Calculus', credits: 4, grade: 'A' },
];

export const GpaCalculatorWorkspace: React.FC<GpaCalculatorWorkspaceProps> = ({
  onAwardXp,
}) => {
  const [courses, setCourses] = useState<CourseGrade[]>(INITIAL_COURSES);

  // Final Exam Solver inputs
  const [currentGrade, setCurrentGrade] = useState<number>(86);
  const [examWeight, setExamWeight] = useState<number>(30);
  const [targetGrade, setTargetGrade] = useState<number>(90);

  // GPA Calculation
  const totalCredits = courses.reduce((acc, c) => acc + (c.credits || 0), 0);
  const totalQualityPoints = courses.reduce(
    (acc, c) => acc + (c.credits || 0) * (GRADE_POINTS_4_0[c.grade] ?? 0),
    0
  );
  const cumulativeGpa = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : '0.00';

  // Final Exam Target Calculation:
  // Target = Current * (1 - Weight) + Final * Weight
  // Final = (Target - Current * (1 - Weight)) / Weight
  const requiredFinalScore = React.useMemo(() => {
    const w = (examWeight || 1) / 100;
    const req = (targetGrade - currentGrade * (1 - w)) / w;
    return parseFloat(req.toFixed(1));
  }, [currentGrade, examWeight, targetGrade]);

  const handleAddCourse = () => {
    const newCourse: CourseGrade = {
      id: `course-${Date.now()}`,
      name: 'New Academic Course',
      credits: 3,
      grade: 'A',
    };
    setCourses([...courses, newCourse]);
  };

  const handleRemoveCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const handleUpdateCourse = (id: string, field: keyof CourseGrade, value: string | number) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <GraduationCap className="h-4 w-4" />
            <span>Academic Grade Point & Exam Strategy Modeling</span>
            <span aria-hidden="true">·</span>
            <span>Target Score Optimization</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            GPA & Final Exam Strategy Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Model multi-course semester standing and calculate mathematically required scores for final examinations.
          </p>
        </div>

        <button
          onClick={handleAddCourse}
          className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Course List and GPA Tally */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Enrolled Semester Courses ({courses.length})
            </h3>
            <span className="text-xs text-slate-500 font-mono-tabular">
              Total Credits: {totalCredits}
            </span>
          </div>

          <div className="space-y-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => handleUpdateCourse(course.id, 'name', e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-100 focus:outline-none focus:text-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 uppercase">Credits</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={course.credits}
                      onChange={(e) => handleUpdateCourse(course.id, 'credits', parseInt(e.target.value) || 1)}
                      className="w-12 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-center text-slate-100 font-mono"
                    />
                  </div>

                  <select
                    value={course.grade}
                    onChange={(e) => handleUpdateCourse(course.id, 'grade', e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs font-bold text-amber-400 focus:outline-none"
                  >
                    {Object.keys(GRADE_POINTS_4_0).map((g) => (
                      <option key={g} value={g}>
                        {g} ({GRADE_POINTS_4_0[g].toFixed(1)})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRemoveCourse(course.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cumulative GPA Card */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-400 font-medium block">
                Semester Grade Point Average (4.0 Scale)
              </span>
              <div className="font-mono-tabular text-4xl font-bold text-amber-300 mt-1">
                {cumulativeGpa}
              </div>
              <span className="text-[11px] text-amber-400/80 block mt-1">
                {parseFloat(cumulativeGpa) >= 3.8
                  ? 'Summa Cum Laude / Dean List Honors'
                  : parseFloat(cumulativeGpa) >= 3.5
                  ? 'Magna Cum Laude Honors Standing'
                  : 'Good Academic Standing'}
              </span>
            </div>

            <button
              onClick={() => onAwardXp(25)}
              className="px-4 py-2 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
            >
              Verify Standing (+25 XP)
            </button>
          </div>
        </div>

        {/* Right Column: Final Exam Target Solver */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              "What Do I Need on the Final?" Solver
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter your current percentage grade before the final exam and determine the required threshold to secure your target grade.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 flex justify-between mb-1">
                <span>Current Standing Grade</span>
                <span className="font-mono-tabular font-bold text-slate-100">{currentGrade}%</span>
              </label>
              <input
                type="range"
                min="40"
                max="100"
                value={currentGrade}
                onChange={(e) => setCurrentGrade(parseInt(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 flex justify-between mb-1">
                <span>Final Exam Weight in Syllabus</span>
                <span className="font-mono-tabular font-bold text-slate-100">{examWeight}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={examWeight}
                onChange={(e) => setExamWeight(parseInt(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 flex justify-between mb-1">
                <span>Desired Final Course Grade</span>
                <span className="font-mono-tabular font-bold text-amber-400">{targetGrade}%</span>
              </label>
              <input
                type="range"
                min="60"
                max="100"
                value={targetGrade}
                onChange={(e) => setTargetGrade(parseInt(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Solution Callout */}
          <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">
              Required Score on Final Exam
            </span>
            <div
              className={`font-mono-tabular text-3xl font-bold ${
                requiredFinalScore <= 85
                  ? 'text-emerald-400'
                  : requiredFinalScore <= 98
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {requiredFinalScore}%
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {requiredFinalScore > 100
                ? 'Mathematically unattainable without curve or extra credit. Consider adjusting target grade.'
                : requiredFinalScore <= 70
                ? 'Comfortable buffer. Focus on error minimization.'
                : 'Aggressive preparation required. Schedule 3 mock past-papers.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
