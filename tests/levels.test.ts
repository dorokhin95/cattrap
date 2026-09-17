import { describe, it, expect } from 'vitest';
import { LevelRegistry } from '../src/game/levels/LevelRegistry';

describe('LevelRegistry & Level Data Integrity', () => {
  it('должен содержать ровно 10 уровней для Главы 1', () => {
    expect(LevelRegistry.getTotalLevels()).toBe(10);
    const all = LevelRegistry.getAllLevels();
    expect(all.length).toBe(10);
  });

  it('каждый уровень должен иметь корректные размеры, спаун, портал и имя', () => {
    for (let i = 1; i <= 10; i++) {
      const level = LevelRegistry.getLevel(i);
      expect(level).toBeDefined();
      expect(level!.id).toBe(i);
      expect(level!.name.length).toBeGreaterThan(0);
      expect(level!.width).toBeGreaterThanOrEqual(20);
      expect(level!.height).toBeGreaterThanOrEqual(10);

      // Спаун внутри границ уровня
      expect(level!.spawn.x).toBeGreaterThan(0);
      expect(level!.spawn.x).toBeLessThan(level!.width);
      expect(level!.spawn.y).toBeGreaterThan(0);
      expect(level!.spawn.y).toBeLessThan(level!.height);

      // Портал внутри границ уровня
      expect(level!.portal.x).toBeGreaterThan(0);
      expect(level!.portal.x).toBeLessThan(level!.width);
      expect(level!.portal.y).toBeGreaterThan(0);
      expect(level!.portal.y).toBeLessThan(level!.height);

      // Наличие твердых блоков
      expect(level!.solidTiles.length).toBeGreaterThan(5);
    }
  });

  it('уровень 10 должен иметь контрольную точку (чекпоинт)', () => {
    const level10 = LevelRegistry.getLevel(10);
    expect(level10).toBeDefined();
    expect(level10!.checkpoint).toBeDefined();
    expect(level10!.checkpoint!.x).toBeGreaterThan(15);
  });

  it('уровень 3 и 9 должны содержать цели для перемещения портала', () => {
    const level3 = LevelRegistry.getLevel(3);
    expect(level3!.portal.targets).toBeDefined();
    expect(level3!.portal.targets!.length).toBe(2);

    const level9 = LevelRegistry.getLevel(9);
    expect(level9!.portal.targets).toBeDefined();
    expect(level9!.portal.isTrollPortal).toBe(true);
  });
});
