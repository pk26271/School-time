import React, { useState } from 'react';
import { MindNode, MindEdge } from '../types';
import { Network, Plus, Trash2, ZoomIn, ZoomOut, RefreshCw, Eye } from 'lucide-react';

interface ConceptGraphWorkspaceProps {
  onAwardXp: (amount: number) => void;
}

const INITIAL_NODES: MindNode[] = [
  { id: '1', title: 'Synaptic Plasticity', category: 'Neuroscience', x: 260, y: 160, notes: 'Hebbian rule and LTP mechanisms' },
  { id: '2', title: 'NMDA Receptors', category: 'Neuroscience', x: 420, y: 120, notes: 'Coincidence detector requiring Mg2+ removal' },
  { id: '3', title: 'Dijkstra Search', category: 'Algorithms', x: 620, y: 220, notes: 'Shortest path on non-negative weights' },
  { id: '4', title: 'A* Heuristic', category: 'Algorithms', x: 440, y: 300, notes: 'Guided search with admissible h(n)' },
  { id: '5', title: 'Gibbs Free Energy', category: 'Thermodynamics', x: 180, y: 340, notes: 'Delta G = Delta H - T * Delta S' },
  { id: '6', title: 'ATP Hydrolysis', category: 'Thermodynamics', x: 280, y: 440, notes: 'Coupling endergonic reactions' },
];

const INITIAL_EDGES: MindEdge[] = [
  { id: 'e1', from: '1', to: '2', label: 'Mechanism' },
  { id: 'e2', from: '3', to: '4', label: 'Heuristic Extension' },
  { id: 'e3', from: '5', to: '6', label: 'Drives' },
  { id: 'e4', from: '2', to: '6', label: 'Energy Demand' },
];

export const ConceptGraphWorkspace: React.FC<ConceptGraphWorkspaceProps> = ({
  onAwardXp,
}) => {
  const [nodes, setNodes] = useState<MindNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<MindEdge[]>(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('1');
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeCategory, setNewNodeCategory] = useState('General');
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleAddNode = () => {
    if (!newNodeTitle.trim()) return;
    const newNode: MindNode = {
      id: `node-${Date.now()}`,
      title: newNodeTitle.trim(),
      category: newNodeCategory,
      x: 350 + Math.random() * 100 - 50,
      y: 240 + Math.random() * 100 - 50,
      notes: 'New concept node ready for exploration',
    };
    setNodes([...nodes, newNode]);
    if (selectedNodeId) {
      setEdges([
        ...edges,
        {
          id: `edge-${Date.now()}`,
          from: selectedNodeId,
          to: newNode.id,
          label: 'Relates to',
        },
      ]);
    }
    setNewNodeTitle('');
    setSelectedNodeId(newNode.id);
    onAwardXp(20);
  };

  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
    setEdges(edges.filter((e) => e.from !== id && e.to !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNodeId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes((prev) =>
      prev.map((n) => (n.id === draggedNodeId ? { ...n, x, y } : n))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <Network className="h-4 w-4" />
            <span>Interactive Concept Mind Map & Node Graph</span>
            <span aria-hidden="true">·</span>
            <span>Non-Linear Knowledge Mesh</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            Concept Node Graph
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize how principles across biology, algorithms, and physics interlock. Drag nodes to reposition.
          </p>
        </div>

        {/* Quick Add Node Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newNodeTitle}
            onChange={(e) => setNewNodeTitle(e.target.value)}
            placeholder="New concept node..."
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            onKeyDown={(e) => e.key === 'Enter' && handleAddNode()}
          />
          <button
            onClick={handleAddNode}
            disabled={!newNodeTitle.trim()}
            className="flex items-center gap-1 rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-40 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Node</span>
          </button>
        </div>
      </div>

      {/* Main Canvas + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive SVG Canvas */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-950 p-2 relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10 text-[11px] text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            Click & drag nodes to organize graph
          </div>

          <svg
            className="w-full h-[460px] cursor-grab active:cursor-grabbing select-none"
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={() => setDraggedNodeId(null)}
          >
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Render Edges */}
            {edges.map((edge) => {
              const source = nodes.find((n) => n.id === edge.from);
              const target = nodes.find((n) => n.id === edge.to);
              if (!source || !target) return null;

              const midX = (source.x + target.x) / 2;
              const midY = (source.y + target.y) / 2;

              return (
                <g key={edge.id}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="rgba(148, 163, 184, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  {edge.label && (
                    <text
                      x={midX}
                      y={midY - 6}
                      fill="#94a3b8"
                      fontSize="10"
                      textAnchor="middle"
                      className="font-mono select-none"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={() => {
                    setDraggedNodeId(node.id);
                    setSelectedNodeId(node.id);
                  }}
                  className="cursor-pointer"
                >
                  <circle
                    r={isSelected ? 26 : 22}
                    fill={isSelected ? '#f59e0b' : '#1e293b'}
                    stroke={isSelected ? '#fbbf24' : '#475569'}
                    strokeWidth={isSelected ? '3' : '2'}
                    className="transition-all duration-150"
                  />
                  <text
                    y={34}
                    fill={isSelected ? '#fde68a' : '#e2e8f0'}
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                    className="select-none"
                  >
                    {node.title}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Inspector Panel */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Concept Inspector
          </h3>

          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-semibold">
                  {selectedNode.category}
                </span>
                <h4 className="font-display text-lg font-bold text-white mt-0.5">
                  {selectedNode.title}
                </h4>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Concept Notes</label>
                <textarea
                  value={selectedNode.notes || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNodes(
                      nodes.map((n) => (n.id === selectedNode.id ? { ...n, notes: val } : n))
                    );
                  }}
                  rows={4}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Connected Concepts */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5">
                  Connected Concepts
                </span>
                <div className="space-y-1">
                  {edges
                    .filter((e) => e.from === selectedNode.id || e.to === selectedNode.id)
                    .map((e) => {
                      const otherId = e.from === selectedNode.id ? e.to : e.from;
                      const otherNode = nodes.find((n) => n.id === otherId);
                      return (
                        <div
                          key={e.id}
                          onClick={() => setSelectedNodeId(otherId)}
                          className="flex items-center justify-between text-xs p-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                        >
                          <span>{otherNode?.title}</span>
                          <span className="text-[10px] text-amber-400">{e.label || 'Linked'}</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              <button
                onClick={() => handleDeleteNode(selectedNode.id)}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 pt-2 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Node</span>
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-500 italic py-8 text-center">
              Click any node in the graph to inspect relationships and annotations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
