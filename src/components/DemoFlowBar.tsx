import React from 'react';
import { ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface DemoFlowBarProps {
  currentStep: number;
  onSetStep: (step: number) => void;
  onSelectOperation: (op: string) => void;
}

export const DemoFlowBar: React.FC<DemoFlowBarProps> = ({
  currentStep,
  onSetStep,
  onSelectOperation,
}) => {
  const steps = [
    { num: 1, title: 'Create Account', op: 'CREATE', desc: 'Insert customer & opening balance' },
    { num: 2, title: 'View Account', op: 'VIEW', desc: 'Relational query & profile check' },
    { num: 3, title: 'Deposit', op: 'DEPOSIT', desc: 'Credit amount & log transaction' },
    { num: 4, title: 'Check Balance', op: 'BALANCE', desc: 'SELECT balance query' },
    { num: 5, title: 'Withdraw', op: 'WITHDRAW', desc: 'Validate sufficiency & debit' },
    { num: 6, title: 'Transactions', op: 'TRANSACTIONS', desc: 'JTable chronological view' },
    { num: 7, title: 'Verify MySQL', op: 'DB', desc: 'Show changes reflected in DB' },
  ];

  return (
    <div className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-3 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            College Presentation Demo Flow:
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Click any step to auto-navigate the Swing GUI
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const prev = Math.max(1, currentStep - 1);
              onSetStep(prev);
              onSelectOperation(steps[prev - 1].op);
            }}
            disabled={currentStep === 1}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 text-[11px] font-medium border border-slate-700 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-[11px] font-mono text-slate-400 px-1">
            Step {currentStep} of {steps.length}
          </span>
          <button
            onClick={() => {
              const next = Math.min(steps.length, currentStep + 1);
              onSetStep(next);
              onSelectOperation(steps[next - 1].op);
            }}
            disabled={currentStep === steps.length}
            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 text-[11px] font-semibold transition-colors"
          >
            Next Step →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
        {steps.map(s => {
          const isActive = currentStep === s.num;
          const isPassed = currentStep > s.num;

          return (
            <button
              key={s.num}
              onClick={() => {
                onSetStep(s.num);
                onSelectOperation(s.op);
              }}
              className={`p-2 rounded text-left transition-all border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-1 ring-blue-400'
                  : isPassed
                  ? 'bg-slate-800/90 text-slate-300 border-slate-700 hover:border-slate-600'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
                <span className={isActive ? 'text-blue-100 font-bold' : isPassed ? 'text-emerald-400' : 'text-slate-500'}>
                  #{s.num}
                </span>
                {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-xs font-semibold leading-tight truncate">
                {s.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
