import React, { useState } from 'react';
import { VIVA_QUESTIONS, VivaItem } from '../data/initialData';
import { GraduationCap, CheckCircle, Search, HelpCircle, BookOpen, Layers } from 'lucide-react';

export const VivaGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['ALL', 'JDBC', 'OOP', 'Java Swing', 'MySQL', 'Architecture'];

  const filteredQuestions = VIVA_QUESTIONS.filter(item => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.keyPoints.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto my-4 space-y-6 font-sans text-slate-100">
      
      {/* 1. College Demo Flow Guide Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-700/60 rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Official College Presentation & Demo Flow
            </h2>
            <p className="text-xs text-blue-200">
              Follow this step-by-step order when demonstrating the mini project to your lab examiner:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
          <div className="bg-slate-800/80 p-2.5 rounded border border-blue-700/40 text-center">
            <span className="block text-[10px] text-sky-400 font-mono font-bold uppercase">Step 1</span>
            <span className="text-xs font-semibold text-white block mt-0.5">Create Account</span>
            <span className="text-[10px] text-slate-400 block mt-1">Insert Customer & Account</span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded border border-blue-700/40 text-center">
            <span className="block text-[10px] text-sky-400 font-mono font-bold uppercase">Step 2</span>
            <span className="text-xs font-semibold text-white block mt-0.5">View Account</span>
            <span className="text-[10px] text-slate-400 block mt-1">Join Query on Details</span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded border border-blue-700/40 text-center">
            <span className="block text-[10px] text-emerald-400 font-mono font-bold uppercase">Step 3</span>
            <span className="text-xs font-semibold text-white block mt-0.5">Deposit</span>
            <span className="text-[10px] text-slate-400 block mt-1">+Balance & Tx Log</span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded border border-blue-700/40 text-center">
            <span className="block text-[10px] text-indigo-400 font-mono font-bold uppercase">Step 4</span>
            <span className="text-xs font-semibold text-white block mt-0.5">Check Balance</span>
            <span className="text-[10px] text-slate-400 block mt-1">SELECT balance Query</span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded border border-blue-700/40 text-center">
            <span className="block text-[10px] text-amber-400 font-mono font-bold uppercase">Step 5</span>
            <span className="text-xs font-semibold text-white block mt-0.5">Withdraw</span>
            <span className="text-[10px] text-slate-400 block mt-1">Sufficiency Check & Tx</span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded border border-blue-700/40 text-center">
            <span className="block text-[10px] text-cyan-400 font-mono font-bold uppercase">Step 6</span>
            <span className="text-xs font-semibold text-white block mt-0.5">Transactions</span>
            <span className="text-[10px] text-slate-400 block mt-1">Swing JTable History</span>
          </div>
        </div>
      </div>

      {/* 2. Viva Exam Preparation Section */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                2nd-Year B.Tech CSE Viva Exam Question Bank
              </h3>
              <p className="text-xs text-slate-400">
                Frequently asked questions by university external examiners with precise academic answers.
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search viva questions..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-700">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-900/60 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-4 space-y-3 hover:border-slate-600 transition-all flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 uppercase tracking-wide">
                    {q.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Q#{q.id}</span>
                </div>

                <h4 className="text-xs font-bold text-white leading-snug">
                  {q.question}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {q.answer}
                </p>
              </div>

              {/* Bullet Key Points for quick recall during viva */}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Examiner Key Scoring Points:
                </span>
                <ul className="space-y-1">
                  {q.keyPoints.map((point, idx) => (
                    <li key={idx} className="text-[11px] text-emerald-300 flex items-start gap-1.5 font-medium">
                      <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
