import { CornellNote } from '../types';

export const DEFAULT_NOTES: CornellNote[] = [
  {
    id: 'note-1',
    title: 'Hebbian Plasticity & Memory Consolidation',
    subject: 'Neuroscience',
    tags: ['Memory', 'Neuroscience', 'HighYield'],
    cues: [
      'What is Donald Hebb fundamental postulate (1949)?',
      'What ion channel acts as the primary molecular coincidence detector?',
      'How does Ca2+ influx induce structural spine enlargement?'
    ],
    notes: `### Core Concept & Molecular Machinery
When an axon of cell A is near enough to excite cell B and repeatedly or persistently takes part in firing it, some growth process or metabolic change takes place in one or both cells such that A's efficiency, as one of the cells firing B, is increased.

- **NMDA Receptors as Coincidence Detectors**:
  - At resting membrane potential (-70 mV), the NMDA receptor pore is physically blocked by an extracellular **magnesium ion (Mg2+)**.
  - Depolarization via neighboring **AMPA receptors** repels the Mg2+ plug.
  - Concurrently, presynaptic glutamate must bind to open the channel.
  - Dual condition: *Presynaptic glutamate release + Postsynaptic depolarization*.

- **Calcium (Ca2+) Cascades**:
  - Unblocked channel allows rapid Ca2+ influx into dendritic spine.
  - Activates **CaMKII (Calcium/Calmodulin-dependent protein kinase II)**.
  - Phosphorylates existing AMPA receptors, increasing channel conductance.
  - Recruits additional AMPA receptors from intracellular endosomes into the postsynaptic density (PSD).`,
    summary: 'Hebbian synaptic strengthening requires simultaneous pre- and postsynaptic activation. The NMDA receptor functions as an enzymatic coincidence detector where Mg2+ unblocking triggers Ca2+ cascades, CaMKII activation, and AMPA receptor recruitment, driving Long-Term Potentiation.',
    updatedAt: new Date().toISOString(),
    links: ['Algorithmic Complexity & Graph Search', 'Thermodynamic Laws in Biochemical Systems']
  },
  {
    id: 'note-2',
    title: 'Algorithmic Complexity & Graph Search',
    subject: 'Computer Science',
    tags: ['Algorithms', 'DataStructures', 'CS'],
    cues: [
      'Why is BFS optimal for unweighted shortest path while DFS is not?',
      'Under what condition does Dijkstra fail on directed graphs?',
      'What makes an A* heuristic mathematically admissible?'
    ],
    notes: `### Graph Traversal Paradigms
- **Breadth-First Search (BFS)**:
  - Explores level by level using a FIFO Queue.
  - Guarantees minimum edge-count path in unweighted graphs.
  - Space complexity O(V) due to tracking the frontier perimeter.

- **Dijkstra Algorithm**:
  - Uses min-priority queue (Binary Heap or Fibonacci Heap).
  - Greedily settles the vertex with smallest known tentative distance.
  - **Fatal Invariant**: Assumes all edge weights are strictly non-negative (w(u, v) >= 0). Once a node is settled, its distance can never decrease. Negative edges invalidate this invariant (requires Bellman-Ford).

- **A* Search & Admissibility**:
  - Evaluation function: $f(n) = g(n) + h(n)$
  - $g(n)$: Exact cost from start node to $n$.
  - $h(n)$: Estimated heuristic cost from $n$ to target.
  - **Admissible Condition**: $h(n) \\le h^*(n)$ (never overestimates the true remaining cost).`,
    summary: 'Graph exploration algorithms trade space and heuristic guidance for optimality. Dijkstra guarantees shortest paths on non-negative weights via greedy relaxation, while A* accelerates convergence using admissible heuristics that never overestimate remaining cost.',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    links: ['Hebbian Plasticity & Memory Consolidation']
  },
  {
    id: 'note-3',
    title: 'Thermodynamic Laws in Biochemical Systems',
    subject: 'Biophysics',
    tags: ['Chemistry', 'Thermodynamics', 'Biophysics'],
    cues: [
      'What is the Gibbs Free Energy equation?',
      'Why can living organisms maintain low internal entropy without violating the 2nd Law?',
      'How does ATP hydrolysis couple to endergonic reactions?'
    ],
    notes: `### Gibbs Free Energy & Cellular Spontaneity
The fundamental relationship governing chemical equilibrium:
$$\\Delta G = \\Delta H - T \\Delta S$$

- **Spontaneity Criteria**:
  - $\\Delta G < 0$: Exergonic, thermodynamically spontaneous.
  - $\\Delta G > 0$: Endergonic, requires energy coupling to proceed.
  - $\\Delta G = 0$: Dynamic equilibrium.

- **Open Systems & Entropy**:
  - The Second Law states $\\Delta S_{universe} > 0$.
  - Biological cells are **open thermodynamic systems** exchanging matter and energy with their surroundings.
  - Cells maintain high internal structural order (negative local $\\Delta S$) by dissipating heat and increasing the entropy of their surrounding environment.`,
    summary: 'Biological spontaneity is governed by Gibbs Free Energy (ΔG = ΔH - TΔS). Living cells sustain low internal entropy by existing as open systems that couple energetically unfavorable anabolic reactions with ATP hydrolysis while exporting thermal entropy to their surroundings.',
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    links: ['Hebbian Plasticity & Memory Consolidation']
  }
];
