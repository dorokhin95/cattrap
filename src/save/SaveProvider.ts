import { SaveData, GameSettings } from '../types';

const STORAGE_KEY = 'cattrap_save_v1';

const DEFAULT_SETTINGS: GameSettings = {
  music: true,
  sfx: true,
  vibration: true,
  screenShake: true,
  touchOpacity: 0.75
};

const DEFAULT_SAVE: SaveData = {
  highestUnlockedLevel: 1,
  completedLevels: [],
  bestTimes: {},
  deathsPerLevel: {},
  totalDeaths: 0,
  settings: DEFAULT_SETTINGS
};

export class SaveProvider {
  private static instance: SaveProvider | null = null;
  private data: SaveData;

  private constructor() {
    this.data = this.loadFromStorage();
  }

  public static getInstance(): SaveProvider {
    if (!SaveProvider.instance) {
      SaveProvider.instance = new SaveProvider();
    }
    return SaveProvider.instance;
  }

  private loadFromStorage(): SaveData {
    if (typeof localStorage === 'undefined') {
      return { ...DEFAULT_SAVE };
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_SAVE };
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SAVE,
        ...parsed,
        settings: {
          ...DEFAULT_SETTINGS,
          ...(parsed.settings || {})
        }
      };
    } catch (e) {
      console.warn('[SaveProvider] Ошибка чтения localStorage, сброс к значениям по умолчанию:', e);
      return { ...DEFAULT_SAVE };
    }
  }

  public save(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('[SaveProvider] Не удалось сохранить прогресс:', e);
    }
  }

  public getData(): Readonly<SaveData> {
    return this.data;
  }

  public getSettings(): Readonly<GameSettings> {
    return this.data.settings;
  }

  public updateSettings(partial: Partial<GameSettings>): void {
    this.data.settings = {
      ...this.data.settings,
      ...partial
    };
    this.save();
  }

  public isLevelUnlocked(level: number): boolean {
    return level <= this.data.highestUnlockedLevel;
  }

  public isLevelCompleted(level: number): boolean {
    return this.data.completedLevels.includes(level);
  }

  public recordDeath(level: number): void {
    this.data.totalDeaths++;
    this.data.deathsPerLevel[level] = (this.data.deathsPerLevel[level] || 0) + 1;
    this.save();
  }

  public recordLevelCompletion(level: number, timeSeconds: number): void {
    if (!this.data.completedLevels.includes(level)) {
      this.data.completedLevels.push(level);
    }
    if (level >= this.data.highestUnlockedLevel) {
      this.data.highestUnlockedLevel = Math.max(this.data.highestUnlockedLevel, level + 1);
    }
    const currentBest = this.data.bestTimes[level];
    if (currentBest === undefined || timeSeconds < currentBest) {
      this.data.bestTimes[level] = Math.round(timeSeconds * 100) / 100;
    }
    this.save();
  }

  public resetProgress(): void {
    this.data = {
      ...DEFAULT_SAVE,
      settings: this.data.settings
    };
    this.save();
  }
}
