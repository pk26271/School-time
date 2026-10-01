import { FormulaItem } from '../types';

export const STEM_FORMULAS: FormulaItem[] = [
  {
    id: 'f-kinematics-1',
    name: 'Velocity-Time Kinematics',
    category: 'Physics',
    latex: 'v = v_0 + a \\cdot t',
    description: 'Calculates final linear velocity given initial velocity, constant acceleration, and elapsed time.',
    variables: {
      v0: 'Initial Velocity (m/s)',
      a: 'Acceleration (m/s²)',
      t: 'Time Elapsed (s)'
    },
    solveFor: 'Final Velocity v',
    compute: (inputs) => (inputs.v0 || 0) + (inputs.a || 0) * (inputs.t || 0),
    unit: 'm/s',
    defaultInputs: { v0: 0, a: 9.81, t: 5 }
  },
  {
    id: 'f-kinematics-2',
    name: 'Displacement with Constant Acceleration',
    category: 'Physics',
    latex: 'd = v_0 \\cdot t + \\frac{1}{2} a \\cdot t^2',
    description: 'Calculates total distance/displacement covered under constant linear acceleration.',
    variables: {
      v0: 'Initial Velocity (m/s)',
      a: 'Acceleration (m/s²)',
      t: 'Time (s)'
    },
    solveFor: 'Displacement d',
    compute: (inputs) => (inputs.v0 || 0) * (inputs.t || 0) + 0.5 * (inputs.a || 0) * Math.pow(inputs.t || 0, 2),
    unit: 'meters (m)',
    defaultInputs: { v0: 10, a: 2.5, t: 4 }
  },
  {
    id: 'f-kinetic-energy',
    name: 'Kinetic Energy (Classical)',
    category: 'Physics',
    latex: 'KE = \\frac{1}{2} m \\cdot v^2',
    description: 'Calculates the kinetic energy possessed by an object due to its mass and motion.',
    variables: {
      m: 'Mass (kg)',
      v: 'Velocity (m/s)'
    },
    solveFor: 'Kinetic Energy KE',
    compute: (inputs) => 0.5 * (inputs.m || 0) * Math.pow(inputs.v || 0, 2),
    unit: 'Joules (J)',
    defaultInputs: { m: 75, v: 20 }
  },
  {
    id: 'f-ohms-law',
    name: "Ohm's Law & Circuit Voltage",
    category: 'Physics',
    latex: 'V = I \\cdot R',
    description: 'Determines the electrical potential difference across a conductor given current and resistance.',
    variables: {
      I: 'Current (Amperes, A)',
      R: 'Resistance (Ohms, Ω)'
    },
    solveFor: 'Voltage V',
    compute: (inputs) => (inputs.I || 0) * (inputs.R || 0),
    unit: 'Volts (V)',
    defaultInputs: { I: 2.5, R: 48 }
  },
  {
    id: 'f-gas-law',
    name: 'Ideal Gas Law (Pressure Solver)',
    category: 'Chemistry',
    latex: 'P = \\frac{n \\cdot R \\cdot T}{V}',
    description: 'Computes pressure of an ideal gas. Constant R is taken as 8.314 J/(mol·K).',
    variables: {
      n: 'Moles of Gas (mol)',
      T: 'Temperature (Kelvin, K)',
      V: 'Volume (Cubic Meters, m³)'
    },
    solveFor: 'Pressure P',
    compute: (inputs) => {
      const R_const = 8.314;
      const vol = inputs.V || 0.001;
      return ((inputs.n || 1) * R_const * (inputs.T || 298.15)) / vol;
    },
    unit: 'Pascals (Pa)',
    defaultInputs: { n: 2, T: 300, V: 0.05 }
  },
  {
    id: 'f-z-score',
    name: 'Standard Normal Z-Score',
    category: 'Statistics',
    latex: 'Z = \\frac{X - \\mu}{\\sigma}',
    description: 'Quantifies the exact number of standard deviations a data point X lies from the population mean μ.',
    variables: {
      X: 'Observed Value',
      mu: 'Population Mean (μ)',
      sigma: 'Standard Deviation (σ)'
    },
    solveFor: 'Z-Score',
    compute: (inputs) => {
      const s = inputs.sigma || 1;
      return ((inputs.X || 0) - (inputs.mu || 0)) / s;
    },
    unit: 'standard deviations',
    defaultInputs: { X: 88, mu: 72, sigma: 8 }
  },
  {
    id: 'f-compound-interest',
    name: 'Compound Interest Future Value',
    category: 'Finance',
    latex: 'A = P \\left(1 + \\frac{r}{n}\\right)^{n \\cdot t}',
    description: 'Calculates the future value of an investment with periodic compounding interest.',
    variables: {
      P: 'Principal Balance ($)',
      r: 'Annual Interest Rate (decimal, e.g. 0.07)',
      n: 'Compounding frequency per year',
      t: 'Time in Years'
    },
    solveFor: 'Total Future Balance A',
    compute: (inputs) => {
      const p = inputs.P || 1000;
      const r = inputs.r || 0.05;
      const n = inputs.n || 12;
      const t = inputs.t || 10;
      return p * Math.pow(1 + r / n, n * t);
    },
    unit: '$ USD',
    defaultInputs: { P: 5000, r: 0.08, n: 12, t: 5 }
  },
  {
    id: 'f-derivative-power',
    name: 'Calculus Power Rule Derivative',
    category: 'Calculus',
    latex: '\\frac{d}{dx}[a \\cdot x^n] = a \\cdot n \\cdot x^{n-1}',
    description: 'Evaluates the instantaneous slope of polynomial function f(x) = a * x^n at a specific x value.',
    variables: {
      a: 'Coefficient a',
      n: 'Exponent power n',
      x: 'Evaluation point x'
    },
    solveFor: "Derivative Slope f'(x)",
    compute: (inputs) => {
      const a = inputs.a || 1;
      const n = inputs.n || 1;
      const x = inputs.x || 1;
      return a * n * Math.pow(x, n - 1);
    },
    unit: 'slope value',
    defaultInputs: { a: 3, n: 2, x: 4 }
  }
];
