import React from 'react';
import { LeaderboardEntry } from '../types.ts';
import { Trophy } from 'lucide-react';

interface LeaderboardViewProps {
  leaderboard: LeaderboardEntry[];
  userPoints: number;
  userChoresCompleted: number;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  leaderboard,
  userPoints,
  userChoresCompleted
}) => {
  return (
    <div className="bg-white/90 rounded-2xl border-3 border-amber-200 p-4 shadow-md text-slate-800">
      <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-amber-100">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <h3 className="text-sm font-black text-slate-900">
            Chore Heroes High Scores
          </h3>
        </div>
        <div className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
          Your Chores Cleaned: {userChoresCompleted} 🎉
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {leaderboard.slice(0, 3).map((item, index) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all ${
              item.isUser
                ? 'bg-amber-100 border-amber-400 font-black text-amber-950 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </span>
              <div>
                <div className="text-xs font-extrabold truncate max-w-[120px]">
                  {item.username}
                </div>
                <div className="text-[10px] text-slate-500 font-bold">
                  {item.choresCompleted} Chores Cleaned
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-black text-purple-700">
                {item.points.toLocaleString()} ⭐
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
