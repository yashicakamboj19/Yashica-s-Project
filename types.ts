export type ChoreCategory = 'email' | 'code' | 'system' | 'files' | 'cloud';

export interface ChoreLog {
  id: string;
  timestamp: string;
  level: 'info' | 'sync' | 'clean' | 'success' | 'warn';
  message: string;
}

export interface Chore {
  id: string;
  title: string;
  category: ChoreCategory;
  description: string;
  totalUnits: number;
  completedUnits: number;
  unitLabel: string;
  pointsAwarded: number;
  status: 'queued' | 'running' | 'completed';
  difficulty: 'Quick' | 'Medium' | 'Epic';
  currentProgress: number; // 0 to 100
  sampleLogs: string[];
}

export interface AutomationBot {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  ratePerSec: number; // Chore units per second
  pointsPerSec: number; // Points generated per second
  icon: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  points: number;
  choresCompleted: number;
  actionsPerMinute: number;
  avatarSeed: string;
  isUser?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GameStats {
  points: number;
  multiplier: number;
  combo: number;
  maxCombo: number;
  totalHits: number;
  totalClicks: number;
  choresCleared: number;
  overdriveCharge: number; // 0 to 100
  isOverdrive: boolean;
}
