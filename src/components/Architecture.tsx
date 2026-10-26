export default function Architecture() {
  const layers = [
    {
      name: 'Persistence Layer',
      color: 'emerald',
      items: ['SQLite (rules, decisions, traces, budget)', 'FAISS Vector Index (semantic search)', 'Content-hash dedup on re-index'],
    },
    {
      name: 'Brain Modules',
      color: 'cyan',
      items: ['RealityGraph — meta/rules/ADRs', 'ContextEngine — incremental file index', 'FailureMemory — "DO NOT REPEAT" warnings', 'GroundTruth — verify claims vs files/DB', 'TokenGovernor — daily budget enforcement', 'ChangeGovernor — kill scope creep', 'QualityEngine — heuristic rubric'],
    },
    {
      name: 'VeriFlow Kernel',
      color: 'amber',
      items: ['Intent → Ground → Execute → Validate → Trace', 'Bounded retries with cost tracking', 'Budget checks before every LLM call', 'Append-only replayable traces'],
    },
    {
      name: 'Interface Layer',
      color: 'rose',
      items: ['CLI: brain init/index/run/status/rule(s)/decide/decisions/failures/trace', 'Dual backend: OpenAI (real) + Offline (deterministic)', 'Dashboard (web UI)'],
    },
  ];

  const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/30', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    cyan: { bg: 'bg-cyan-500/5', border: 'border-cyan-500/30', text: 'text-cyan-300', dot: 'bg-cyan-400' },
    amber: { bg: 'bg-amber-500/5', border: 'border-amber-500/30', text: 'text-amber-300', dot: 'bg-amber-400' },
    rose: { bg: 'bg-rose-500/5', border: 'border-rose-500/30', text: 'text-rose-300', dot: 'bg-rose-400' },
  };

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            System Architecture
          </span>
        </h2>
        <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
          Four layers, each with clear responsibility. Data flows upward; control flows downward.
        </p>

        <div className="space-y-6">
          {layers.map((layer, idx) => {
            const c = colorMap[layer.color];
            return (
              <div key={layer.name} className="relative">
                {/* Connector */}
                {idx > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-gray-700" />
                )}
                <div className={`${c.bg} border ${c.border} rounded-2xl p-6 md:p-8`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-3 h-3 rounded-full ${c.dot}`} />
                    <h3 className={`text-xl font-bold ${c.text}`}>{layer.name}</h3>
                    <span className="text-xs text-gray-600 ml-auto">Layer {idx + 1}</span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {layer.items.map(item => (
                      <div key={item} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className={`${c.text} mt-0.5`}>›</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Engineering fixes callout */}
        <div className="mt-16 bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-bold text-amber-300 mb-4">⚡ Blueprint → Implementation Fixes</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {[
              { bug: 'NameError in VectorIndex', fix: 'Fixed variable scope' },
              { bug: 'Duplicate vectors on re-index', fix: 'Content-hash incremental indexing' },
              { bug: 'Missing-key crashes on non-LLM commands', fix: 'Lazy client initialization' },
              { bug: 'Governor fails open on parse errors', fix: 'Now fails closed, gates debug tasks' },
              { bug: 'Cost accounting ignores retries', fix: 'Full cost tracking including critic calls' },
              { bug: 'Unsafe path/schema handling', fix: 'Path traversal blocked, read-only DB checks' },
            ].map(item => (
              <div key={item.bug} className="flex items-start gap-2">
                <span className="text-red-400 shrink-0">✗</span>
                <div>
                  <span className="text-red-300/80 line-through">{item.bug}</span>
                  <span className="text-emerald-400 ml-2">→ {item.fix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
