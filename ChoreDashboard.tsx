import React, { useRef, useEffect } from 'react';
import { Chore, ChoreLog } from '../types.ts';
import { CheckCircle2, Sparkles, Heart, Trophy } from 'lucide-react';

interface ChoreDashboardProps {
  activeChore: Chore;
  choresList: Chore[];
  logs: ChoreLog[];
  onSelectChore: (choreId: string) => void;
  onClearLogs: () => void;
}

export const ChoreDashboard: React.FC<ChoreDashboardProps> = ({
  activeChore,
  choresList,
  logs,
  onSelectChore,
  onClearLogs
}) => {
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const getCategoryEmoji = (cat: Chore['category']) => {
    switch (cat) {
      case 'email': return '✉️';
      case 'code': return '🐛';
      case 'files': return '📁';
      case 'system': return '🗑️';
      case 'cloud': return '📸';
      default: return '🧹';
    }
  };

  const progressPercent = Math.min(100, Math.round((activeChore.completedUnits / activeChore.totalUnits) * 100));

  return (
    <div className="flex flex-col h-full bg-white/95 rounded-2xl border-4 border-amber-200 overflow-hidden shadow-lg text-slate-800 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 text-white shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl drop-shadow">🧹</span>
          <div>
            <h4 className="font-black text-base tracking-wide text-white drop-shadow-sm">
              Chore Being Cleaned
            </h4>
            <div className="text-xs text-amber-100 font-medium">
              Every game move sweeps away real clutter!
            </div>
          </div>
        </div>

        <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-black border border-white/30">
          ✨ Live Tracker
        </span>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Chore Selector: Click any to switch what you're cleaning */}
        <div>
          <span className="text-xs font-extrabold text-slate-600 block mb-2">
            Pick which chore you want to clean:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {choresList.map((c) => {
              const isCurrent = c.id === activeChore.id;
              const isDone = c.status === 'completed';
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectChore(c.id)}
                  className={`p-2.5 rounded-xl border-2 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-100 border-amber-500 text-amber-950 scale-[1.02] shadow-xs'
                      : isDone
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 hover:border-amber-300 text-slate-700'
                  }`}
                >
                  <span className="text-lg">{getCategoryEmoji(c.category)}</span>
                  <span className="truncate">{c.title.split(' ')[0]} {c.title.split(' ')[1]}</span>
                  {isDone && <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1 rounded-full ml-auto">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Chore Card with Huge Progress Bar */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-pink-50 p-4 rounded-2xl border-3 border-amber-300 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getCategoryEmoji(activeChore.category)}</span>
              <div>
                <h3 className="font-black text-base text-slate-900 leading-tight">
                  {activeChore.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeChore.description}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-3xl font-black text-purple-600 drop-shadow-sm tabular-nums">
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Big Candy Progress Bar */}
          <div className="w-full h-6 bg-slate-100 rounded-full overflow-hidden border-2 border-amber-300 p-0.5 shadow-inner mt-3">
            <div
              className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-pink-400 via-amber-400 to-emerald-400 shadow-md relative overflow-hidden"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-2 px-1">
            <span>Cleaned: {activeChore.completedUnits.toLocaleString()} / {activeChore.totalUnits.toLocaleString()} {activeChore.unitLabel}</span>
            <span className="text-pink-600 font-black">+Reward: {activeChore.pointsAwarded.toLocaleString()} Pts ⭐</span>
          </div>
        </div>

        {/* Recent Happy Cleaning Activity */}
        <div className="bg-slate-50 rounded-2xl p-3 border-2 border-slate-200 flex-1 min-h-[140px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-black text-slate-700 mb-1.5 px-1">
            <span>✨ Recent Cleaning Activity:</span>
            <button
              onClick={onClearLogs}
              className="text-[11px] text-slate-400 hover:text-rose-500 font-bold cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div
            ref={logContainerRef}
            className="space-y-1.5 overflow-y-auto max-h-[120px] p-1 text-xs"
          >
            {logs.slice(-6).map((log) => (
              <div
                key={log.id}
                className="p-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-700 flex items-center gap-2 shadow-xs"
              >
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
