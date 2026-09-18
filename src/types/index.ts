export interface GameSettings {
  music: boolean;
  sfx: boolean;
  vibration: boolean;
  screenShake: boolean;
  touchOpacity: number; // 0.5, 0.75, 1.0
}

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  bestTime: number | null; // in seconds
  deaths: number;
}

export interface SaveData {
  highestUnlockedLevel: number;
  completedLevels: number[];
  bestTimes: Record<number, number>;
  deathsPerLevel: Record<number, number>;
  totalDeaths: number;
  settings: GameSettings;
}

export type OrientationMode = 'portrait' | 'landscape' | 'compact';

export type CatState = 
  | 'idle'
  | 'run'
  | 'jump'
  | 'fall'
  | 'land'
  | 'death'
  | 'portal_enter';

export type SizeState = 'normal' | 'small';

export type GravityState = 'normal' | 'inverted';

export type ControlModifier = 'normal' | 'reverse' | 'autorun_right';

export type LevelTheme = 'chapter1' | 'chapter2' | 'chapter3';

export interface ViewportInfo {
  width: number;
  height: number;
  aspectRatio: number;
  mode: OrientationMode;
  safeArea: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}
