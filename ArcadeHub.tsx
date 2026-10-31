import React, { useState } from 'react';
import { CakeFactoryGame } from './CakeFactoryGame.tsx';
import { MemoryPairsGame } from './MemoryPairsGame.tsx';
import { GlitchDetectiveGame } from './GlitchDetectiveGame.tsx';
import { TownMap } from './TownMap.tsx';
import { soundFx } from '../utils/audio.ts';

export type MiniGameMode = 'town' | 'bakery' | 'memory' | 'detective';

interface ArcadeHubProps {
  onGameAction: (pointsAwarded: number, combo: number, choreUnitsEarned: number) => void;
  activeChoreTitle: string;
  activeChoreProgress?: number;
  points?: number;
  choresCleared?: number;
}

export const ArcadeHub: React.FC<ArcadeHubProps> = ({
  onGameAction,
  activeChoreTitle,
  activeChoreProgress = 0,
  points = 0,
  choresCleared = 0
}) => {
  const [selectedGame, setSelectedGame] = useState<MiniGameMode>('town');

  const games = [
    {
      id: 'town' as const,
      name: 'Purble Town',
      emoji: '🏡',
      subtitle: 'The 3 iconic houses',
      color: 'border-amber-400 bg-amber-100 text-amber-950 ring-amber-300'
    },
    {
      id: 'bakery' as const,
      name: 'Comfy Cakes',
      emoji: '🧁',
      subtitle: 'Bake conveyor cakes',
      color: 'border-pink-500 bg-pink-100 text-pink-950 ring-pink-300'
    },
    {
      id: 'memory' as const,
      name: 'Purble Pairs',
      emoji: '🃏',
      subtitle: 'Match cute cards',
      color: 'border-sky-500 bg-sky-100 text-sky-950 ring-sky-300'
    },
    {
      id: 'detective' as const,
      name: 'Purble Shop',
      emoji: '🕵️',
      subtitle: 'Guess secret face',
      color: 'border-purple-500 bg-purple-100 text-purple-950 ring-purple-300'
    }
  ];

  const handleSelectTab = (gameId: MiniGameMode) => {
    soundFx.playShoot();
    setSelectedGame(gameId);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Cheerful Navigation Bar matching Purble Place */}
      <div className="bg-white/95 p-2 sm:p-2.5 rounded-2xl border-3 border-purple-200 shadow-md">
        <div className="grid grid-cols-4 gap-2">
          {games.map((g) => {
            const isCurrent = selectedGame === g.id;
            return (
              <button
                key={g.id}
                onClick={() => handleSelectTab(g.id)}
                className={`py-2 px-1.5 rounded-xl border-2 sm:border-3 transition-all flex flex-col items-center justify-center text-center cursor-pointer relative shadow-xs ${
                  isCurrent
                    ? `${g.color} shadow-md scale-[1.02] ring-3`
                    : 'bg-slate-50 border-slate-200 hover:border-purple-300 text-slate-600 hover:bg-white'
                }`}
              >
                <div className="text-2xl sm:text-3xl mb-0.5 drop-shadow-xs">{g.emoji}</div>
                <div className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate max-w-full">
                  {g.name}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 hidden md:block mt-0.5 truncate max-w-full">
                  {g.subtitle}
                </div>
                {isCurrent && (
                  <span className="text-[9px] text-purple-800 font-black mt-0.5 bg-white/90 px-1.5 py-0.2 rounded-full border border-purple-200 shadow-2xs">
                    ACTIVE
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Game Stage / Town Map */}
      <div className="flex-1 flex flex-col min-h-[500px]">
        {selectedGame === 'town' && (
          <TownMap
            onSelectGame={(gameKey) => {
              soundFx.playShoot();
              if (gameKey === 'cakes') setSelectedGame('bakery');
              else if (gameKey === 'pairs') setSelectedGame('memory');
              else if (gameKey === 'shop') setSelectedGame('detective');
            }}
            activeChoreTitle={activeChoreTitle}
            activeChoreProgress={activeChoreProgress}
            points={points}
            choresCleared={choresCleared}
          />
        )}

        {selectedGame === 'bakery' && (
          <CakeFactoryGame
            onGameAction={onGameAction}
            activeChoreTitle={activeChoreTitle}
            onBackToTown={() => setSelectedGame('town')}
          />
        )}

        {selectedGame === 'memory' && (
          <MemoryPairsGame
            onGameAction={onGameAction}
            activeChoreTitle={activeChoreTitle}
            onBackToTown={() => setSelectedGame('town')}
          />
        )}

        {selectedGame === 'detective' && (
          <GlitchDetectiveGame
            onGameAction={onGameAction}
            activeChoreTitle={activeChoreTitle}
            onBackToTown={() => setSelectedGame('town')}
          />
        )}
      </div>
    </div>
  );
};
