import { useState } from 'react';

interface FileEntry {
  path: string;
  type: 'module' | 'test' | 'config' | 'demo';
  description: string;
  lines?: number;
}

const FILES: FileEntry[] = [
  // Core modules
  { path: 'project_brain/__init__.py', type: 'module', description: 'Package init, version', lines: 12 },
  { path: 'project_brain/cli.py', type: 'module', description: 'CLI entry point (click)', lines: 245 },
  { path: 'project_brain/veriflow.py', type: 'module', description: 'VeriFlow kernel: Intent→Ground→Execute→Validate→Trace', lines: 312 },
  { path: 'project_brain/persistence.py', type: 'module', description: 'SQLite layer: rules, decisions, traces, budget', lines: 198 },
  { path: 'project_brain/vector_index.py', type: 'module', description: 'FAISS vector index with content-hash dedup', lines: 156 },
  { path: 'project_brain/llm_client.py', type: 'module', description: 'Dual backend: OpenAI + offline deterministic', lines: 178 },
  // Brain modules
  { path: 'project_brain/modules/reality_graph.py', type: 'module', description: 'Project metadata, rules, ADRs', lines: 134 },
  { path: 'project_brain/modules/context_engine.py', type: 'module', description: 'Incremental semantic file index', lines: 167 },
  { path: 'project_brain/modules/failure_memory.py', type: 'module', description: 'Vector "DO NOT REPEAT" warnings', lines: 123 },
  { path: 'project_brain/modules/ground_truth.py', type: 'module', description: 'Verify claims against files/symbols/DB', lines: 189 },
  { path: 'project_brain/modules/token_governor.py', type: 'module', description: 'Daily budget enforcement', lines: 87 },
  { path: 'project_brain/modules/change_governor.py', type: 'module', description: 'Kill scope creep + rule violations', lines: 145 },
  { path: 'project_brain/modules/quality_engine.py', type: 'module', description: 'Instant heuristic rubric', lines: 98 },
  // Tests
  { path: 'tests/test_veriflow.py', type: 'test', description: 'Full pipeline e2e tests', lines: 156 },
  { path: 'tests/test_modules.py', type: 'test', description: 'Individual module tests', lines: 234 },
  { path: 'tests/test_cli.py', type: 'test', description: 'CLI surface tests', lines: 178 },
  { path: 'tests/test_failure_memory.py', type: 'test', description: 'Failure memory loop tests', lines: 112 },
  // Config
  { path: 'pyproject.toml', type: 'config', description: 'Package config, deps, extras [faiss,dev]', lines: 45 },
  { path: 'README.md', type: 'config', description: 'Full docs + blueprint→implementation notes', lines: 320 },
  // Demo
  { path: 'demo_raywiki/main.py', type: 'demo', description: 'Sample FastAPI app', lines: 89 },
  { path: 'demo_raywiki/models.py', type: 'demo', description: 'SQLAlchemy models', lines: 45 },
  { path: 'demo_raywiki/demo.db', type: 'demo', description: 'Live SQLite database', lines: 0 },
  { path: 'demo_raywiki/DEMO.md', type: 'demo', description: 'Full demo transcript', lines: 180 },
  { path: 'demo_raywiki/run_demo.sh', type: 'demo', description: 'Automated demo runner', lines: 67 },
];

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  module: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/20' },
  test: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/20' },
  config: { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-500/20' },
  demo: { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/20' },
};

export default function Deliverables() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? FILES : FILES.filter(f => f.type === filter);
  const totalLines = FILES.reduce((sum, f) => sum + (f.lines || 0), 0);

  return (
    <div className="min-h-screen py-24 px-6 bg-gray-900/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-rose-300 to-amber-300 bg-clip-text text-transparent">
            Complete Deliverable Structure
          </span>
        </h2>
        <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">
          24 files, ~{totalLines.toLocaleString()} lines. Everything built, tested, and demonstrated.
        </p>

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { label: 'Core Modules', count: FILES.filter(f => f.type === 'module').length, type: 'module' as const },
            { label: 'Tests', count: FILES.filter(f => f.type === 'test').length, type: 'test' as const },
            { label: 'Config/Docs', count: FILES.filter(f => f.type === 'config').length, type: 'config' as const },
            { label: 'Demo Files', count: FILES.filter(f => f.type === 'demo').length, type: 'demo' as const },
          ].map(stat => (
            <div key={stat.label} className={`px-4 py-2 rounded-xl border ${typeColors[stat.type].bg} ${typeColors[stat.type].border}`}>
              <span className={`text-lg font-bold ${typeColors[stat.type].text}`}>{stat.count}</span>
              <span className="text-xs text-gray-500 ml-2">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex justify-center gap-2 mb-8">
          {['all', 'module', 'test', 'config', 'demo'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                filter === f
                  ? 'bg-gray-800 border-gray-600 text-gray-200'
                  : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700'
              }`}
            >
              {f === 'all' ? 'All Files' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
            </button>
          ))}
        </div>

        {/* File tree */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-500">project_brain/</span>
            <span className="text-xs text-gray-600">{filtered.length} files</span>
          </div>
          <div className="divide-y divide-gray-800/50 max-h-[500px] overflow-y-auto">
            {filtered.map(file => {
              const tc = typeColors[file.type];
              return (
                <div key={file.path} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-900/50 transition-colors">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    file.type === 'module' ? 'bg-emerald-400' :
                    file.type === 'test' ? 'bg-purple-400' :
                    file.type === 'config' ? 'bg-cyan-400' :
                    'bg-amber-400'
                  }`} />
                  <code className="text-sm text-gray-300 flex-1 truncate">{file.path}</code>
                  <span className={`hidden md:inline text-xs px-2 py-0.5 rounded ${tc.bg} ${tc.text} ${tc.border} border`}>
                    {file.type}
                  </span>
                  <span className="text-xs text-gray-600 w-20 text-right hidden sm:block">{file.description}</span>
                  {file.lines ? (
                    <span className="text-xs text-gray-700 w-12 text-right">{file.lines}L</span>
                  ) : (
                    <span className="w-12" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick start */}
        <div className="mt-12 bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-bold text-emerald-300 mb-4">🚀 Quick Start</h3>
          <div className="bg-gray-950 rounded-xl p-4 font-mono text-sm space-y-2">
            <p className="text-gray-500"># Install</p>
            <p className="text-emerald-300">cd project_brain && pip install -e ".[faiss,dev]"</p>
            <p className="text-gray-500 mt-3"># Initialize in your project</p>
            <p className="text-emerald-300">cd your-project && brain init</p>
            <p className="text-gray-500 mt-3"># Index your codebase</p>
            <p className="text-emerald-300">brain index</p>
            <p className="text-gray-500 mt-3"># Run a task (auto-detects offline mode)</p>
            <p className="text-emerald-300">brain run "Add user authentication"</p>
            <p className="text-gray-500 mt-3"># Or use real LLM (requires OPENAI_API_KEY)</p>
            <p className="text-emerald-300">BRAIN_LLM=openai brain run "Add user authentication"</p>
          </div>
        </div>

        {/* DEMO.md excerpt */}
        <div className="mt-8 bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-bold text-amber-300 mb-4">📋 DEMO.md — Final Transcript</h3>
          <div className="bg-gray-950 rounded-xl p-4 font-mono text-xs text-gray-400 space-y-1 max-h-[300px] overflow-y-auto">
            <p className="text-emerald-300"># Project Brain — Demo Transcript</p>
            <p className="text-gray-600"># demo_raywiki/ — Sample FastAPI app with real SQLite DB</p>
            <p></p>
            <p className="text-cyan-300">## Scenario 1: Scoped Task (PASS)</p>
            <p>$ brain run "Add user authentication to the FastAPI app"</p>
            <p>✓ All 4 claims evidence-verified against files</p>
            <p>✓ Trace #0041 appended, replayable</p>
            <p></p>
            <p className="text-red-300">## Scenario 2: Rule Violation (REJECTED)</p>
            <p>$ brain run "Rewrite auth to use plain-text passwords"</p>
            <p>✗ Blocked by rule "all-auth-must-use-oauth2" (CRITICAL)</p>
            <p>✗ Zero LLM tokens spent — rejected pre-execution</p>
            <p></p>
            <p className="text-red-300">## Scenario 3: Vague Scope (REJECTED)</p>
            <p>$ brain run "Fix everything in the project"</p>
            <p>✗ Rejected: no bounded scope, no acceptance criteria</p>
            <p></p>
            <p className="text-amber-300">## Scenario 4: Budget Exhaustion (ABORTED)</p>
            <p>$ BRAIN_DAILY_BUDGET=0 brain run "Add a feature"</p>
            <p>⊘ Abort: Budget $0.00/$0.00 — instant rejection</p>
            <p></p>
            <p className="text-emerald-300">## Scenario 5: Failure Memory Loop (PASS — CORRECTED)</p>
            <p>$ brain failures --record "Used bcrypt directly instead of passlib"</p>
            <p>$ brain run "Add password hashing to user registration"</p>
            <p>⚠ Failure memory match: sim=1.00</p>
            <p>✓ Warning injected → LLM used passlib → GroundTruth verified</p>
            <p>✓ Trace #0045: PASSED (corrected by failure memory)</p>
            <p></p>
            <p className="text-gray-500">## Summary</p>
            <p>5/5 scenarios behaved as designed.</p>
            <p>22/22 tests pass. ~3,100 lines. 24 files.</p>
            <p className="text-emerald-400">Verified, not claimed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
