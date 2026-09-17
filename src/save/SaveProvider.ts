import { SaveData, GameSettings } from '../types';
import { LevelRegistry } from '../game/levels/LevelRegistry';

const STORAGE_KEY = 'cattrap_save_v1';

export function createDefaultSettings(): GameSettings {
  return {
    music: true,
    sfx: true,
    vibration: true,
    screenShake: true,
    touchOpacity: 0.75
  };
}

export function createDefaultSave(): SaveData {
  return {
    highestUnlockedLevel: 1,
    completedLevels: [],
    bestTimes: {},
    deathsPerLevel: {},
    totalDeaths: 0,
    settings: createDefaultSettings()
  };
}

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
    const defaultData = createDefaultSave();
    if (typeof localStorage === 'undefined') {
      return defaultData;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultData;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return defaultData;
      }

      const totalLevels = LevelRegistry.getTotalLevels();
      const completedLevels = Array.isArray(parsed.completedLevels)
        ? parsed.completedLevels.filter((lvl: unknown) => typeof lvl === 'number' && lvl >= 1 && lvl <= totalLevels)
        : [];

      let highestUnlockedLevel = typeof parsed.highestUnlockedLevel === 'number' && parsed.highestUnlockedLevel >= 1
        ? Math.min(totalLevels, Math.floor(parsed.highestUnlockedLevel))
        : 1;

      // Если игрок уже прошел уровень X, следующий уровень должен быть открыт (поддержка расширения глав)
      if (completedLevels.length > 0) {
        const maxCompleted = Math.max(...completedLevels);
        if (maxCompleted >= highestUnlockedLevel && highestUnlockedLevel < totalLevels) {
          highestUnlockedLevel = Math.min(totalLevels, maxCompleted + 1);
        }
      }

      const bestTimes: Record<number, number> = {};
      if (parsed.bestTimes && typeof parsed.bestTimes === 'object') {
        for (const [key, val] of Object.entries(parsed.bestTimes)) {
          const numKey = Number(key);
          if (!isNaN(numKey) && typeof val === 'number' && val > 0) {
            bestTimes[numKey] = Math.round(val * 100) / 100;
          }
        }
      }

      const deathsPerLevel: Record<number, number> = {};
      if (parsed.deathsPerLevel && typeof parsed.deathsPerLevel === 'object') {
        for (const [key, val] of Object.entries(parsed.deathsPerLevel)) {
          const numKey = Number(key);
          if (!isNaN(numKey) && typeof val === 'number' && val >= 0) {
            deathsPerLevel[numKey] = Math.floor(val);
          }
        }
      }

      const totalDeaths = typeof parsed.totalDeaths === 'number' && parsed.totalDeaths >= 0
        ? Math.floor(parsed.totalDeaths)
        : Object.values(deathsPerLevel).reduce((acc, cur) => acc + cur, 0);

      const parsedSettings = parsed.settings && typeof parsed.settings === 'object' ? parsed.settings : {};
      const settings: GameSettings = {
        music: typeof parsedSettings.music === 'boolean' ? parsedSettings.music : true,
        sfx: typeof parsedSettings.sfx === 'boolean' ? parsedSettings.sfx : true,
        vibration: typeof parsedSettings.vibration === 'boolean' ? parsedSettings.vibration : true,
        screenShake: typeof parsedSettings.screenShake === 'boolean' ? parsedSettings.screenShake : true,
        touchOpacity: typeof parsedSettings.touchOpacity === 'number' ? parsedSettings.touchOpacity : 0.75
      };

      return {
        highestUnlockedLevel,
        completedLevels,
        bestTimes,
        deathsPerLevel,
        totalDeaths,
        settings
      };
    } catch (e) {
      console.warn('[SaveProvider] Ошибка чтения localStorage, сброс к значениям по умолчанию:', e);
      return defaultData;
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
    const maxLevel = LevelRegistry.getTotalLevels();
    if (level >= this.data.highestUnlockedLevel && this.data.highestUnlockedLevel < maxLevel) {
      this.data.highestUnlockedLevel = Math.min(maxLevel, level + 1);
    }
    const currentBest = this.data.bestTimes[level];
    if (currentBest === undefined || timeSeconds < currentBest) {
      this.data.bestTimes[level] = Math.round(timeSeconds * 100) / 100;
    }
    this.save();
  }

  public resetProgress(): void {
    const defaults = createDefaultSave();
    this.data = {
      ...defaults,
      settings: { ...this.data.settings }
    };
    this.save();
  }
}
