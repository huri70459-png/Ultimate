import { useState } from 'react';

interface Module {
  name: string;
  icon: string;
  color: string;
  purpose: string;
  mechanism: string;
  example: string;
}

const MODULES: Module[] = [
  {
    name: 'RealityGraph',
    icon: '🗺️',
    color: 'emerald',
    purpose: 'Stores project metadata, rules, and Architecture Decision Records (ADRs).',
    mechanism: 'Rules are matched against tasks pre-execution. Active rules gate what the executor can do.',
    example: 'Rule "all-auth-must-use-oauth2" → blocks any task proposing bcrypt-only auth.',
  },
  {
    name: 'ContextEngine',
    icon: '📚',
    color: 'cyan',
    purpose: 'Incremental semantic file index. Knows what files exist, what symbols they contain.',
    mechanism: 'Content-hash dedup means re-indexing only processes changed files. Vector similarity finds relevant context.',
    example: 'Task mentions "auth" → retrieves main.py, auth.py, models.py with relevant line ranges.',
  },
  {
    name: 'FailureMemory',
    icon: '⚠️',
    color: 'amber',
    purpose: 'Vector store of past failures. "DO NOT REPEAT" warnings injected into grounding.',
    mechanism: 'On each new task, top-k similar failures are retrieved. If similarity > threshold, warning is injected.',
    example: 'sim=1.00 match: "DO NOT use bcrypt directly — use passlib.hash.bcrypt" → injected into context.',
  },
  {
    name: 'GroundTruth',
    icon: '🔬',
    color: 'purple',
    purpose: 'Verifies every claim the LLM makes against actual files, symbols, and live DB schemas.',
    mechanism: 'Parses claims from output, checks file existence, symbol presence, schema conformance.',
    example: 'Claim "updated users table" → checks SQLite schema → REJECTED: no "users" table exists.',
  },
  {
    name: 'TokenGovernor',
    icon: '💰',
    color: 'rose',
    purpose: 'Enforces daily token/cost budget. Prevents runaway LLM spending.',
    mechanism: 'Tracks cumulative cost per day. Pre-check before every LLM call. Hard abort if exceeded.',
    example: 'BRAIN_DAILY_BUDGET=0 → instant abort with "Budget exhausted: $0.00/$0.00".',
  },
  {
    name: 'ChangeGovernor',
    icon: '🛡️',
    color: 'blue',
    purpose: 'Kills scope creep and rule violations before execution begins.',
    mechanism: 'Compares task scope against project boundaries and active rules. Fails closed on parse errors.',
    example: 'Task "fix everything" → REJECTED: too vague, no bounded scope. Task violating rule → REJECTED.',
  },
  {
    name: 'QualityEngine',
    icon: '⭐',
    color: 'pink',
    purpose: 'Instant heuristic rubric for output quality. No LLM needed.',
    mechanism: 'Checks: file count reasonable, imports valid, no TODO markers, tests referenced, etc.',
    example: 'Output has 3 files, all imports resolve, no TODOs → quality_score: 0.85 (PASS).',
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/30', text: 'text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-300' },
  cyan: { bg: 'bg-cyan-500/5', border: 'border-cyan-500/30', text: 'text-cyan-300', badge: 'bg-cyan-500/20 text-cyan-300' },
  amber: { bg: 'bg-amber-500/5', border: 'border-amber-500/30', text: 'text-amber-300', badge: 'bg-amber-500/20 text-amber-300' },
  purple: { bg: 'bg-purple-500/5', border: 'border-purple-500/30', text: 'text-purple-300', badge: 'bg-purple-500/20 text-purple-300' },
  rose: { bg: 'bg-rose-500/5', border: 'border-rose-500/30', text: 'text-rose-300', badge: 'bg-rose-500/20 text-rose-300' },
  blue: { bg: 'bg-blue-500/5', border: 'border-blue-500/30', text: 'text-blue-300', badge: 'bg-blue-500/20 text-blue-300' },
  pink: { bg: 'bg-pink-500/5', border: 'border-pink-500/30', text: 'text-pink-300', badge: 'bg-pink-500/20 text-pink-300' },
};

export default function BrainModules() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            7 Brain Modules
          </span>
        </h2>
        <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
          Each module has a single responsibility. Together they form the cognitive layer that grounds every LLM call in reality.
        </p>

        {/* Module grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {MODULES.map((mod, idx) => {
            const c = colorMap[mod.color];
            const isSelected = selected === idx;
            return (
              <button
                key={mod.name}
                onClick={() => setSelected(isSelected ? null : idx)}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? `${c.bg} ${c.border} shadow-lg scale-[1.02]`
                    : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{mod.icon}</span>
                  <span className={`font-bold ${isSelected ? c.text : 'text-gray-200'}`}>{mod.name}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{mod.purpose}</p>
              </button>
            );
          })}
        </div>

        {/* Selected module detail */}
        {selected !== null && (
          <div className={`rounded-2xl border p-6 md:p-8 transition-all duration-300 ${colorMap[MODULES[selected].color].bg} ${colorMap[MODULES[selected].color].border}`}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{MODULES[selected].icon}</span>
              <div>
                <h3 className={`text-2xl font-bold ${colorMap[MODULES[selected].color].text}`}>
                  {MODULES[selected].name}
                </h3>
                <span className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${colorMap[MODULES[selected].color].badge}`}>
                  Brain Module
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-300 mb-1">Purpose</h4>
                <p className="text-sm text-gray-400">{MODULES[selected].purpose}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-300 mb-1">Mechanism</h4>
                <p className="text-sm text-gray-400">{MODULES[selected].mechanism}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-300 mb-1">Example</h4>
                <div className="bg-gray-950/80 rounded-lg p-3 font-mono text-xs text-gray-300">
                  {MODULES[selected].example}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
