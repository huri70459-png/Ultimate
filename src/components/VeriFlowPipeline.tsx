import { useState, useEffect, useCallback } from 'react';

interface PipelineStep {
  name: string;
  label: string;
  description: string;
  detail: string;
  icon: string;
  color: string;
}

const STEPS: PipelineStep[] = [
  {
    name: 'intent',
    label: 'Intent',
    description: 'Parse the user request into a structured task with scope, constraints, and acceptance criteria.',
    detail: '$ brain run "Add user authentication to the FastAPI app"\n→ Parsed: scope=auth, constraints=[no-scope-creep], criteria=[login, logout, JWT]',
    icon: '🎯',
    color: 'emerald',
  },
  {
    name: 'ground',
    label: 'Ground',
    description: 'Retrieve relevant context: files, symbols, DB schemas, existing rules, and failure memories.',
    detail: 'ContextEngine: found main.py, models.py, auth.py (stale)\nFailureMemory: ⚠ sim=1.00 "DO NOT use bcrypt directly — use passlib"\nRealityGraph: rule "all-auth-must-use-oauth2" ACTIVE',
    icon: '🔍',
    color: 'cyan',
  },
  {
    name: 'execute',
    label: 'Execute',
    description: 'Generate the solution with budget check before every LLM call. Bounded retries on failure.',
    detail: 'Budget check: $0.003 / $0.50 remaining ✓\nLLM call #1: generate auth module (2,340 tokens, $0.003)\nRetry policy: max 2 retries, backoff 1s',
    icon: '⚡',
    color: 'amber',
  },
  {
    name: 'validate',
    label: 'Validate',
    description: 'GroundTruth verifies every claim against actual files, symbols, and live DB schemas.',
    detail: 'Claim: "Added JWT auth to main.py" → ✓ file exists, import present\nClaim: "Updated users table" → ✗ schema mismatch: no "users" table in DB\n→ Validation FAILED, triggering retry with correction',
    icon: '✓',
    color: 'purple',
  },
  {
    name: 'trace',
    label: 'Trace',
    description: 'Append-only record of the full pipeline: intent, context, calls, costs, validation results.',
    detail: 'Trace #0042 appended:\n  intent: "Add user authentication"\n  grounded: 3 files, 1 failure-memory, 1 rule\n  executed: 1 LLM call, $0.003\n  validated: 1/2 claims passed\n  status: PARTIAL (retry queued)\n  replayable: brain trace --id 0042',
    icon: '📋',
    color: 'rose',
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-300', glow: 'shadow-emerald-500/20' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', text: 'text-cyan-300', glow: 'shadow-cyan-500/20' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-300', glow: 'shadow-amber-500/20' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/40', text: 'text-purple-300', glow: 'shadow-purple-500/20' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/40', text: 'text-rose-300', glow: 'shadow-rose-500/20' },
};

export default function VeriFlowPipeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const nextStep = useCallback(() => {
    setActiveStep(s => (s + 1) % STEPS.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextStep, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextStep]);

  return (
    <div className="min-h-screen py-24 px-6 bg-gray-900/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
            VeriFlow Kernel
          </span>
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
          Intent → Ground → Execute → Validate → Trace. Every step bounded, every cost tracked, every decision replayable.
        </p>

        {/* Pipeline visualization */}
        <div className="flex items-center justify-center gap-1 md:gap-2 mb-12 flex-wrap">
          {STEPS.map((step, idx) => {
            const c = colorClasses[step.color];
            const isActive = idx === activeStep;
            return (
              <div key={step.name} className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={() => { setActiveStep(idx); setIsAutoPlaying(false); }}
                  className={`px-3 md:px-5 py-2 md:py-3 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? `${c.bg} ${c.border} ${c.text} shadow-lg ${c.glow} scale-105`
                      : 'bg-gray-900/50 border-gray-700 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  <span className="text-lg md:text-xl">{step.icon}</span>
                  <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium">{step.label}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <span className={`text-xs ${idx < activeStep ? 'text-emerald-500' : 'text-gray-700'}`}>→</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-4 py-2 rounded-lg text-sm border transition-all ${
              isAutoPlaying
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            {isAutoPlaying ? '⏸ Pause' : '▶ Auto-play'}
          </button>
          <button
            onClick={nextStep}
            className="px-4 py-2 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600 transition-all"
          >
            Next →
          </button>
        </div>

        {/* Active step detail */}
        <div className={`rounded-2xl border p-6 md:p-8 transition-all duration-300 ${colorClasses[STEPS[activeStep].color].bg} ${colorClasses[STEPS[activeStep].color].border}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{STEPS[activeStep].icon}</span>
            <div>
              <h3 className={`text-xl font-bold ${colorClasses[STEPS[activeStep].color].text}`}>
                Step {activeStep + 1}: {STEPS[activeStep].label}
              </h3>
              <p className="text-gray-400 text-sm">{STEPS[activeStep].description}</p>
            </div>
          </div>
          <div className="bg-gray-950/80 rounded-xl p-4 font-mono text-sm">
            <pre className="text-gray-300 whitespace-pre-wrap overflow-x-auto">{STEPS[activeStep].detail}</pre>
          </div>
        </div>

        {/* Key properties */}
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {[
            { title: 'Bounded Retries', desc: 'Max 2 retries with exponential backoff. No infinite loops.', icon: '🔄' },
            { title: 'Budget-First', desc: 'Every LLM call checks remaining budget. Abort if insufficient.', icon: '💰' },
            { title: 'Append-Only Traces', desc: 'Every decision recorded. Replay any trace with `brain trace --id N`.', icon: '📜' },
          ].map(prop => (
            <div key={prop.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <span className="text-2xl">{prop.icon}</span>
              <h4 className="text-sm font-bold text-gray-200 mt-2">{prop.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{prop.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
