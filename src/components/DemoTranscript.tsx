import { useState } from 'react';

interface DemoScenario {
  title: string;
  status: 'pass' | 'reject' | 'abort';
  statusColor: string;
  command: string;
  description: string;
  output: string[];
  keyInsight: string;
}

const SCENARIOS: DemoScenario[] = [
  {
    title: 'Scoped Task — Auth Module',
    status: 'pass',
    statusColor: 'emerald',
    command: 'brain run "Add user authentication to the FastAPI app"',
    description: 'A well-scoped task that falls within project boundaries.',
    output: [
      'Intent: scope=auth, target=FastAPI app',
      'Ground: 3 files retrieved, 0 failure memories, 0 blocking rules',
      'Execute: 1 LLM call, $0.003, 2,340 tokens',
      'Validate: 4/4 claims verified against files',
      '  ✓ auth.py created with JWT endpoints',
      '  ✓ main.py updated with auth router import',
      '  ✓ models.py has User model with password_hash',
      '  ✓ No direct bcrypt import (passlib used)',
      'Trace #0041 appended. Status: PASSED',
    ],
    keyInsight: 'Every claim was evidence-verified against actual files. No hallucinated imports.',
  },
  {
    title: 'Rule Violation — Auth Rewrite',
    status: 'reject',
    statusColor: 'red',
    command: 'brain run "Rewrite auth to use plain-text passwords for simplicity"',
    description: 'A task that violates an active critical rule.',
    output: [
      'Intent: scope=auth-rewrite, approach=plain-text-passwords',
      'ChangeGovernor: checking against active rules...',
      '  ✗ BLOCKED by rule "all-auth-must-use-oauth2" (CRITICAL)',
      '  Rule ADR-003: "All authentication must use OAuth2 + JWT"',
      '  Plain-text passwords violate security baseline',
      '',
      'Task REJECTED pre-execution. No LLM tokens spent.',
      'Trace #0042 appended. Status: REJECTED (rule violation)',
    ],
    keyInsight: 'Rejected before any LLM call. Zero cost. ChangeGovernor fails closed.',
  },
  {
    title: 'Vague Task — "Fix Everything"',
    status: 'reject',
    statusColor: 'red',
    command: 'brain run "Fix everything in the project"',
    description: 'An unbounded, vague task with no clear scope.',
    output: [
      'Intent: scope=UNBOUNDED, target=everything',
      'ChangeGovernor: scope analysis...',
      '  ✗ REJECTED: Task has no bounded scope',
      '  Cannot determine: which files? what kind of fixes? acceptance criteria?',
      '  Suggestion: break into specific tasks with clear boundaries',
      '',
      'Task REJECTED pre-execution. No LLM tokens spent.',
      'Trace #0043 appended. Status: REJECTED (vague scope)',
    ],
    keyInsight: 'Scope creep protection catches vague requests. Forces specificity before execution.',
  },
  {
    title: 'Budget Exhaustion',
    status: 'abort',
    statusColor: 'amber',
    command: 'BRAIN_DAILY_BUDGET=0 brain run "Add a feature"',
    description: 'Running with zero budget to test the TokenGovernor.',
    output: [
      'Intent: scope=feature (unspecified)',
      'TokenGovernor: budget check...',
      '  Daily budget: $0.00',
      '  Spent today: $0.00',
      '  Remaining: $0.00',
      '  ✗ ABORT: Budget exhausted before first LLM call',
      '',
      'Task ABORTED. No LLM tokens spent.',
      'Trace #0044 appended. Status: ABORTED (budget)',
    ],
    keyInsight: 'Budget check happens BEFORE any LLM call. Hard enforcement, not advisory.',
  },
  {
    title: 'Failure Memory Injection',
    status: 'pass',
    statusColor: 'emerald',
    command: 'brain run "Add password hashing to user registration"',
    description: 'A task similar to a previously recorded failure. Watch the correction.',
    output: [
      'Intent: scope=password-hashing, target=user-registration',
      'Ground: 3 files, 1 failure memory match',
      '  ⚠️ FAILURE MEMORY (sim=1.00):',
      '     "Used bcrypt directly instead of passlib" [failure #0007]',
      '     → Injected as DO-NOT-REPEAT constraint',
      '',
      'Execute: LLM call with failure warning in context',
      '  Generated: auth.py using passlib.hash.bcrypt (corrected)',
      'Validate: 3/3 claims verified',
      '  ✓ passlib imported (not raw bcrypt)',
      '  ✓ User model updated',
      '  ✓ No "import bcrypt" found in any file',
      '',
      'Trace #0045 appended. Status: PASSED (corrected by failure memory)',
    ],
    keyInsight: 'The system remembered a past mistake and prevented its repetition. sim=1.00 match.',
  },
];

const statusColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/30', text: 'text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-300' },
  red: { bg: 'bg-red-500/5', border: 'border-red-500/30', text: 'text-red-300', badge: 'bg-red-500/20 text-red-300' },
  amber: { bg: 'bg-amber-500/5', border: 'border-amber-500/30', text: 'text-amber-300', badge: 'bg-amber-500/20 text-amber-300' },
};

export default function DemoTranscript() {
  const [activeScenario, setActiveScenario] = useState(0);
  const scenario = SCENARIOS[activeScenario];
  const c = statusColors[scenario.statusColor];

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            Live Demo Transcript
          </span>
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
          Five scenarios from <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">demo_raywiki/</code> — each verified, each traced.
        </p>

        {/* Scenario tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {SCENARIOS.map((s, idx) => {
            const sc = statusColors[s.statusColor];
            return (
              <button
                key={s.title}
                onClick={() => setActiveScenario(idx)}
                className={`px-3 py-2 rounded-lg text-xs border transition-all ${
                  idx === activeScenario
                    ? `${sc.bg} ${sc.border} ${sc.text}`
                    : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700'
                }`}
              >
                {s.status === 'pass' ? '✓' : s.status === 'reject' ? '✗' : '⊘'} {s.title}
              </button>
            );
          })}
        </div>

        {/* Active scenario */}
        <div className={`rounded-2xl border ${c.border} ${c.bg} overflow-hidden`}>
          {/* Header */}
          <div className="p-6 border-b border-gray-800/50">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${c.badge}`}>
                {scenario.status.toUpperCase()}
              </span>
              <h3 className={`text-lg font-bold ${c.text}`}>{scenario.title}</h3>
            </div>
            <p className="text-sm text-gray-400">{scenario.description}</p>
            <div className="mt-3 bg-gray-950/80 rounded-lg px-4 py-2 font-mono text-sm text-emerald-300">
              {scenario.command}
            </div>
          </div>

          {/* Output */}
          <div className="p-6">
            <div className="space-y-1 font-mono text-sm">
              {scenario.output.map((line, idx) => (
                <div
                  key={idx}
                  className={`${
                    line.startsWith('  ✓') ? 'text-emerald-400' :
                    line.startsWith('  ✗') ? 'text-red-400' :
                    line.startsWith('  ⚠') ? 'text-amber-300' :
                    line.startsWith('Task') || line.startsWith('Trace') ? 'text-gray-300 font-medium' :
                    line === '' ? 'h-2' :
                    'text-gray-400'
                  }`}
                >
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
          </div>

          {/* Key insight */}
          <div className="px-6 pb-6">
            <div className="bg-gray-950/50 rounded-xl p-4 border border-gray-800/50">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Key Insight</span>
              <p className="text-sm text-gray-300 mt-1">{scenario.keyInsight}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-3">
          {SCENARIOS.map((s, idx) => {
            const sc = statusColors[s.statusColor];
            return (
              <div key={idx} className={`text-center p-3 rounded-xl border ${sc.bg} ${sc.border}`}>
                <div className={`text-lg font-bold ${sc.text}`}>
                  {s.status === 'pass' ? '✓' : s.status === 'reject' ? '✗' : '⊘'}
                </div>
                <div className="text-xs text-gray-500 mt-1">{s.status}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
