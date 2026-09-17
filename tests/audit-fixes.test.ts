import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SaveProvider, createDefaultSave, createDefaultSettings } from '../src/save/SaveProvider';
import { PlatformManager } from '../src/platform/PlatformManager';
import { TriggerManager } from '../src/game/triggers/TriggerManager';
import { LevelRegistry } from '../src/game/levels/LevelRegistry';

describe('Audit Fixes Verification', () => {
  beforeEach(() => {
    localStorage.clear();
    SaveProvider.getInstance().resetProgress();
  });

  describe('SaveProvider isolation and safety', () => {
    it('createDefaultSave() возвращает независимые глубокие копии', () => {
      const save1 = createDefaultSave();
      const save2 = createDefaultSave();

      save1.completedLevels.push(1);
      save1.bestTimes[1] = 10.5;
      save1.deathsPerLevel[1] = 3;
      save1.settings.music = false;

      expect(save2.completedLevels).toEqual([]);
      expect(save2.bestTimes).toEqual({});
      expect(save2.deathsPerLevel).toEqual({});
      expect(save2.settings.music).toBe(true);
    });

    it('resetProgress() полностью изолирует прогресс и не затирает ссылки', () => {
      const save = SaveProvider.getInstance();
      save.recordDeath(1);
      save.recordLevelCompletion(1, 5.0);

      expect(save.getData().completedLevels).toContain(1);
      expect(save.getData().totalDeaths).toBeGreaterThan(0);

      save.resetProgress();

      expect(save.getData().completedLevels).toEqual([]);
      expect(save.getData().bestTimes).toEqual({});
      expect(save.getData().deathsPerLevel).toEqual({});
      expect(save.getData().totalDeaths).toBe(0);
      expect(save.getData().highestUnlockedLevel).toBe(1);
    });

    it('прохождение финального 20-го уровня не открывает несуществующий уровень 21', () => {
      const save = SaveProvider.getInstance();
      const totalLevels = LevelRegistry.getTotalLevels();
      expect(totalLevels).toBe(20);

      // Прохождение 10 уровня открывает 11
      save.recordLevelCompletion(10, 15.0);
      expect(save.getData().highestUnlockedLevel).toBeGreaterThanOrEqual(11);
      expect(save.isLevelUnlocked(11)).toBe(true);

      // Проходим все уровни от 1 до 20
      for (let i = 1; i <= 20; i++) {
        save.recordLevelCompletion(i, 10.0 + i);
      }

      expect(save.getData().highestUnlockedLevel).toBe(20);
      expect(save.isLevelUnlocked(20)).toBe(true);
      expect(save.isLevelUnlocked(21)).toBe(false);
    });

    it('loadFromStorage санитизирует поврежденные или злонамеренные данные', () => {
      const save = SaveProvider.getInstance();

      localStorage.setItem(
        'cattrap_save_v1',
        JSON.stringify({
          highestUnlockedLevel: 999,
          completedLevels: ['bad', null, 1, 999],
          bestTimes: { '1': 12.345, 'bad': -5 },
          deathsPerLevel: { '1': 2, 'invalid': 'abc' },
          totalDeaths: -10,
          settings: {
            vibration: 'not_boolean'
          }
        })
      );

      // Имитируем загрузку из хранилища с испорченными данными
      const sanitized = (save as any).loadFromStorage();

      expect(sanitized.highestUnlockedLevel).toBe(20);
      expect(sanitized.completedLevels).toEqual([1]);
      expect(sanitized.bestTimes[1]).toBe(12.35);
      expect(sanitized.bestTimes['bad']).toBeUndefined();
      expect(sanitized.deathsPerLevel[1]).toBe(2);
      expect(sanitized.deathsPerLevel['invalid']).toBeUndefined();
      expect(sanitized.totalDeaths).toBeGreaterThanOrEqual(0);
      expect(typeof sanitized.settings.vibration).toBe('boolean');
    });
  });

  describe('PlatformManager & Vibration control', () => {
    it('PlatformManager.haptic() блокируется, если vibration = false', () => {
      const pm = PlatformManager.getInstance();
      const save = SaveProvider.getInstance();
      const service = pm.getPlatform();

      const hapticSpy = vi.spyOn(service, 'haptic');

      save.updateSettings({ vibration: false });
      pm.haptic('medium');
      expect(hapticSpy).not.toHaveBeenCalled();

      save.updateSettings({ vibration: true });
      pm.haptic('medium');
      expect(hapticSpy).toHaveBeenCalledWith('medium');

      hapticSpy.mockRestore();
    });
  });

  describe('TriggerManager', () => {
    it('reset() отменяет запланированные задержки и сбрасывает флаги триггеров', () => {
      vi.useFakeTimers();
      const tm = new TriggerManager();
      let triggered = false;

      tm.addTrigger({
        id: 'delayed_trap',
        condition: { type: 'player_x_greater', value: 5 },
        action: () => {
          triggered = true;
        },
        delayMs: 200,
        once: true,
        resetOnDeath: true
      });

      // Игрок пересёк x=5 (в тайлах x=5 * 32 = 160)
      tm.checkTriggers(165, 100);

      // Смерть через 100 мс и рестарт (до выполнения таймера на 200 мс)
      vi.advanceTimersByTime(100);
      expect(triggered).toBe(false);

      tm.reset();

      // Прошло еще 200 мс — отмененный коллбэк НЕ должен вызваться
      vi.advanceTimersByTime(200);
      expect(triggered).toBe(false);

      vi.useRealTimers();
    });

    it('resetOnDeath: false сохраняет активацию триггера после reset()', () => {
      const tm = new TriggerManager();
      let count = 0;

      tm.addTrigger({
        id: 'persistent_trigger',
        condition: { type: 'player_x_greater', value: 3 },
        action: () => {
          count++;
        },
        once: true,
        resetOnDeath: false
      });

      tm.checkTriggers(100, 100);
      expect(count).toBe(1);

      tm.reset();

      // Повторная проверка триггера после рестарта
      tm.checkTriggers(100, 100);
      expect(count).toBe(1); // Не должен сработать повторно
    });
  });
});
