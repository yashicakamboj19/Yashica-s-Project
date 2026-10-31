import React, { useState, useEffect, useCallback } from 'react';
import { soundFx } from '../utils/audio.ts';
import { Search, RotateCcw, Sparkles, Smile, Crown } from 'lucide-react';

interface GlitchDetectiveGameProps {
  onGameAction: (pointsAwarded: number, combo: number, choreUnitsEarned: number) => void;
  activeChoreTitle: string;
  onBackToTown?: () => void;
}

const HATS = [
  { id: 'party', icon: '🥳', label: 'Party Hat' },
  { id: 'crown', icon: '👑', label: 'Crown' },
  { id: 'cap', icon: '🧢', label: 'Cap' },
  { id: 'chef', icon: '👨‍🍳', label: 'Chef Hat' }
];

const EYES = [
  { id: 'glasses', icon: '😎', label: 'Shades' },
  { id: 'hearts', icon: '😍', label: 'Heart Eyes' },
  { id: 'wink', icon: '😉', label: 'Wink' },
  { id: 'happy', icon: '👀', label: 'Big Eyes' }
];

const MOUTHS = [
  { id: 'grin', icon: '😁', label: 'Big Grin' },
  { id: 'tongue', icon: '😋', label: 'Tongue' },
  { id: 'kiss', icon: '💋', label: 'Kiss Lips' },
  { id: 'laugh', icon: '😆', label: 'Laugh' }
];

interface GuessRow {
  hat: typeof HATS[number];
  eyes: typeof EYES[number];
  mouth: typeof MOUTHS[number];
  exactMatches: number;
}

export const GlitchDetectiveGame: React.FC<GlitchDetectiveGameProps> = ({
  onGameAction,
  activeChoreTitle,
  onBackToTown
}) => {
  const [secretFriend, setSecretFriend] = useState<{
    hat: typeof HATS[number];
    eyes: typeof EYES[number];
    mouth: typeof MOUTHS[number];
  }>(() => generateSecret());

  const [currentGuess, setCurrentGuess] = useState<{
    hat: typeof HATS[number];
    eyes: typeof EYES[number];
    mouth: typeof MOUTHS[number];
  }>({
    hat: HATS[0],
    eyes: EYES[0],
    mouth: MOUTHS[0]
  });

  const [history, setHistory] = useState<GuessRow[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5);

  function generateSecret() {
    return {
      hat: HATS[Math.floor(Math.random() * HATS.length)],
      eyes: EYES[Math.floor(Math.random() * EYES.length)],
      mouth: MOUTHS[Math.floor(Math.random() * MOUTHS.length)]
    };
  }

  const startNewMystery = useCallback(() => {
    setSecretFriend(generateSecret());
    setHistory([]);
    setIsSolved(false);
    setIsRevealed(false);
    setAttemptsLeft(5);
    setCurrentGuess({
      hat: HATS[0],
      eyes: EYES[0],
      mouth: MOUTHS[0]
    });
  }, []);

  const handleTestGuess = () => {
    if (isSolved || attemptsLeft <= 0) return;

    soundFx.playShoot();
    onGameAction(30, 1, 5);

    let exact = 0;
    if (currentGuess.hat.id === secretFriend.hat.id) exact++;
    if (currentGuess.eyes.id === secretFriend.eyes.id) exact++;
    if (currentGuess.mouth.id === secretFriend.mouth.id) exact++;

    const newRow: GuessRow = {
      hat: currentGuess.hat,
      eyes: currentGuess.eyes,
      mouth: currentGuess.mouth,
      exactMatches: exact
    };

    setHistory([newRow, ...history]);

    if (exact === 3) {
      setIsSolved(true);
      setIsRevealed(true);
      soundFx.playChoreComplete();
      onGameAction(500, 5, 80);
    } else {
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);
      if (remaining <= 0) {
        setIsRevealed(true);
        soundFx.playHit();
      } else {
        soundFx.playCombo(exact + 1);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50 rounded-2xl border-4 border-purple-200 overflow-hidden shadow-lg select-none text-slate-800">
      {/* Friendly Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 text-white shadow-md">
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
          <span className="text-2xl drop-shadow">🕵️</span>
          <div>
            <h4 className="font-extrabold text-base tracking-wide text-white drop-shadow-sm">
              Purble Shop Boutique
            </h4>
            <div className="text-xs text-purple-100 font-medium hidden sm:block">
              Pick the right Hat, Eyes, and Smile to reveal the hidden friend!
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full border border-white/30 text-xs font-bold text-white flex items-center gap-1.5">
            <span>Tries:</span>
            <span className={`font-black text-sm ${attemptsLeft <= 2 ? 'text-yellow-300' : 'text-white'}`}>
              {attemptsLeft}/5
            </span>
          </div>
          <button
            onClick={startNewMystery}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors cursor-pointer text-white"
            title="Start New Face"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Mystery Curtain Stage */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 border-3 border-yellow-300 shadow-md text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/50 flex items-center justify-center text-4xl shadow-inner">
              {isRevealed ? '🎉' : '🎭'}
            </div>
            <div>
              <div className="text-base font-black text-yellow-300">
                {isSolved ? '🎉 YAY! You Found The Friend!' : isRevealed ? 'Mystery Friend Revealed!' : 'Secret Friend Behind Curtain'}
              </div>
              <p className="text-xs text-purple-100 font-medium">
                {isRevealed
                  ? 'All 3 features match the mystery friend perfectly!'
                  : 'Can you guess which Hat, Eyes, and Smile they have?'}
              </p>
            </div>
          </div>

          <div className="bg-white/20 px-4 py-2.5 rounded-2xl border border-white/30 flex items-center gap-3 text-3xl">
            {isRevealed ? (
              <>
                <span>{secretFriend.hat.icon}</span>
                <span>{secretFriend.eyes.icon}</span>
                <span>{secretFriend.mouth.icon}</span>
              </>
            ) : (
              <span className="text-yellow-300 font-extrabold text-2xl tracking-widest">❓ ❓ ❓</span>
            )}
          </div>
        </div>

        {/* Current Guess Mannequin Preview */}
        <div className="bg-white rounded-2xl p-3 border-2 border-purple-200 shadow-sm flex items-center justify-between px-6">
          <span className="text-xs font-bold text-slate-500">Your Current Pick:</span>
          <div className="flex items-center gap-4 text-3xl">
            <span className="p-1 bg-purple-50 rounded-xl border border-purple-200">{currentGuess.hat.icon}</span>
            <span className="p-1 bg-purple-50 rounded-xl border border-purple-200">{currentGuess.eyes.icon}</span>
            <span className="p-1 bg-purple-50 rounded-xl border border-purple-200">{currentGuess.mouth.icon}</span>
          </div>
        </div>

        {/* Interactive Visual Pickers: Clickable Buttons (NO HTML dropdowns!) */}
        <div className="space-y-2.5 bg-white/80 p-3.5 rounded-2xl border-2 border-purple-200">
          {/* 1. Pick Hat */}
          <div>
            <span className="text-xs font-black text-purple-900 block mb-1">1. Pick a Hat:</span>
            <div className="grid grid-cols-4 gap-2">
              {HATS.map(h => (
                <button
                  key={h.id}
                  onClick={() => {
                    soundFx.playChoreProgress();
                    setCurrentGuess(g => ({ ...g, hat: h }));
                  }}
                  className={`py-2 px-2 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    currentGuess.hat.id === h.id
                      ? 'bg-purple-100 border-purple-500 text-purple-900 scale-[1.03] shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50'
                  }`}
                >
                  <span className="text-xl">{h.icon}</span>
                  <span className="hidden sm:inline">{h.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Pick Eyes */}
          <div>
            <span className="text-xs font-black text-purple-900 block mb-1">2. Pick Eyes:</span>
            <div className="grid grid-cols-4 gap-2">
              {EYES.map(e => (
                <button
                  key={e.id}
                  onClick={() => {
                    soundFx.playChoreProgress();
                    setCurrentGuess(g => ({ ...g, eyes: e }));
                  }}
                  className={`py-2 px-2 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    currentGuess.eyes.id === e.id
                      ? 'bg-purple-100 border-purple-500 text-purple-900 scale-[1.03] shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50'
                  }`}
                >
                  <span className="text-xl">{e.icon}</span>
                  <span className="hidden sm:inline">{e.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Pick Smile */}
          <div>
            <span className="text-xs font-black text-purple-900 block mb-1">3. Pick a Smile:</span>
            <div className="grid grid-cols-4 gap-2">
              {MOUTHS.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    soundFx.playChoreProgress();
                    setCurrentGuess(g => ({ ...g, mouth: m }));
                  }}
                  className={`py-2 px-2 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    currentGuess.mouth.id === m.id
                      ? 'bg-purple-100 border-purple-500 text-purple-900 scale-[1.03] shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50'
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span className="hidden sm:inline">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Previous Clues List */}
        {history.length > 0 && (
          <div className="bg-white border-2 border-purple-200 rounded-xl p-2.5 max-h-[85px] overflow-y-auto space-y-1.5 text-xs">
            {history.map((row, idx) => (
              <div key={idx} className="flex items-center justify-between p-1.5 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 text-lg">
                  <span>{row.hat.icon}</span>
                  <span>{row.eyes.icon}</span>
                  <span>{row.mouth.icon}</span>
                </div>
                <div className="font-extrabold text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full border ${
                    row.exactMatches === 3
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {row.exactMatches === 3 ? '🎉 All 3 Matched!' : `🟢 ${row.exactMatches} of 3 Correct`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Big Action Button */}
        <div>
          {isSolved || attemptsLeft <= 0 ? (
            <button
              onClick={startNewMystery}
              className="w-full py-4 px-6 rounded-2xl font-black text-sm tracking-wide bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-105 active:scale-[0.98] text-white shadow-lg cursor-pointer border-2 border-white/50"
            >
              PLAY WITH NEXT MYSTERY FRIEND! 🌟
            </button>
          ) : (
            <button
              onClick={handleTestGuess}
              className="w-full py-4 px-6 rounded-2xl font-black text-sm tracking-wide bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 hover:brightness-105 active:scale-[0.98] text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer border-2 border-white/50"
            >
              <Search className="w-5 h-5 text-yellow-300" />
              <span>CHECK MY GUESS! ({attemptsLeft} TRIES LEFT)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
