import { describe, it, expect, beforeEach } from 'vitest';
import { SaveProvider } from '../src/save/SaveProvider';

describe('SaveProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    SaveProvider.getInstance().resetProgress();
  });

  it('должен инициализироваться с дефолтными значениями', () => {
    const save = SaveProvider.getInstance();
    expect(save.getData().highestUnlockedLevel).toBe(1);
    expect(save.getData().completedLevels).toEqual([]);
    expect(save.getData().totalDeaths).toBe(0);
    expect(save.getSettings().music).toBe(true);
    expect(save.getSettings().sfx).toBe(true);
  });

  it('должен корректно регистрировать смерти на уровнях', () => {
    const save = SaveProvider.getInstance();
    save.recordDeath(1);
    save.recordDeath(1);
    save.recordDeath(2);

    expect(save.getData().totalDeaths).toBe(3);
    expect(save.getData().deathsPerLevel[1]).toBe(2);
    expect(save.getData().deathsPerLevel[2]).toBe(1);
  });

  it('должен открывать следующий уровень и сохранять лучшее время', () => {
    const save = SaveProvider.getInstance();
    expect(save.isLevelUnlocked(1)).toBe(true);
    expect(save.isLevelUnlocked(2)).toBe(false);

    save.recordLevelCompletion(1, 14.52);

    expect(save.isLevelCompleted(1)).toBe(true);
    expect(save.isLevelUnlocked(2)).toBe(true);
    expect(save.getData().bestTimes[1]).toBe(14.52);

    // Улучшение времени
    save.recordLevelCompletion(1, 11.20);
    expect(save.getData().bestTimes[1]).toBe(11.20);

    // Худшее время не должно перезаписывать рекорд
    save.recordLevelCompletion(1, 16.00);
    expect(save.getData().bestTimes[1]).toBe(11.20);
  });

  it('должен обновлять настройки игры', () => {
    const save = SaveProvider.getInstance();
    save.updateSettings({ music: false, touchOpacity: 0.5 });

    expect(save.getSettings().music).toBe(false);
    expect(save.getSettings().touchOpacity).toBe(0.5);
    expect(save.getSettings().sfx).toBe(true); // Остальные не затронуты
  });
});
