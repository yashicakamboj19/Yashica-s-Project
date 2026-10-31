import React, { useState } from 'react';
import { soundFx } from '../utils/audio.ts';
import { RotateCcw, Check, Sparkles, ChevronRight, Heart, Star, Award } from 'lucide-react';

interface CakeFactoryGameProps {
  onGameAction: (pointsAwarded: number, combo: number, choreUnitsEarned: number) => void;
  activeChoreTitle: string;
  onBackToTown?: () => void;
}

const SHAPES = [
  { id: 'heart', name: 'Heart', icon: '❤️', borderClass: 'rounded-2xl' },
  { id: 'circle', name: 'Round', icon: '🟢', borderClass: 'rounded-full' },
  { id: 'square', name: 'Square', icon: '🟨', borderClass: 'rounded-xl' }
];

const FLAVORS = [
  { id: 'vanilla', name: 'Vanilla Cream', color: '#FEF08A', textColor: '#854D0E', emoji: '🍦' },
  { id: 'strawberry', name: 'Sweet Strawberry', color: '#F472B6', textColor: '#831843', emoji: '🍓' },
  { id: 'choco', name: 'Rich Chocolate', color: '#92400E', textColor: '#FFFFFF', emoji: '🍫' }
];

const ICINGS = [
  { id: 'mint', name: 'Mint Frosting', color: '#6EE7B7', labelColor: 'text-emerald-700' },
  { id: 'berry', name: 'Blueberry Glaze', color: '#93C5FD', labelColor: 'text-blue-700' },
  { id: 'rose', name: 'Pink Icing', color: '#F9A8D4', labelColor: 'text-pink-700' }
];

const TOPPINGS = [
  { id: 'cherry', name: 'Sweet Cherry', icon: '🍒' },
  { id: 'sprinkles', name: 'Rainbow Sprinkles', icon: '🌈' },
  { id: 'star', name: 'Gold Star', icon: '⭐' }
];

interface CakeOrder {
  id: number;
  shape: typeof SHAPES[number];
  flavor: typeof FLAVORS[number];
  icing: typeof ICINGS[number];
  topping: typeof TOPPINGS[number];
}

export const CakeFactoryGame: React.FC<CakeFactoryGameProps> = ({
  onGameAction,
  activeChoreTitle,
  onBackToTown
}) => {
  const [currentOrder, setCurrentOrder] = useState<CakeOrder>(() => generateRandomOrder(1));
  const [orderCount, setOrderCount] = useState<number>(0);
  const [conveyorPosition, setConveyorPosition] = useState<number>(0); // 0 to 3
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | null }>({ text: '', type: null });

  const [builtCake, setBuiltCake] = useState<{
    shape?: typeof SHAPES[number];
    flavor?: typeof FLAVORS[number];
    icing?: typeof ICINGS[number];
    topping?: typeof TOPPINGS[number];
  }>({});

  function generateRandomOrder(id: number): CakeOrder {
    const s = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const f = FLAVORS[Math.floor(Math.random() * FLAVORS.length)];
    const i = ICINGS[Math.floor(Math.random() * ICINGS.length)];
    const t = TOPPINGS[Math.floor(Math.random() * TOPPINGS.length)];
    return { id, shape: s, flavor: f, icing: i, topping: t };
  }

  const handleSelectShape = (shape: typeof SHAPES[number]) => {
    soundFx.playChoreProgress();
    setBuiltCake(prev => ({ ...prev, shape }));
    onGameAction(25, 1, 5);
  };

  const handleSelectFlavor = (flavor: typeof FLAVORS[number]) => {
    soundFx.playChoreProgress();
    setBuiltCake(prev => ({ ...prev, flavor }));
    onGameAction(25, 1, 5);
  };

  const handleSelectIcing = (icing: typeof ICINGS[number]) => {
    soundFx.playChoreProgress();
    setBuiltCake(prev => ({ ...prev, icing }));
    onGameAction(25, 1, 5);
  };

  const handleSelectTopping = (topping: typeof TOPPINGS[number]) => {
    soundFx.playChoreProgress();
    setBuiltCake(prev => ({ ...prev, topping }));
    onGameAction(25, 1, 5);
  };

  const handleNextStation = () => {
    soundFx.playShoot();
    if (conveyorPosition < 3) {
      setConveyorPosition(pos => pos + 1);
    } else {
      shipCake();
    }
  };

  const handleTrashCake = () => {
    soundFx.playHit();
    setBuiltCake({});
    setConveyorPosition(0);
    setFeedback({ text: 'Cake cleared! Start fresh with a new smile 😊', type: 'error' });
    setTimeout(() => setFeedback({ text: '', type: null }), 1800);
  };

  const shipCake = () => {
    const isShapeCorrect = builtCake.shape?.id === currentOrder.shape.id;
    const isFlavorCorrect = builtCake.flavor?.id === currentOrder.flavor.id;
    const isIcingCorrect = builtCake.icing?.id === currentOrder.icing.id;
    const isToppingCorrect = builtCake.topping?.id === currentOrder.topping.id;

    if (isShapeCorrect && isFlavorCorrect && isIcingCorrect && isToppingCorrect) {
      soundFx.playChoreComplete();
      const points = 350;
      const units = 50;
      setScore(s => s + points);
      setOrderCount(c => c + 1);
      setFeedback({ text: '🎉 YAY! Perfect Delicious Cake! +350 Points! 🍰', type: 'success' });
      onGameAction(points, orderCount + 2, units);

      setBuiltCake({});
      setConveyorPosition(0);
      setCurrentOrder(generateRandomOrder(orderCount + 2));
    } else {
      soundFx.playHit();
      setFeedback({ text: 'Oops! Check the customer recipe ticket and try again! 🧁', type: 'error' });
    }

    setTimeout(() => setFeedback({ text: '', type: null }), 2400);
  };

  const stations = ['Shape Baker', 'Batter Flavor', 'Frosting Glaze', 'Cute Topping'];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-pink-50 via-amber-50 to-purple-50 rounded-3xl border-4 border-pink-300 overflow-hidden shadow-xl select-none text-slate-800">
      {/* Playful Top Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 text-white shadow-md">
        <div className="flex items-center gap-3">
          {onBackToTown && (
            <button
              onClick={onBackToTown}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-xs font-black border border-white/40 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              title="Return to Town Map"
            >
              <span>🏡</span>
              <span>Town Map</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow">🧁</span>
            <div>
              <h4 className="font-extrabold text-base tracking-wide text-white drop-shadow-sm">
                Comfy Cakes Bakery
              </h4>
              <div className="text-xs text-pink-100 font-medium hidden sm:block">
                Bake cakes on conveyor to sweep away chores!
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
            <span>🍰 Baked:</span>
            <span className="text-amber-200 font-extrabold text-sm">{orderCount}</span>
          </div>
          <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
            <span>⭐ Score:</span>
            <span className="text-yellow-200 font-extrabold text-sm">{score}</span>
          </div>
        </div>
      </div>

      {/* Main Bakery Floor */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Ticket + Conveyor Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer Recipe Ticket */}
          <div className="bg-amber-100/90 border-3 border-amber-300 rounded-2xl p-3.5 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                <span>📋 Customer Order #{currentOrder.id}</span>
              </span>
              <span className="bg-amber-300/80 text-amber-950 text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                Wanted!
              </span>
            </div>

            {/* Target Cake Visual preview */}
            <div className="flex items-center justify-center p-3 bg-white/80 rounded-xl border-2 border-amber-200 min-h-[100px] shadow-inner">
              <div className="relative flex flex-col items-center justify-center">
                {/* Topping */}
                <div className="text-2xl -mb-1.5 z-20 animate-bounce">
                  {currentOrder.topping.icon}
                </div>
                {/* Frosting */}
                <div
                  className="w-20 h-4 rounded-full border-2 border-white z-10 -mb-1 shadow-sm"
                  style={{ backgroundColor: currentOrder.icing.color }}
                />
                {/* Cake Base */}
                <div
                  className={`w-24 h-12 flex items-center justify-center shadow-md border-2 border-white font-bold text-xs ${currentOrder.shape.borderClass}`}
                  style={{
                    backgroundColor: currentOrder.flavor.color,
                    color: currentOrder.flavor.textColor
                  }}
                >
                  {currentOrder.flavor.name}
                </div>
              </div>
            </div>

            {/* Ingredients summary */}
            <div className="mt-2.5 text-xs grid grid-cols-2 gap-1 text-slate-700 font-semibold bg-white/60 p-2 rounded-lg">
              <div>Shape: <span className="text-pink-600 font-bold">{currentOrder.shape.name}</span></div>
              <div>Flavor: <span className="text-amber-800 font-bold">{currentOrder.flavor.name}</span></div>
              <div>Frosting: <span className="text-blue-600 font-bold">{currentOrder.icing.name}</span></div>
              <div>Topping: <span className="text-rose-600 font-bold">{currentOrder.topping.name}</span></div>
            </div>
          </div>

          {/* Current Cake on Conveyor */}
          <div className="bg-white/90 border-3 border-pink-200 rounded-2xl p-3.5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Step {conveyorPosition + 1}: {stations[conveyorPosition]}</span>
              <button
                onClick={handleTrashCake}
                className="text-pink-500 hover:text-pink-700 text-xs flex items-center gap-1 cursor-pointer font-bold bg-pink-50 hover:bg-pink-100 px-2 py-0.5 rounded-full border border-pink-200"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Start Over</span>
              </button>
            </div>

            {/* Belt animation with current cake */}
            <div className="py-4 flex items-center justify-center relative">
              {/* Conveyor track */}
              <div className="w-full h-8 bg-slate-200 border-y-2 border-slate-300 absolute bottom-3 left-0 rounded-lg flex items-center justify-around">
                <div className="w-3 h-3 rounded-full bg-pink-300" />
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <div className="w-3 h-3 rounded-full bg-sky-300" />
                <div className="w-3 h-3 rounded-full bg-purple-300" />
              </div>

              {/* The Cake in progress */}
              <div className="relative flex flex-col items-center justify-center z-10 min-h-[100px]">
                {builtCake.topping ? (
                  <div className="text-3xl -mb-1.5 z-20 animate-in zoom-in">{builtCake.topping.icon}</div>
                ) : (
                  <div className="h-7" />
                )}

                {builtCake.icing ? (
                  <div
                    className="w-20 h-4 rounded-full border-2 border-white z-10 -mb-1 shadow animate-in fade-in"
                    style={{ backgroundColor: builtCake.icing.color }}
                  />
                ) : (
                  <div className="h-3" />
                )}

                {builtCake.shape ? (
                  <div
                    className={`w-24 h-12 flex items-center justify-center shadow-lg border-2 border-white font-bold text-xs ${builtCake.shape.borderClass}`}
                    style={{
                      backgroundColor: builtCake.flavor ? builtCake.flavor.color : '#E2E8F0',
                      color: builtCake.flavor ? builtCake.flavor.textColor : '#64748B'
                    }}
                  >
                    {builtCake.flavor ? builtCake.flavor.name : builtCake.shape.name}
                  </div>
                ) : (
                  <div className="w-24 h-12 border-2 border-dashed border-pink-300 bg-pink-50/50 rounded-xl flex items-center justify-center text-xs text-pink-400 font-bold">
                    Empty Plate 🍽️
                  </div>
                )}
              </div>
            </div>

            {/* Steps indicator */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
              {stations.map((st, idx) => (
                <div
                  key={st}
                  className={`py-1 rounded-lg border-2 transition-all ${
                    idx === conveyorPosition
                      ? 'bg-purple-500 text-white border-purple-600 shadow-sm'
                      : idx < conveyorPosition
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  {idx + 1}. {st.split(' ')[0]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedback.text && (
          <div
            className={`py-2 px-4 rounded-xl text-xs font-bold text-center border-2 animate-bounce ${
              feedback.type === 'success'
                ? 'bg-emerald-100 border-emerald-400 text-emerald-800 shadow-md'
                : 'bg-rose-100 border-rose-400 text-rose-800 shadow-md'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* ACTIVE DISPENSER STATION CHOICES */}
        <div className="bg-white p-3.5 rounded-2xl border-2 border-purple-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-purple-900">
              Station {conveyorPosition + 1}: Pick your {stations[conveyorPosition]}!
            </span>
            <span className="text-xs text-pink-600 font-extrabold bg-pink-100 px-2 py-0.5 rounded-full">
              Tap to add to cake 👇
            </span>
          </div>

          {/* Station 0: Shapes */}
          {conveyorPosition === 0 && (
            <div className="grid grid-cols-3 gap-2.5">
              {SHAPES.map((sh) => (
                <button
                  key={sh.id}
                  onClick={() => handleSelectShape(sh)}
                  className={`py-3 px-2 rounded-xl font-bold text-xs flex flex-col items-center gap-1.5 border-3 transition-all cursor-pointer ${
                    builtCake.shape?.id === sh.id
                      ? 'bg-pink-100 border-pink-500 text-pink-900 shadow-md scale-[1.03]'
                      : 'bg-pink-50/60 border-pink-200 hover:border-pink-400 text-slate-700'
                  }`}
                >
                  <span className="text-2xl">{sh.icon}</span>
                  <span>{sh.name} Shape</span>
                </button>
              ))}
            </div>
          )}

          {/* Station 1: Flavors */}
          {conveyorPosition === 1 && (
            <div className="grid grid-cols-3 gap-2.5">
              {FLAVORS.map((fl) => (
                <button
                  key={fl.id}
                  onClick={() => handleSelectFlavor(fl)}
                  className={`py-3 px-2 rounded-xl font-bold text-xs flex flex-col items-center gap-1.5 border-3 transition-all cursor-pointer ${
                    builtCake.flavor?.id === fl.id
                      ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-md scale-[1.03]'
                      : 'bg-amber-50/60 border-amber-200 hover:border-amber-400 text-slate-700'
                  }`}
                >
                  <span className="text-2xl">{fl.emoji}</span>
                  <span>{fl.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Station 2: Icing */}
          {conveyorPosition === 2 && (
            <div className="grid grid-cols-3 gap-2.5">
              {ICINGS.map((ic) => (
                <button
                  key={ic.id}
                  onClick={() => handleSelectIcing(ic)}
                  className={`py-3 px-2 rounded-xl font-bold text-xs flex flex-col items-center gap-1.5 border-3 transition-all cursor-pointer ${
                    builtCake.icing?.id === ic.id
                      ? 'bg-blue-100 border-blue-500 text-blue-900 shadow-md scale-[1.03]'
                      : 'bg-blue-50/60 border-blue-200 hover:border-blue-400 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: ic.color }} />
                  <span>{ic.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Station 3: Toppings */}
          {conveyorPosition === 3 && (
            <div className="grid grid-cols-3 gap-2.5">
              {TOPPINGS.map((tp) => (
                <button
                  key={tp.id}
                  onClick={() => handleSelectTopping(tp)}
                  className={`py-3 px-2 rounded-xl font-bold text-xs flex flex-col items-center gap-1.5 border-3 transition-all cursor-pointer ${
                    builtCake.topping?.id === tp.id
                      ? 'bg-rose-100 border-rose-500 text-rose-900 shadow-md scale-[1.03]'
                      : 'bg-rose-50/60 border-rose-200 hover:border-rose-400 text-slate-700'
                  }`}
                >
                  <span className="text-2xl">{tp.icon}</span>
                  <span>{tp.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BUTTON */}
        <div>
          <button
            onClick={handleNextStation}
            className="w-full py-4 px-6 rounded-2xl font-extrabold text-base tracking-wide bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:brightness-105 active:scale-[0.98] text-white shadow-lg cursor-pointer flex items-center justify-center gap-2 border-2 border-white/50"
          >
            {conveyorPosition < 3 ? (
              <>
                <span>NEXT STEP: {stations[conveyorPosition + 1]}</span>
                <ChevronRight className="w-6 h-6" />
              </>
            ) : (
              <>
                <Check className="w-6 h-6 text-yellow-300" />
                <span>DELIVER CAKE & FINISH ORDER! 🍰</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
