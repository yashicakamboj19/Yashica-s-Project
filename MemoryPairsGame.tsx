import React, { useState, useEffect, useCallback } from 'react';
import { soundFx } from '../utils/audio.ts';
import { Eye, RotateCcw, Sparkles, Trophy, Heart } from 'lucide-react';

interface MemoryPairsGameProps {
  onGameAction: (pointsAwarded: number, combo: number, choreUnitsEarned: number) => void;
  activeChoreTitle: string;
  onBackToTown?: () => void;
}

interface CardItem {
  id: number;
  pairKey: string;
  icon: string;
  label: string;
  bgGradient: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const FUN_SYMBOLS = [
  { pairKey: 'puppy', icon: '🐶', label: 'Puppy', bgGradient: 'from-amber-200 to-orange-300' },
  { pairKey: 'kitty', icon: '🐱', label: 'Kitty', bgGradient: 'from-pink-200 to-rose-300' },
  { pairKey: 'icecream', icon: '🍦', label: 'Ice Cream', bgGradient: 'from-cyan-200 to-blue-300' },
  { pairKey: 'pizza', icon: '🍕', label: 'Pizza', bgGradient: 'from-yellow-200 to-amber-300' },
  { pairKey: 'star', icon: '⭐', label: 'Star', bgGradient: 'from-yellow-300 to-amber-400' },
  { pairKey: 'cupcake', icon: '🧁', label: 'Cupcake', bgGradient: 'from-purple-200 to-pink-300' }
];

export const MemoryPairsGame: React.FC<MemoryPairsGameProps> = ({
  onGameAction,
  activeChoreTitle,
  onBackToTown
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchesFound, setMatchesFound] = useState<number>(0);
  const [turns, setTurns] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [sneakPeekUsed, setSneakPeekUsed] = useState<boolean>(false);
  const [isSneaking, setIsSneaking] = useState<boolean>(false);
  const [boardsCleared, setBoardsCleared] = useState<number>(0);

  const initBoard = useCallback(() => {
    const deck: CardItem[] = [];
    let idCounter = 1;

    FUN_SYMBOLS.forEach((sym) => {
      deck.push({
        id: idCounter++,
        pairKey: sym.pairKey,
        icon: sym.icon,
        label: sym.label,
        bgGradient: sym.bgGradient,
        isFlipped: false,
        isMatched: false
      });
      deck.push({
        id: idCounter++,
        pairKey: sym.pairKey,
        icon: sym.icon,
        label: sym.label,
        bgGradient: sym.bgGradient,
        isFlipped: false,
        isMatched: false
      });
    });

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMatchesFound(0);
    setTurns(0);
    setCombo(0);
    setIsLocked(false);
    setSneakPeekUsed(false);
    setIsSneaking(false);
  }, []);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  const handleSneakPeek = () => {
    if (sneakPeekUsed || isLocked) return;
    soundFx.playOverdrive();
    setSneakPeekUsed(true);
    setIsSneaking(true);

    setTimeout(() => {
      setIsSneaking(false);
    }, 1500);
  };

  const handleCardClick = (index: number) => {
    if (isLocked || isSneaking) return;
    const card = cards[index];
    if (card.isMatched || card.isFlipped) return;

    soundFx.playShoot();

    const nextCards = [...cards];
    nextCards[index].isFlipped = true;
    setCards(nextCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setTurns((t) => t + 1);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = nextCards[firstIdx];
      const secondCard = nextCards[secondIdx];

      if (firstCard.pairKey === secondCard.pairKey) {
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        soundFx.playCombo(nextCombo * 2);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);
          setMatchesFound((m) => {
            const newM = m + 1;
            const earnedPoints = 150 * nextCombo;
            const earnedUnits = 25 * nextCombo;
            onGameAction(earnedPoints, nextCombo, earnedUnits);

            if (newM === FUN_SYMBOLS.length) {
              soundFx.playChoreComplete();
              setBoardsCleared((bc) => bc + 1);
              onGameAction(500, nextCombo + 5, 80);
              setTimeout(() => initBoard(), 2000);
            }
            return newM;
          });
        }, 450);
      } else {
        soundFx.playHit();
        setCombo(0);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-sky-50 via-indigo-50 to-pink-50 rounded-2xl border-4 border-sky-200 overflow-hidden shadow-xl select-none text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 text-white shadow-md">
        <div className="flex items-center gap-2.5">
          {onBackToTown && (
            <button
              onClick={onBackToTown}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 border border-white/30"
              title="Return to Purble Place Town Map"
            >
              <span>🏡</span>
              <span>Town Map</span>
            </button>
          )}
          <span className="text-2xl drop-shadow">🃏</span>
          <div>
            <h4 className="font-extrabold text-base tracking-wide text-white drop-shadow-sm">
              Purble Pairs School
            </h4>
            <div className="text-xs text-sky-100 font-medium hidden sm:block">
              Match the cute cards to tidy up your chores!
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
            <span>Turns:</span>
            <span className="text-yellow-200 font-extrabold text-sm">{turns}</span>
          </div>
          <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
            <span>Pairs:</span>
            <span className="text-emerald-200 font-extrabold text-sm">{matchesFound}/{FUN_SYMBOLS.length}</span>
          </div>
          {combo > 1 && (
            <div className="bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full font-black animate-bounce shadow">
              🔥 x{combo}!
            </div>
          )}
        </div>
      </div>

      {/* Main Board */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Card Grid */}
        <div className="grid grid-cols-4 gap-3 flex-1 min-h-[280px]">
          {cards.map((card, index) => {
            const isRevealed = card.isFlipped || card.isMatched || isSneaking;

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                disabled={card.isMatched || isLocked || isSneaking}
                className={`relative rounded-2xl border-3 transition-all duration-200 flex flex-col items-center justify-center p-2 cursor-pointer shadow-md ${
                  card.isMatched
                    ? 'bg-emerald-100 border-emerald-400 opacity-60 scale-[0.96]'
                    : isRevealed
                    ? `bg-gradient-to-br ${card.bgGradient} border-white shadow-lg scale-[1.03]`
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-white hover:scale-[1.04] hover:shadow-lg'
                }`}
              >
                {isRevealed ? (
                  <div className="flex flex-col items-center justify-center animate-in zoom-in-75 duration-150">
                    <span className="text-3xl mb-1 drop-shadow">{card.icon}</span>
                    <span className="text-xs font-extrabold text-slate-800 text-center leading-tight">
                      {card.label}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/40 shadow-inner">
                      <span className="text-xl text-yellow-300 font-black drop-shadow">⭐</span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Sneak Peek Power-up Bar */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSneakPeek}
            disabled={sneakPeekUsed || isLocked}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer shadow-md ${
              !sneakPeekUsed
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-105 active:scale-[0.98] text-amber-950 border-white'
                : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <Eye className="w-5 h-5 text-amber-800" />
            <span>{!sneakPeekUsed ? '✨ Sneak Peek All Cards! (Ready)' : 'Sneak Peek Used'}</span>
          </button>

          <button
            onClick={initBoard}
            className="py-3 px-4 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border-2 border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
