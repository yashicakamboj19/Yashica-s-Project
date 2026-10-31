import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { ArcadeHub } from './components/ArcadeHub.tsx';
import { ChoreDashboard } from './components/ChoreDashboard.tsx';
import { LeaderboardView } from './components/LeaderboardView.tsx';
import { ParticleCanvas, ParticleCanvasHandle } from './components/ParticleCanvas.tsx';
import { Chore, ChoreLog, LeaderboardEntry } from './types.ts';
import { INITIAL_CHORES, INITIAL_LEADERBOARD, generateChoreLog } from './utils/chorePresets.ts';
import { soundFx } from './utils/audio.ts';
import { Sparkles, Trophy, RefreshCw } from 'lucide-react';

export default function App() {
  const particleCanvasRef = useRef<ParticleCanvasHandle | null>(null);

  // Chores and current task
  const [chores, setChores] = useState<Chore[]>(() => {
    const saved = localStorage.getItem('chore_arcade_chores');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_CHORES;
  });

  const [activeChoreId, setActiveChoreId] = useState<string>(() => {
    return INITIAL_CHORES[0].id;
  });

  // Friendly Activity Logs
  const [logs, setLogs] = useState<ChoreLog[]>([
    {
      id: 'init-1',
      timestamp: new Date().toISOString().substring(11, 23),
      level: 'info',
      message: '✨ Welcome to Chore Arcade! Pick any mini-game to start cleaning!'
    }
  ]);

  // Stats & Leaderboard
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('chore_arcade_pts');
    return saved ? Number(saved) : 100;
  });

  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [choresClearedCount, setChoresClearedCount] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getIsMuted());

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('chore_arcade_leaderboard');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_LEADERBOARD;
  });

  // Save progress periodically
  useEffect(() => {
    localStorage.setItem('chore_arcade_pts', String(points));
    localStorage.setItem('chore_arcade_chores', JSON.stringify(chores));
    localStorage.setItem('chore_arcade_leaderboard', JSON.stringify(leaderboard));
  }, [points, chores, leaderboard]);

  const activeChore = chores.find((c) => c.id === activeChoreId) || chores[0];

  // Helper to add logs with max 120 lines
  const appendLog = useCallback((level: ChoreLog['level'], message: string) => {
    const newLog: ChoreLog = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().substring(11, 23),
      level,
      message
    };
    setLogs((prev) => [...prev.slice(-120), newLog]);
  }, []);

  // Complete a chore
  const handleChoreCompletion = useCallback((chore: Chore) => {
    soundFx.playChoreComplete();

    // Trigger celebratory particle explosion
    if (particleCanvasRef.current) {
      particleCanvasRef.current.triggerChoreExplosion(
        undefined,
        undefined,
        `🎉 ${chore.title.split(':')[0]} COMPLETE! +${chore.pointsAwarded.toLocaleString()} PTS`
      );
    }

    setChoresClearedCount((c) => c + 1);

    // Award bonus completion points
    setPoints((p) => p + chore.pointsAwarded);

    // Update chore state
    setChores((prev) =>
      prev.map((c) =>
        c.id === chore.id
          ? { ...c, status: 'completed', completedUnits: c.totalUnits, currentProgress: 100 }
          : c
      )
    );

    appendLog('success', `[MISSION ACCOMPLISHED] Completed chore: ${chore.title}! Awarded +${chore.pointsAwarded} pts.`);

    // Update user rank in leaderboard
    setLeaderboard((prev) => {
      const updated = prev.map((item) => {
        if (item.isUser) {
          const newPts = item.points + chore.pointsAwarded;
          const newChores = item.choresCompleted + 1;
          return { ...item, points: newPts, choresCompleted: newChores };
        }
        return item;
      });
      return [...updated].sort((a, b) => b.points - a.points);
    });

    // Auto-advance to next queued chore if available
    setTimeout(() => {
      setChores((current) => {
        const next = current.find((c) => c.status === 'queued' && c.id !== chore.id);
        if (next) {
          setActiveChoreId(next.id);
          appendLog('info', `Auto-activated next chore in pipeline: "${next.title}"`);
        }
        return current;
      });
    }, 1200);
  }, [appendLog]);

  // Main hook: game interaction drives the background chore automation
  const handleGameAction = useCallback((pointsAwarded: number, combo: number, choreUnitsEarned: number) => {
    setPoints((p) => p + pointsAwarded);
    setMaxCombo((m) => Math.max(m, combo));

    // Advance active chore
    setChores((prevChores) => {
      const current = prevChores.find((c) => c.id === activeChoreId);
      if (!current || current.status === 'completed') return prevChores;

      const newUnits = Math.min(current.totalUnits, current.completedUnits + choreUnitsEarned);
      const isFinished = newUnits >= current.totalUnits;
      const progressPercent = Math.min(100, Math.round((newUnits / current.totalUnits) * 100));

      const updatedChores = prevChores.map((c): Chore =>
        c.id === current.id
          ? {
              ...c,
              completedUnits: newUnits,
              currentProgress: progressPercent,
              status: isFinished ? 'completed' : 'running'
            }
          : c
      );

      // Generate realistic dynamic console log
      const logData = generateChoreLog(current, choreUnitsEarned);
      appendLog(logData.level, logData.message);

      // Chore complete check
      if (isFinished) {
        setTimeout(() => handleChoreCompletion(current), 50);
      }

      return updatedChores;
    });

    // Update leaderboard entry live
    setLeaderboard((prev) => {
      const updated = prev.map((item) => {
        if (item.isUser) {
          return { ...item, points: item.points + pointsAwarded };
        }
        return item;
      });
      return [...updated].sort((a, b) => b.points - a.points);
    });
  }, [activeChoreId, appendLog, handleChoreCompletion]);

  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  // Reset demo session
  const handleResetSession = () => {
    if (confirm('Reset Chore Arcade back to start?')) {
      localStorage.removeItem('chore_arcade_pts');
      localStorage.removeItem('chore_arcade_chores');
      localStorage.removeItem('chore_arcade_leaderboard');
      setPoints(100);
      setChores(INITIAL_CHORES);
      setActiveChoreId(INITIAL_CHORES[0].id);
      setLeaderboard(INITIAL_LEADERBOARD);
      appendLog('clean', 'Game reset! Clean chore queue ready.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-sky-50 to-pink-100 text-slate-800 flex flex-col font-sans selection:bg-pink-300 selection:text-pink-900">
      {/* 60fps Particle Canvas Celebration Layer */}
      <ParticleCanvas ref={particleCanvasRef} />

      {/* Top Bar Header */}
      <Navbar
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        points={points}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Simple 3-Step How-It-Works Banner */}
        <div className="bg-white/95 border-3 border-purple-200 rounded-2xl p-3 px-5 shadow-sm flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-purple-900 gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">💡</span>
            <span className="font-black text-sm">How to Play:</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-slate-700 font-extrabold flex-wrap justify-center text-xs">
            <span className="bg-pink-100 text-pink-900 px-3.5 py-1 rounded-full border border-pink-200 shadow-2xs">1. Pick a Mini-Game 🧁</span>
            <span>➔</span>
            <span className="bg-sky-100 text-sky-900 px-3.5 py-1 rounded-full border border-sky-200 shadow-2xs">2. Play & Have Fun 🎮</span>
            <span>➔</span>
            <span className="bg-emerald-100 text-emerald-900 px-3.5 py-1 rounded-full border border-emerald-200 shadow-2xs">3. Your Chore Cleans Up! ✨</span>
          </div>
        </div>

        {/* PRIMARY SIDE-BY-SIDE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: The Purble Place Town & Mini-Games (7 columns on desktop) */}
          <div className="lg:col-span-7 flex flex-col">
            <ArcadeHub
              onGameAction={handleGameAction}
              activeChoreTitle={activeChore.title}
              activeChoreProgress={activeChore.currentProgress}
              points={points}
              choresCleared={choresClearedCount}
            />
          </div>

          {/* Right Column: Chore Tracker + High Scores (5 columns on desktop) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <ChoreDashboard
              activeChore={activeChore}
              choresList={chores}
              logs={logs}
              onSelectChore={setActiveChoreId}
              onClearLogs={() => setLogs([])}
            />

            <LeaderboardView
              leaderboard={leaderboard}
              userPoints={points}
              userChoresCompleted={choresClearedCount}
            />
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-3 border-t-2 border-purple-200/80 gap-3">
          <div className="flex items-center gap-2 font-bold">
            <span>🎪 Chore Arcade</span>
            <span>·</span>
            <span>Inspired by Purble Place</span>
            <span>·</span>
            <span>✨ 3 Cute Mini-Games to Clean Real Chores!</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSession}
              className="flex items-center gap-1.5 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer font-bold bg-white px-3.5 py-1.5 rounded-full border border-purple-200 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Progress</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
