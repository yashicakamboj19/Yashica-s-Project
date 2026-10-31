import React from 'react';
import { Volume2, VolumeX, Download } from 'lucide-react';

interface NavbarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  points: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMuted,
  onToggleMute,
  points
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b-3 border-purple-200 bg-white/95 backdrop-blur sticky top-0 z-40 shadow-xs select-none">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <span className="text-3xl animate-bounce">🎪</span>
        <div>
          <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent leading-none">
            Chore Arcade
          </h1>
          <p className="text-xs text-slate-500 font-bold hidden sm:block mt-0.5">
            Play 3 cute mini-games to clean up your chores! ✨
          </p>
        </div>
      </div>

      {/* Score & Sound & Download Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 border-2 border-amber-300 text-xs font-black text-amber-950 shadow-xs">
          <span className="text-base">⭐</span>
          <span className="tabular-nums text-sm">{points.toLocaleString()} Points</span>
        </div>

        {/* 1-click download code zip to PC */}
        <a
          href="/chore-arcade-source.zip"
          download="chore-arcade-source.zip"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors text-xs font-bold shadow-xs cursor-pointer"
          title="Download project source code zip to your computer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Save Zip to PC</span>
        </a>

        <button
          onClick={onToggleMute}
          className="p-2 text-purple-900 bg-purple-50 border-2 border-purple-200 rounded-full hover:bg-purple-100 transition-colors cursor-pointer shadow-xs"
          title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-purple-600" />}
        </button>
      </div>
    </header>
  );
};
