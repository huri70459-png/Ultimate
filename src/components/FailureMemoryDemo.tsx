import { useState, useEffect, useRef } from 'react';

interface LogEntry {
  type: 'command' | 'output' | 'warning' | 'success' | 'error' | 'info';
  text: string;
  delay: number;
}

const DEMO_SEQUENCE: LogEntry[] = [
  // Act 1: Record a failure
  { type: 'command', text: '$ brain failures --record "Used bcrypt directly instead of passlib" --tags auth,security --similarity-threshold 0.8', delay: 0 },
  { type: 'output', text: '✓ Failure recorded as #0007', delay: 600 },
  { type: 'output', text: '  Vector: [0.12, -0.34, 0.78, ...] (384-dim)', delay: 200 },
  { type: 'output', text: '  Tags: auth, security', delay: 100 },
  { type: 'output', text: '  Stored in FAISS index (now 7 entries)', delay: 200 },
  { type: 'info', text: '', delay: 400 },

  // Act 2: Run a task that would repeat the failure
  { type: 'command', text: '$ brain run "Add password hashing to the user registration endpoint"', delay: 800 },
  { type: 'output', text: '', delay: 400 },
  { type: 'info', text: '── VeriFlow Pipeline ──', delay: 300 },
  { type: 'output', text: '', delay: 200 },

  // Intent
  { type: 'info', text: '▸ Step 1/5: Intent', delay: 400 },
  { type: 'output', text: '  Parsed task: scope=password-hashing, target=user-registration', delay: 300 },
  { type: 'output', text: '  Constraints: [bounded-scope, no-new-deps-without-approval]', delay: 200 },
  { type: 'output', text: '', delay: 200 },

  // Ground — THIS is where failure memory kicks in
  { type: 'info', text: '▸ Step 2/5: Ground', delay: 500 },
  { type: 'output', text: '  ContextEngine: found auth.py, models.py, routes.py', delay: 300 },
  { type: 'output', text: '  RealityGraph: 0 active rules matching scope', delay: 200 },
  { type: 'output', text: '  FailureMemory: searching for similar past failures...', delay: 400 },
  { type: 'warning', text: '  ⚠️  FAILURE MEMORY MATCH (sim=1.00):', delay: 600 },
  { type: 'warning', text: '     "Used bcrypt directly instead of passlib"', delay: 200 },
  { type: 'warning', text: '     Tags: auth, security | Recorded: failure #0007', delay: 200 },
  { type: 'warning', text: '     → Injecting into grounding context as DO-NOT-REPEAT constraint', delay: 300 },
  { type: 'output', text: '', delay: 200 },

  // Execute — with the warning in context
  { type: 'info', text: '▸ Step 3/5: Execute', delay: 500 },
  { type: 'output', text: '  Budget check: $0.012 / $0.50 remaining ✓', delay: 200 },
  { type: 'output', text: '  LLM call #1: generate password hashing (2,847 tokens, $0.004)', delay: 400 },
  { type: 'output', text: '  Context included: DO-NOT-REPEAT warning from failure #0007', delay: 300 },
  { type: 'output', text: '  Generated: auth.py (passlib.hash.bcrypt import)', delay: 300 },
  { type: 'success', text: '  ✓ Used passlib (corrected by failure memory)', delay: 300 },
  { type: 'output', text: '', delay: 200 },

  // Validate
  { type: 'info', text: '▸ Step 4/5: Validate', delay: 500 },
  { type: 'output', text: '  Claim: "Added passlib.hash.bcrypt to auth.py"', delay: 300 },
  { type: 'success', text: '    → ✓ Verified: import present in auth.py:3', delay: 200 },
  { type: 'output', text: '  Claim: "Updated User model with password_hash field"', delay: 300 },
  { type: 'success', text: '    → ✓ Verified: field exists in models.py:14', delay: 200 },
  { type: 'output', text: '  Claim: "No direct bcrypt usage"', delay: 200 },
  { type: 'success', text: '    → ✓ Verified: grep "import bcrypt" returns 0 matches', delay: 200 },
  { type: 'output', text: '', delay: 200 },

  // Trace
  { type: 'info', text: '▸ Step 5/5: Trace', delay: 400 },
  { type: 'output', text: '  Trace #0043 appended (append-only)', delay: 200 },
  { type: 'output', text: '  Cost: $0.004 | Tokens: 2,847 | Retries: 0', delay: 200 },
  { type: 'success', text: '  Status: PASSED ✓', delay: 300 },
  { type: 'output', text: '  Replay: brain trace --id 0043', delay: 200 },
];

export default function FailureMemoryDemo() {
  const [visibleEntries, setVisibleEntries] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying) return;
    if (visibleEntries >= DEMO_SEQUENCE.length) {
      setIsPlaying(false);
      return;
    }

    const currentEntry = DEMO_SEQUENCE[visibleEntries];
    const timeout = setTimeout(() => {
      setVisibleEntries(v => v + 1);
    }, currentEntry.delay || 300);

    return () => clearTimeout(timeout);
  }, [isPlaying, visibleEntries]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [visibleEntries]);

  const startDemo = () => {
    setVisibleEntries(0);
    setHasStarted(true);
    setIsPlaying(true);
  };

  const resetDemo = () => {
    setVisibleEntries(0);
    setHasStarted(false);
    setIsPlaying(false);
  };

  const getEntryStyle = (type: LogEntry['type']) => {
    switch (type) {
      case 'command': return 'text-emerald-300 font-bold';
      case 'output': return 'text-gray-400';
      case 'warning': return 'text-amber-300';
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      case 'info': return 'text-cyan-300 font-medium';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen py-24 px-6 bg-gray-900/30">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-amber-300 to-red-300 bg-clip-text text-transparent">
            Failure Memory Loop
          </span>
        </h2>
        <p className="text-gray-500 text-center mb-4 max-w-2xl mx-auto">
          The final act: a failure is recorded, then a new task triggers the loop. Watch the system prevent repetition in real-time.
        </p>

        {/* Loop diagram */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            Record Failure
          </div>
          <span className="text-gray-600">→</span>
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
            Vector Embed
          </div>
          <span className="text-gray-600">→</span>
          <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
            Similarity Search
          </div>
          <span className="text-gray-600">→</span>
          <div className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs">
            Inject Warning
          </div>
          <span className="text-gray-600">→</span>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            Corrected Output
          </div>
          <span className="text-gray-600 text-xs">↻</span>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-6">
          {!hasStarted ? (
            <button
              onClick={startDemo}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-amber-500/20"
            >
              ▶ Run Failure Memory Demo
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-lg text-sm border border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 transition-all"
              >
                {isPlaying ? '⏸ Pause' : '▶ Resume'}
              </button>
              <button
                onClick={resetDemo}
                className="px-4 py-2 rounded-lg text-sm border border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600 transition-all"
              >
                ↺ Reset
              </button>
            </>
          )}
        </div>

        {/* Terminal */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 text-xs text-gray-500">brain — failure-memory-demo</span>
            {isPlaying && (
              <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                running
              </span>
            )}
          </div>

          {/* Terminal body */}
          <div
            ref={logRef}
            className="p-4 md:p-6 font-mono text-sm h-[500px] overflow-y-auto scroll-smooth"
          >
            {!hasStarted && (
              <div className="text-gray-600 text-center py-20">
                <p className="text-lg mb-2">Press "Run Failure Memory Demo" to begin</p>
                <p className="text-xs">Watch the system record a failure, then prevent its repetition</p>
              </div>
            )}
            {DEMO_SEQUENCE.slice(0, visibleEntries).map((entry, idx) => (
              <div
                key={idx}
                className={`${getEntryStyle(entry.type)} leading-relaxed ${
                  entry.type === 'warning' ? 'bg-amber-500/5 -mx-2 px-2 rounded' : ''
                }`}
              >
                {entry.text || '\u00A0'}
              </div>
            ))}
            {isPlaying && visibleEntries < DEMO_SEQUENCE.length && (
              <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1" />
            )}
          </div>
        </div>

        {/* Explanation cards */}
        {hasStarted && visibleEntries >= DEMO_SEQUENCE.length && (
          <div className="mt-8 grid md:grid-cols-3 gap-4 animate-in">
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <h4 className="text-sm font-bold text-red-300 mb-2">1. Failure Recorded</h4>
              <p className="text-xs text-gray-400">
                The bcrypt failure was embedded as a 384-dim vector and stored in FAISS with tags for retrieval.
              </p>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
              <h4 className="text-sm font-bold text-amber-300 mb-2">2. sim=1.00 Match</h4>
              <p className="text-xs text-gray-400">
                The new auth task scored perfect similarity. The warning was injected as a DO-NOT-REPEAT constraint.
              </p>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
              <h4 className="text-sm font-bold text-emerald-300 mb-2">3. Corrected Output</h4>
              <p className="text-xs text-gray-400">
                The LLM used passlib instead of raw bcrypt. GroundTruth verified: no direct bcrypt import. Pass.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
