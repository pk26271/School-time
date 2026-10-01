import { FlashcardDeck } from '../types';

export const DEFAULT_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-neuro',
    title: 'Neurobiology & Cognitive Science',
    subject: 'Biology / Psychology',
    description: 'High-yield concepts in neuroplasticity, memory encoding, synaptic transmission, and neurotransmitters.',
    cards: [
      {
        id: 'card-n1',
        deckId: 'deck-neuro',
        front: 'What is Long-Term Potentiation (LTP)?',
        back: 'A persistent strengthening of synapses based on recent patterns of activity, producing a long-lasting increase in signal transmission between two neurons. Often summarized by Hebbian theory: "Neurons that fire together, wire together."',
        hint: 'Discovered by Terje Lømo in the hippocampus',
        repetitions: 3,
        interval: 6,
        easeFactor: 2.5,
        box: 3,
        nextReviewDate: new Date(Date.now() + 86400000 * 3).toISOString()
      },
      {
        id: 'card-n2',
        deckId: 'deck-neuro',
        front: 'Role of the Hippocampus in Memory Consolidation',
        back: 'Crucial for encoding declarative (episodic and semantic) memories from short-term to long-term storage in the neocortex. Damage impairs new memory formation (anterograde amnesia) while sparing older procedural skills.',
        hint: 'Famous patient H.M. had bilateral medial temporal lobectomy',
        repetitions: 2,
        interval: 3,
        easeFactor: 2.5,
        box: 2,
        nextReviewDate: new Date(Date.now() + 86400000 * 2).toISOString()
      },
      {
        id: 'card-n3',
        deckId: 'deck-neuro',
        front: 'Difference between Working Memory and Short-Term Memory',
        back: 'Short-term memory refers purely to passive storage of information for a brief duration (seconds). Working memory involves both holding AND actively manipulating information (e.g. mental arithmetic, reversing digits) governed by the dorsolateral prefrontal cortex.',
        hint: 'Baddeley and Hitch model with central executive',
        repetitions: 1,
        interval: 1,
        easeFactor: 2.5,
        box: 1,
        nextReviewDate: new Date().toISOString()
      },
      {
        id: 'card-n4',
        deckId: 'deck-neuro',
        front: 'Primary function of Myelin Sheaths in Action Potentials',
        back: 'Insulates axons to drastically increase the conduction velocity of electrical impulses via saltatory conduction, allowing action potentials to jump between the Nodes of Ranvier.',
        hint: 'Produced by oligodendrocytes in CNS, Schwann cells in PNS',
        repetitions: 4,
        interval: 14,
        easeFactor: 2.6,
        box: 4,
        nextReviewDate: new Date(Date.now() + 86400000 * 7).toISOString()
      },
      {
        id: 'card-n5',
        deckId: 'deck-neuro',
        front: 'GABA vs Glutamate Neurotransmitter Roles',
        back: 'Glutamate is the primary excitatory neurotransmitter in the vertebrate brain (activates AMPA/NMDA receptors). GABA (gamma-aminobutyric acid) is the primary inhibitory neurotransmitter, opening Cl- channels to hyperpolarize the post-synaptic neuron.',
        hint: 'Excitatory gas pedal vs inhibitory brake',
        repetitions: 2,
        interval: 3,
        easeFactor: 2.4,
        box: 2,
        nextReviewDate: new Date(Date.now() + 86400000 * 1).toISOString()
      }
    ]
  },
  {
    id: 'deck-cs',
    title: 'Algorithms & Computational Complexity',
    subject: 'Computer Science',
    description: 'Core Big-O classifications, data structures, graph traversals, and dynamic programming invariants.',
    cards: [
      {
        id: 'card-c1',
        deckId: 'deck-cs',
        front: 'Time & Space Complexity of Merge Sort',
        back: 'Time Complexity: O(N log N) in all cases (Best, Average, Worst) because division into halves is guaranteed. Space Complexity: O(N) auxiliary space needed to hold temporary merge buffers.',
        hint: 'Divide-and-conquer paradigm',
        repetitions: 3,
        interval: 7,
        easeFactor: 2.5,
        box: 3,
        nextReviewDate: new Date(Date.now() + 86400000 * 4).toISOString()
      },
      {
        id: 'card-c2',
        deckId: 'deck-cs',
        front: 'Dijkstra vs A* Algorithm Key Difference',
        back: 'Dijkstra explores paths purely by cumulative distance from the source g(n), expanding uniformly in all directions. A* uses an admissible heuristic h(n) to prioritize paths pointing toward the goal: f(n) = g(n) + h(n).',
        hint: 'Greedy best-first with directed heuristic',
        repetitions: 2,
        interval: 3,
        easeFactor: 2.5,
        box: 2,
        nextReviewDate: new Date(Date.now() + 86400000 * 2).toISOString()
      },
      {
        id: 'card-c3',
        deckId: 'deck-cs',
        front: 'Two Key Properties of Dynamic Programming',
        back: '1. Optimal Substructure: An optimal solution to the problem contains optimal solutions to subproblems.\n2. Overlapping Subproblems: The recursive algorithm visits the exact same subproblems repeatedly rather than generating new ones.',
        hint: 'Think of Memoization vs Tabulation',
        repetitions: 5,
        interval: 30,
        easeFactor: 2.7,
        box: 5,
        nextReviewDate: new Date(Date.now() + 86400000 * 20).toISOString()
      },
      {
        id: 'card-c4',
        deckId: 'deck-cs',
        front: 'Hash Collision Resolution: Chaining vs Open Addressing',
        back: 'Separate Chaining: Each bucket holds an auxiliary linked list or red-black tree. Open Addressing: All elements reside in the table array; collisions probe alternative cells via linear, quadratic, or double hashing.',
        hint: 'External linked list vs probing in-place',
        repetitions: 2,
        interval: 3,
        easeFactor: 2.4,
        box: 2,
        nextReviewDate: new Date().toISOString()
      }
    ]
  },
  {
    id: 'deck-chem',
    title: 'Organic Chemistry & Reaction Mechanisms',
    subject: 'Chemistry',
    description: 'SN1 vs SN2, electrophilic addition, carbonyl additions, and thermodynamic stability.',
    cards: [
      {
        id: 'card-ch1',
        deckId: 'deck-chem',
        front: 'SN1 vs SN2 Reaction Mechanism Contrast',
        back: 'SN1: Two-step mechanism via carbocation intermediate; unimolecular rate law Rate = k[Substrate]; leads to racemization; favored by tertiary carbons and polar protic solvents.\n\nSN2: One-step concerted backside attack; bimolecular Rate = k[Substrate][Nucleophile]; causes Walden inversion; favored by primary carbons and polar aprotic solvents.',
        hint: 'Intermediate carbocation vs concerted backside attack',
        repetitions: 4,
        interval: 10,
        easeFactor: 2.5,
        box: 4,
        nextReviewDate: new Date(Date.now() + 86400000 * 5).toISOString()
      },
      {
        id: 'card-ch2',
        deckId: 'deck-chem',
        front: 'Markovnikov Rule in Alkene Addition',
        back: 'In the addition of HX to an unsymmetrical alkene, the hydrogen atom adds to the carbon with more attached hydrogen atoms ("the rich get richer"), producing the more stable carbocation intermediate (tertiary > secondary > primary).',
        hint: 'Carbocation stability dictates regioselectivity',
        repetitions: 1,
        interval: 1,
        easeFactor: 2.5,
        box: 1,
        nextReviewDate: new Date().toISOString()
      }
    ]
  },
  {
    id: 'deck-history',
    title: 'World History & Pivotal Turning Points',
    subject: 'History',
    description: 'Treaties, industrial revolutions, constitutional milestones, and geopolitics.',
    cards: [
      {
        id: 'card-h1',
        deckId: 'deck-history',
        front: 'Treaty of Westphalia (1648) Significance',
        back: 'Concluded the Thirty Years War in the Holy Roman Empire; established the doctrine of state sovereignty (Westphalian sovereignty) asserting that each nation-state has exclusive domestic authority without external interference.',
        hint: 'Birth of modern nation-state diplomacy',
        repetitions: 3,
        interval: 8,
        easeFactor: 2.6,
        box: 3,
        nextReviewDate: new Date(Date.now() + 86400000 * 4).toISOString()
      },
      {
        id: 'card-h2',
        deckId: 'deck-history',
        front: 'Key innovations driving the First Industrial Revolution (c. 1760–1840)',
        back: '1. James Watt improved steam engine.\n2. Mechanized textile weaving (Spinning Jenny, Power Loom).\n3. Coke-smelted pig iron production.\n4. Expansion of canals and early railway networks.',
        hint: 'Transition from agrarian hand-production to steam-driven machines',
        repetitions: 2,
        interval: 4,
        easeFactor: 2.5,
        box: 2,
        nextReviewDate: new Date(Date.now() + 86400000 * 2).toISOString()
      }
    ]
  }
];
