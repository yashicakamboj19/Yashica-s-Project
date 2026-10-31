import { Chore, AutomationBot, LeaderboardEntry } from '../types.ts';

export const INITIAL_CHORES: Chore[] = [
  {
    id: 'chore-email',
    title: 'Clean Up 500 Junk Emails ✉️',
    category: 'email',
    description: 'Delete annoying marketing ads, clear old newsletters, and reach a shiny clean inbox!',
    totalUnits: 500,
    completedUnits: 0,
    unitLabel: 'emails cleaned',
    pointsAwarded: 1500,
    status: 'running',
    difficulty: 'Quick',
    currentProgress: 0,
    sampleLogs: [
      'Unsubscribed from 5 annoying shopping newsletters!',
      'Moved 20 old receipts to the archive folder.',
      'Deleted 15 spam messages about fake prizes.',
      'Inbox is starting to look super clean and tidy!'
    ]
  },
  {
    id: 'chore-desktop',
    title: 'Tidy Up 120 Messy Desktop Files 📁',
    category: 'files',
    description: 'Sort random screenshots, messy downloads, and loose notes into cute little folders.',
    totalUnits: 120,
    completedUnits: 0,
    unitLabel: 'files sorted',
    pointsAwarded: 1200,
    status: 'queued',
    difficulty: 'Quick',
    currentProgress: 0,
    sampleLogs: [
      'Sorted 8 messy screenshots into the Pictures album!',
      'Moved homework notes into the School folder.',
      'Deleted duplicate downloaded files to save space.',
      'Desktop wallpaper is finally visible again!'
    ]
  },
  {
    id: 'chore-code',
    title: 'Squash 40 Pesky Code Typos 🐛',
    category: 'code',
    description: 'Catch silly little spelling mistakes, fix missing brackets, and make our app run smoothly!',
    totalUnits: 40,
    completedUnits: 0,
    unitLabel: 'bugs squashed',
    pointsAwarded: 1800,
    status: 'queued',
    difficulty: 'Medium',
    currentProgress: 0,
    sampleLogs: [
      'Fixed a silly missing semicolon on line 42!',
      'Renamed a messy variable to something nice and clear.',
      'Squashed a bug that made buttons wiggle funny.',
      'All tests are passing with flying colors!'
    ]
  },
  {
    id: 'chore-system',
    title: 'Empty the Giant Trash Bin 🗑️',
    category: 'system',
    description: 'Throw away obsolete caches and dust bunnies to free up 25 GB of storage space!',
    totalUnits: 25,
    completedUnits: 0,
    unitLabel: 'GB freed',
    pointsAwarded: 2000,
    status: 'queued',
    difficulty: 'Medium',
    currentProgress: 0,
    sampleLogs: [
      'Emptied the recycle bin and tossed out temp files.',
      'Cleared out old video game update leftovers.',
      'Reclaimed 3.5 GB of shiny free disk space!',
      'Computer is breathing a sigh of relief!'
    ]
  },
  {
    id: 'chore-photos',
    title: 'Organize 150 Fun Vacation Photos 📸',
    category: 'cloud',
    description: 'Sort happy photos, remove blurry shots, and make a beautiful highlight album!',
    totalUnits: 150,
    completedUnits: 0,
    unitLabel: 'photos organized',
    pointsAwarded: 2200,
    status: 'queued',
    difficulty: 'Epic',
    currentProgress: 0,
    sampleLogs: [
      'Created a "Beach Trip 2026" photo album!',
      'Deleted 12 accidental blurry photos of the floor.',
      'Added cute heart tags to favorite family photos.',
      'Photo gallery is organized and looking gorgeous!'
    ]
  }
];

export const INITIAL_BOTS: AutomationBot[] = [
  {
    id: 'bot-puppy',
    name: 'Chore Puppy 🐶',
    description: 'Barks happily and wags its tail, picking up loose paper scraps!',
    cost: 100,
    level: 0,
    ratePerSec: 2,
    pointsPerSec: 5,
    icon: 'Sparkles'
  },
  {
    id: 'bot-robot',
    name: 'Bubbly Robot Vacuum 🤖',
    description: 'Zooms around the floor vacuuming up dust bunnies on auto-pilot.',
    cost: 350,
    level: 0,
    ratePerSec: 6,
    pointsPerSec: 18,
    icon: 'Cpu'
  },
  {
    id: 'bot-broom',
    name: 'Magic Flying Broom 🧹',
    description: 'Sweeps away clutter and organizes folders with a swoosh of magic!',
    cost: 900,
    level: 0,
    ratePerSec: 18,
    pointsPerSec: 55,
    icon: 'Terminal'
  },
  {
    id: 'bot-fairy',
    name: 'Sparkle Fairy Helper 🧚',
    description: 'Sprinkles fairy dust to finish chores in a dazzling shower of stars!',
    cost: 2500,
    level: 0,
    ratePerSec: 50,
    pointsPerSec: 180,
    icon: 'Mail'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lb-1',
    rank: 1,
    username: 'CupcakeMaster ⭐',
    points: 24500,
    choresCompleted: 14,
    actionsPerMinute: 180,
    avatarSeed: 'cupcake'
  },
  {
    id: 'lb-2',
    rank: 2,
    username: 'SparkleQueen 💖',
    points: 19800,
    choresCompleted: 11,
    actionsPerMinute: 160,
    avatarSeed: 'sparkle'
  },
  {
    id: 'lb-3',
    rank: 3,
    username: 'SunnyBaker ☀️',
    points: 15400,
    choresCompleted: 9,
    actionsPerMinute: 140,
    avatarSeed: 'sunny'
  },
  {
    id: 'lb-4',
    rank: 4,
    username: 'You (Chore Hero) 🌟',
    points: 0,
    choresCompleted: 0,
    actionsPerMinute: 0,
    avatarSeed: 'user',
    isUser: true
  },
  {
    id: 'lb-5',
    rank: 5,
    username: 'HappyPanda 🐼',
    points: 11200,
    choresCompleted: 6,
    actionsPerMinute: 110,
    avatarSeed: 'panda'
  },
  {
    id: 'lb-6',
    rank: 6,
    username: 'CookieMonster 🍪',
    points: 8600,
    choresCompleted: 5,
    actionsPerMinute: 95,
    avatarSeed: 'cookie'
  }
];

export function generateChoreLog(chore: Chore, unitsDelta: number): { level: 'info' | 'sync' | 'clean' | 'success' | 'warn'; message: string } {
  const percent = Math.min(100, Math.round(((chore.completedUnits + unitsDelta) / chore.totalUnits) * 100));

  const friendlyMessages: Record<string, string[]> = {
    email: [
      `✉️ Cleared +${unitsDelta} annoying spam emails! (${percent}% done)`,
      `✨ Unsubscribed from 3 shopping lists! Inbox is feeling lighter!`,
      `🧹 Sorted +${unitsDelta} emails into neat little folders!`,
      `⭐ Archive box updated! Great job cleaning up!`
    ],
    files: [
      `📁 Neatly filed +${unitsDelta} messy screenshots into folders!`,
      `✨ Desktop looks so much prettier now! (+${unitsDelta} files tidied)`,
      `🎨 Grouped loose pictures into a cute album!`,
      `🏷️ Added shiny color labels to homework notes!`
    ],
    code: [
      `🐛 Caught +${unitsDelta} pesky typos and fixed them up!`,
      `✨ Code is running silky smooth! No more hiccups!`,
      `🎉 Button colors updated and looking vibrant!`,
      `🔧 Fixed a crooked line of code with a smile!`
    ],
    system: [
      `🗑️ Tossed out +${unitsDelta} GB of dusty junk cache!`,
      `🚀 Computer speed boosted! Running so fast now!`,
      `✨ Emptied out old video game files from the trash!`,
      `🧹 Sparkled up the hard drive!`
    ],
    cloud: [
      `📸 Organized +${unitsDelta} happy photos into clean albums!`,
      `💖 Starred your favorite memories!`,
      `✨ Cleared blurry screenshots to make room for good photos!`,
      `🌈 Vacation album is looking spectacular!`
    ]
  };

  const pool = friendlyMessages[chore.category] || friendlyMessages.email;
  const chosenMessage = pool[Math.floor(Math.random() * pool.length)];

  let level: 'info' | 'sync' | 'clean' | 'success' | 'warn' = 'clean';
  if (percent >= 100) level = 'success';

  return {
    level,
    message: chosenMessage
  };
}
