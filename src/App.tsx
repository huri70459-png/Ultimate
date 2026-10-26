import { useState } from 'react';
import Hero from './components/Hero';
import VeriFlowPipeline from './components/VeriFlowPipeline';
import BrainModules from './components/BrainModules';
import FailureMemoryDemo from './components/FailureMemoryDemo';
import DemoTranscript from './components/DemoTranscript';
import Architecture from './components/Architecture';
import Deliverables from './components/Deliverables';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [
    { id: 'hero', label: 'Overview' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'veriflow', label: 'VeriFlow' },
    { id: 'modules', label: 'Brain Modules' },
    { id: 'failure-memory', label: 'Failure Memory' },
    { id: 'demo', label: 'Demo' },
    { id: 'deliverables', label: 'Deliverables' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <span className="text-gray-950 font-bold text-sm">PB</span>
            </div>
            <span className="text-emerald-400 font-bold text-lg">Project Brain</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                  activeSection === item.id
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-gray-400 hover:text-emerald-300 hover:bg-gray-800/50'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Sections */}
      <main>
        <section id="hero"><Hero /></section>
        <section id="architecture"><Architecture /></section>
        <section id="veriflow"><VeriFlowPipeline /></section>
        <section id="modules"><BrainModules /></section>
        <section id="failure-memory"><FailureMemoryDemo /></section>
        <section id="demo"><DemoTranscript /></section>
        <section id="deliverables"><Deliverables /></section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>Project Brain — The AI Operating System • ~3,100 lines • 24 files • 22/22 tests passing</p>
        <p className="mt-2 text-gray-600">SQLite + Vector Persistence → 7 Brain Modules → VeriFlow Kernel → CLI + Dashboard</p>
      </footer>
    </div>
  );
}
