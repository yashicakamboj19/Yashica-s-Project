import React from 'react';
import { Sparkles, Trophy, Volume2, VolumeX } from 'lucide-react';

interface TownMapProps {
  onSelectGame: (game: 'cakes' | 'pairs' | 'shop') => void;
  activeChoreTitle: string;
  activeChoreProgress: number;
  points: number;
  choresCleared: number;
}

export const TownMap: React.FC<TownMapProps> = ({
  onSelectGame,
  activeChoreTitle,
  activeChoreProgress,
  points,
  choresCleared
}) => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 select-none bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-400 min-h-[580px] flex flex-col justify-between">
      {/* Sky with Sun, Fluffy Clouds & Rainbow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Rainbow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] border-[18px] border-pink-400/40 rounded-t-full border-b-0 pointer-events-none">
          <div className="w-full h-full border-[18px] border-amber-300/40 rounded-t-full border-b-0">
            <div className="w-full h-full border-[18px] border-emerald-300/40 rounded-t-full border-b-0">
              <div className="w-full h-full border-[18px] border-sky-300/40 rounded-t-full border-b-0" />
            </div>
          </div>
        </div>

        {/* Happy Sun */}
        <div className="absolute top-6 right-10 flex items-center justify-center animate-spin" style={{ animationDuration: '40s' }}>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.8)] border-2 border-yellow-100 flex items-center justify-center text-2xl">
            ☀️
          </div>
        </div>

        {/* Floating Clouds */}
        <div className="absolute top-10 left-12 bg-white/90 rounded-full px-6 py-3 shadow-md border border-sky-100 flex items-center gap-2">
          <span className="text-xl">☁️</span>
          <span className="text-xs font-black text-sky-800">Sunny Day in Chore Town</span>
        </div>

        <div className="absolute top-20 right-36 bg-white/80 rounded-full px-4 py-2 shadow-sm border border-sky-100 hidden sm:flex items-center gap-1.5">
          <span className="text-sm">☁️</span>
          <span className="text-[11px] font-bold text-sky-700">Clean Air</span>
        </div>

        {/* Rolling Green Hills in the background */}
        <div className="absolute bottom-28 -left-20 -right-20 h-44 bg-emerald-500/80 rounded-t-[100%] pointer-events-none" />
        <div className="absolute bottom-16 -left-10 -right-10 h-40 bg-emerald-400 rounded-t-[120%] pointer-events-none" />
        
        {/* Cobblestone winding path */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-36 bg-amber-200/90 border-x-4 border-dashed border-amber-300/80 rounded-t-full shadow-inner pointer-events-none" />
      </div>

      {/* Top Welcome Signpost */}
      <div className="relative z-10 pt-5 px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Wooden Welcome Sign */}
        <div className="bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-700/80 rounded-2xl px-6 py-2.5 shadow-lg flex items-center gap-3">
          <span className="text-3xl animate-bounce">🎪</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight leading-none drop-shadow-xs">
              Welcome to Purble Place!
            </h2>
            <p className="text-xs font-bold text-amber-800 mt-0.5">
              Click a building to play a game & clean your chores!
            </p>
          </div>
        </div>

        {/* Chore Status TV monitor on top right */}
        <div className="bg-slate-900/90 border-4 border-amber-400 rounded-2xl px-4 py-2 text-white shadow-xl flex items-center gap-3">
          <span className="text-2xl animate-pulse">🧹</span>
          <div>
            <div className="text-[10px] font-black uppercase text-amber-300">
              Active Chore: {activeChoreTitle.split(' ')[0]} {activeChoreTitle.split(' ')[1]}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-24 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${activeChoreProgress}%` }}
                />
              </div>
              <span className="text-xs font-black text-emerald-300">{activeChoreProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Iconic Purble Place Buildings */}
      <div className="relative z-10 px-3 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-end max-w-5xl mx-auto w-full">
        
        {/* BUILDING 1: Comfy Cakes Bakery 🧁 */}
        <button
          onClick={() => onSelectGame('cakes')}
          className="group relative flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 text-center focus:outline-none"
        >
          {/* Floating name badge */}
          <div className="mb-2 bg-pink-500 text-white font-black text-xs px-3 py-1 rounded-full border-2 border-white shadow-md group-hover:bg-pink-600 transition-colors flex items-center gap-1.5">
            <span>🧁</span>
            <span className="truncate max-w-[120px] sm:max-w-none">Comfy Cakes</span>
          </div>

          {/* Bakery House Graphic (Purble Place Style Layer Cake House) */}
          <div className="relative w-36 sm:w-44 h-48 sm:h-52 bg-gradient-to-b from-pink-200 via-pink-100 to-amber-100 rounded-3xl border-4 border-pink-400 shadow-2xl flex flex-col items-center justify-between p-3 overflow-hidden group-hover:shadow-[0_15px_30px_rgba(244,114,182,0.6)] transition-shadow">
            {/* Cake Roof / Frosting Drips */}
            <div className="w-full bg-pink-400 h-10 rounded-2xl flex items-center justify-center border-b-4 border-pink-500 relative shadow-sm">
              <span className="text-2xl -mt-4 animate-bounce">🍒</span>
              <div className="absolute -bottom-2 left-4 w-4 h-4 bg-pink-400 rounded-full border-b-2 border-pink-500" />
              <div className="absolute -bottom-3 left-14 w-4 h-5 bg-pink-400 rounded-full border-b-2 border-pink-500" />
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-pink-400 rounded-full border-b-2 border-pink-500" />
            </div>

            {/* Candy Windows */}
            <div className="flex items-center gap-4 my-2">
              <div className="w-10 h-10 rounded-full bg-amber-200 border-3 border-pink-400 flex items-center justify-center shadow-inner text-base">
                🍰
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-200 border-3 border-pink-400 flex items-center justify-center shadow-inner text-base">
                🍪
              </div>
            </div>

            {/* Bakery Door */}
            <div className="w-16 h-20 bg-amber-800 rounded-t-full border-3 border-amber-950 flex flex-col items-center justify-end pb-1 shadow-md">
              <div className="w-3 h-3 rounded-full bg-yellow-400 border border-amber-950 self-end mr-2" />
              <div className="w-12 h-1 bg-amber-700 mb-1" />
            </div>

            {/* Click to play prompt */}
            <div className="absolute bottom-1 bg-white/90 text-pink-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-pink-300 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Bake Cakes!
            </div>
          </div>
        </button>

        {/* BUILDING 2: Purble Pairs Schoolhouse 🃏 */}
        <button
          onClick={() => onSelectGame('pairs')}
          className="group relative flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 text-center focus:outline-none"
        >
          {/* Floating name badge */}
          <div className="mb-2 bg-sky-500 text-white font-black text-xs px-3 py-1 rounded-full border-2 border-white shadow-md group-hover:bg-sky-600 transition-colors flex items-center gap-1.5">
            <span>🃏</span>
            <span className="truncate max-w-[120px] sm:max-w-none">Purble Pairs</span>
          </div>

          {/* School House Graphic */}
          <div className="relative w-36 sm:w-44 h-50 sm:h-56 bg-gradient-to-b from-sky-200 via-blue-100 to-indigo-100 rounded-3xl border-4 border-sky-400 shadow-2xl flex flex-col items-center justify-between p-3 overflow-hidden group-hover:shadow-[0_15px_30px_rgba(56,189,248,0.6)] transition-shadow">
            {/* Clocktower Bell Roof */}
            <div className="w-20 bg-amber-400 h-12 rounded-t-2xl flex flex-col items-center justify-center border-3 border-amber-600 relative shadow-sm">
              <div className="w-6 h-6 rounded-full bg-white border-2 border-amber-600 flex items-center justify-center text-[10px] font-black text-amber-900">
                ⏰
              </div>
            </div>

            {/* School Signboard with Cards */}
            <div className="w-full bg-sky-300 py-1.5 rounded-xl border-2 border-sky-500 flex items-center justify-center gap-2 shadow-xs">
              <div className="w-6 h-8 bg-white rounded border-2 border-sky-500 flex items-center justify-center text-xs font-black text-blue-700 shadow-xs">
                ⭐
              </div>
              <div className="w-6 h-8 bg-white rounded border-2 border-sky-500 flex items-center justify-center text-xs font-black text-blue-700 shadow-xs">
                ⭐
              </div>
            </div>

            {/* School Double Door */}
            <div className="w-18 h-22 bg-indigo-900 rounded-t-xl border-3 border-indigo-950 flex items-center justify-around px-1 shadow-md">
              <div className="w-6 h-16 bg-indigo-800 rounded-t border border-indigo-700" />
              <div className="w-6 h-16 bg-indigo-800 rounded-t border border-indigo-700" />
            </div>

            {/* Click to play prompt */}
            <div className="absolute bottom-1 bg-white/90 text-sky-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-sky-300 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Match Cards!
            </div>
          </div>
        </button>

        {/* BUILDING 3: Purble Shop Boutique 🕵️ */}
        <button
          onClick={() => onSelectGame('shop')}
          className="group relative flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 text-center focus:outline-none"
        >
          {/* Floating name badge */}
          <div className="mb-2 bg-purple-600 text-white font-black text-xs px-3 py-1 rounded-full border-2 border-white shadow-md group-hover:bg-purple-700 transition-colors flex items-center gap-1.5">
            <span>🕵️</span>
            <span className="truncate max-w-[120px] sm:max-w-none">Purble Shop</span>
          </div>

          {/* Boutique House Graphic (Velvet Curtain & Awning) */}
          <div className="relative w-36 sm:w-44 h-48 sm:h-52 bg-gradient-to-b from-purple-200 via-purple-100 to-indigo-100 rounded-3xl border-4 border-purple-500 shadow-2xl flex flex-col items-center justify-between p-3 overflow-hidden group-hover:shadow-[0_15px_30px_rgba(168,85,247,0.6)] transition-shadow">
            {/* Striped Canopy Awning */}
            <div className="w-full h-10 rounded-2xl border-b-4 border-purple-600 flex overflow-hidden shadow-sm">
              <div className="flex-1 bg-purple-600" />
              <div className="flex-1 bg-yellow-300" />
              <div className="flex-1 bg-purple-600" />
              <div className="flex-1 bg-yellow-300" />
              <div className="flex-1 bg-purple-600" />
              <div className="flex-1 bg-yellow-300" />
            </div>

            {/* Mystery Window with Face Mask */}
            <div className="w-16 h-12 bg-purple-950 rounded-2xl border-3 border-yellow-300 flex items-center justify-center text-2xl shadow-inner animate-pulse">
              🎭
            </div>

            {/* Boutique Stage Door with Gold Curtain */}
            <div className="w-18 h-20 bg-gradient-to-b from-purple-800 to-purple-950 rounded-t-2xl border-3 border-yellow-400 flex flex-col items-center justify-between p-1 shadow-md">
              <span className="text-yellow-300 text-xs font-black">❓</span>
              <div className="w-12 h-1 bg-yellow-400/60 mb-1" />
            </div>

            {/* Click to play prompt */}
            <div className="absolute bottom-1 bg-white/90 text-purple-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Guess the Face!
            </div>
          </div>
        </button>

      </div>

      {/* Ground flowers & Grass Details */}
      <div className="relative z-10 px-8 pb-4 flex items-center justify-between text-lg text-emerald-800 font-black">
        <div className="flex items-center gap-3">
          <span>🌼</span>
          <span>🍄</span>
          <span>🌸</span>
        </div>

        <div className="bg-white/90 border-2 border-emerald-400 px-4 py-1 rounded-full text-xs font-black text-emerald-900 shadow-sm flex items-center gap-2">
          <span>🏆 Chores Cleaned: {choresCleared}</span>
          <span>·</span>
          <span>⭐ Points: {points.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-3">
          <span>🌸</span>
          <span>🍄</span>
          <span>🌼</span>
        </div>
      </div>
    </div>
  );
};
