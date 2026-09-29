import React from 'react';
import { JdbcLogEntry } from '../types/bank';
import { Terminal, Trash2, Cpu, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface JdbcConsoleProps {
  logs: JdbcLogEntry[];
  onClearLogs: () => void;
}

export const JdbcConsole: React.FC<JdbcConsoleProps> = ({ logs, onClearLogs }) => {
  return (
    <div className="w-full max-w-6xl mx-auto my-4 space-y-3 font-mono text-slate-100">
      
      {/* Console Header */}
      <div className="bg-slate-900 border border-slate-700 rounded-t-lg px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <div className="flex items-center gap-2 ml-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-slate-200">
              JDBC & MySQL Execution Trace Console
            </span>
            <span className="text-[10px] bg-blue-900/50 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded">
              java.sql.PreparedStatement
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400">
            {logs.length} Event(s) Logged
          </span>
          <button
            onClick={onClearLogs}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
            title="Clear logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div className="bg-slate-950 border-x border-b border-slate-800 rounded-b-lg p-4 font-mono text-xs overflow-y-auto max-h-[500px] space-y-2.5 shadow-xl">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-2.5 rounded bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-1.5"
          >
            {/* Log Header */}
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                {log.status === 'SUCCESS' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                {log.status === 'ERROR' && <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                {log.status === 'INFO' && <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />}

                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  log.type === 'EXECUTE_UPDATE'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                    : log.type === 'EXECUTE_QUERY'
                    ? 'bg-sky-950 text-sky-300 border border-sky-800/60'
                    : log.type === 'PREPARED_STMT'
                    ? 'bg-purple-950 text-purple-300 border border-purple-800/60'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {log.type}
                </span>

                <span className="text-slate-400 font-sans">{log.details}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px]">
                <span>{log.durationMs}ms</span>
                <span>•</span>
                <span>{log.timestamp}</span>
              </div>
            </div>

            {/* SQL Query if present */}
            {log.sql && (
              <div className="bg-slate-950 p-2 rounded border border-slate-800/80 text-[11px] text-sky-300 font-semibold overflow-x-auto">
                <span className="text-slate-500 select-none mr-2">SQL:</span>
                {log.sql}
              </div>
            )}

            {/* Parameters if present */}
            {log.params && log.params.length > 0 && (
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-slate-950/60 px-2 py-1 rounded">
                <span className="text-slate-500 select-none">PARAMS:</span>
                {log.params.map((p, idx) => (
                  <span key={idx} className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-200">
                    ?{idx + 1} = {typeof p === 'string' ? `'${p}'` : p}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {logs.length === 0 && (
          <div className="py-12 text-center text-slate-500 italic">
            <Cpu className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
            No JDBC queries recorded yet. Perform an action in the Java Swing GUI above to watch live PreparedStatement execution.
          </div>
        )}
      </div>

    </div>
  );
};
