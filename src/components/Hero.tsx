import { useEffect, useState } from 'react';

const TAGLINES = [
  'Ground every claim against reality.',
  'Never repeat a failure.',
  'Kill scope creep before it starts.',
  'Budget every LLM call.',
  'Trace every decision, replayable.',
];

export default function Hero() {
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTaglineIdx(i => (i + 1) % TAGLINES.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-300 text-sm">22/22 tests passing • Verified, not claimed</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            Project Brain
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-4">The AI Operating System</p>

        {/* Rotating tagline */}
        <div className="h-10 mb-10">
          <p className={`text-lg text-emerald-400/80 transition-all duration-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            → {TAGLINES[taglineIdx]}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
          {[
            { value: '~3,100', label: 'Lines of Code' },
            { value: '24', label: 'Files' },
            { value: '7', label: 'Brain Modules' },
            { value: '22/22', label: 'Tests Pass' },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-emerald-300">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Architecture summary */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3">
            <span className="text-emerald-400">SQLite</span> + <span className="text-cyan-400">Vector Persistence</span> → <span className="text-purple-400">7 Brain Modules</span> → <span className="text-amber-400">VeriFlow Kernel</span> → <span className="text-rose-400">CLI + Dashboard</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['RealityGraph', 'ContextEngine', 'FailureMemory', 'GroundTruth', 'TokenGovernor', 'ChangeGovernor', 'QualityEngine'].map(m => (
              <span key={m} className="px-3 py-1 rounded-full bg-gray-800 text-xs text-gray-300 border border-gray-700">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 animate-bounce">
          <svg className="w-6 h-6 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
