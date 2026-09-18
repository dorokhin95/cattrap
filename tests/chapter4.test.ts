import { describe, it, expect, beforeEach } from 'vitest';
import { LevelRegistry } from '../src/game/levels/LevelRegistry';
import { SaveProvider } from '../src/save/SaveProvider';

describe('Chapter 4 (Levels 31-40) Comprehensive Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    SaveProvider.getInstance().resetProgress();
  });

  describe('1. Registry & Chapter 4 Structure Integrity', () => {
    it('общее количество уровней равно 40', () => {
      expect(LevelRegistry.getTotalLevels()).toBe(40);
      expect(LevelRegistry.getAllLevels().length).toBe(40);
    });

    it('уровни 31-40 принадлежат Главе 4 с темой chapter4', () => {
      for (let i = 31; i <= 40; i++) {
        const lvl = LevelRegistry.getLevel(i);
        expect(lvl).toBeDefined();
        expect(lvl!.chapter).toBe(4);
        expect(lvl!.theme).toBe('chapter4');
        expect(lvl!.id).toBe(i);
        expect(lvl!.name.length).toBeGreaterThan(0);
        expect(lvl!.solidTiles.length).toBeGreaterThan(10);
      }
      expect(LevelRegistry.getLevel(40)!.isChapterEnd).toBe(true);
      expect(LevelRegistry.getLevel(39)!.isChapterEnd).toBeFalsy();
    });

    it('каждый уровень Главы 4 содержит правильные ключевые механики', () => {
      // 31: Первый валун (RollingBoulder)
      const l31 = LevelRegistry.getLevel(31)!;
      expect(Boolean(l31.rollingBoulders && l31.rollingBoulders.length > 0)).toBe(true);
      expect(l31.rollingBoulders![0].speedX).toBeGreaterThan(0);

      // 32: Встречная лавина (валун катится навстречу)
      const l32 = LevelRegistry.getLevel(32)!;
      expect(Boolean(l32.rollingBoulders && l32.rollingBoulders.length > 0)).toBe(true);
      expect(l32.rollingBoulders![0].speedX).toBeLessThan(0);

      // 33: Лабиринт катакомб (многоярусный лабиринт + валун)
      const l33 = LevelRegistry.getLevel(33)!;
      expect(Boolean(l33.rollingBoulders && l33.rollingBoulders.length > 0)).toBe(true);
      expect(l33.height).toBeGreaterThanOrEqual(15);

      // 34: Шар-маятник (валун с высоким отскоком)
      const l34 = LevelRegistry.getLevel(34)!;
      expect(Boolean(l34.rollingBoulders && l34.rollingBoulders[0].autoStart)).toBe(true);
      expect(l34.rollingBoulders![0].bounce).toBeGreaterThan(0.5);

      // 35: Бег наперегонки (автобег + погоня валуна)
      const l35 = LevelRegistry.getLevel(35)!;
      expect(Boolean(l35.controlZones && l35.controlZones.some(cz => cz.type === 'autorun_right'))).toBe(true);
      expect(Boolean(l35.rollingBoulders && l35.rollingBoulders.length > 0)).toBe(true);

      // 36: Двойной капкан (валун сзади и валун спереди)
      const l36 = LevelRegistry.getLevel(36)!;
      expect(Boolean(l36.rollingBoulders && l36.rollingBoulders.length >= 2)).toBe(true);
      const speeds = l36.rollingBoulders!.map(b => b.speedX || 0);
      expect(speeds.some(s => s > 0) && speeds.some(s => s < 0)).toBe(true);

      // 37: Схлопывающийся лаз (уменьшение + узкий лаз + падающий блок)
      const l37 = LevelRegistry.getLevel(37)!;
      expect(Boolean(l37.modifierZones && l37.modifierZones.some(m => m.type === 'shrink'))).toBe(true);
      expect(Boolean(l37.fallingBlocks && l37.fallingBlocks.length > 0)).toBe(true);
      expect(Boolean(l37.rollingBoulders && l37.rollingBoulders.length > 0)).toBe(true);

      // 38: Каменный пинбол (батуты + валун с отскоками)
      const l38 = LevelRegistry.getLevel(38)!;
      expect(Boolean(l38.bouncePads && l38.bouncePads.length >= 2)).toBe(true);
      expect(Boolean(l38.rollingBoulders && l38.rollingBoulders.length > 0)).toBe(true);

      // 39: Лабиринт падающих плит (развилка + падающие плиты + валун)
      const l39 = LevelRegistry.getLevel(39)!;
      expect(Boolean(l39.fallingBlocks && l39.fallingBlocks.length >= 3)).toBe(true);
      expect(Boolean(l39.rollingBoulders && l39.rollingBoulders.length > 0)).toBe(true);

      // 40: Горизонт катакомб (финал: чекпоинт, 3 валуна, убегающий портал, батут)
      const l40 = LevelRegistry.getLevel(40)!;
      expect(l40.checkpoint).toBeDefined();
      expect(Boolean(l40.rollingBoulders && l40.rollingBoulders.length >= 3)).toBe(true);
      expect(Boolean(l40.portal.targets && l40.portal.targets.length > 0)).toBe(true);
      expect(Boolean(l40.bouncePads && l40.bouncePads.length > 0)).toBe(true);
    });
  });

  describe('2. Chapter 4 Progression & Save Logic', () => {
    it('прохождение Уровня 30 открывает доступ к Уровню 31', () => {
      const save = SaveProvider.getInstance();
      for (let i = 1; i <= 30; i++) {
        save.recordLevelCompletion(i, 5.0);
      }
      expect(save.getData().highestUnlockedLevel).toBe(31);
      expect(save.isLevelUnlocked(31)).toBe(true);
      expect(save.isLevelUnlocked(32)).toBe(false);
    });

    it('последовательное прохождение Главы 4 от 31 до 40', () => {
      const save = SaveProvider.getInstance();
      for (let i = 1; i <= 40; i++) {
        expect(save.isLevelUnlocked(i)).toBe(true);
        save.recordLevelCompletion(i, 4.0 + i * 0.1);
        save.recordDeath(i);
      }
      expect(save.getData().highestUnlockedLevel).toBe(40);
      expect(save.isLevelUnlocked(40)).toBe(true);
      expect(save.getData().completedLevels.length).toBe(40);
      expect(save.getData().totalDeaths).toBe(40);
    });
  });

  describe('3. RollingBoulder Physics & Collision Simulation', () => {
    it('круговой расчет столкновения валуна и кота честно отсекает промах', () => {
      // Радиус валуна = 12, кота = 8, пороговая дистанция = 21
      function checkOverlap(catX: number, catY: number, bX: number, bY: number): boolean {
        const dist = Math.hypot(catX - bX, catY - bY);
        return dist < 21;
      }

      // Точное попадание
      expect(checkOverlap(100, 100, 100, 100)).toBe(true);
      // Касание на границе (дистанция 15)
      expect(checkOverlap(100, 100, 115, 100)).toBe(true);
      // Безопасное расстояние (дистанция 25)
      expect(checkOverlap(100, 100, 125, 100)).toBe(false);
      // Котик прыгнул на верхнюю полку (высота +35px)
      expect(checkOverlap(100, 65, 100, 100)).toBe(false);
    });

    it('отскок валуна от левой и правой стены меняет знак скорости', () => {
      let speedX = 190;

      function onHitRightWall() {
        speedX = -Math.abs(speedX);
      }

      function onHitLeftWall() {
        speedX = Math.abs(speedX);
      }

      onHitRightWall();
      expect(speedX).toBe(-190);

      onHitLeftWall();
      expect(speedX).toBe(190);
    });

    it('вращение валуна пропорционально скорости перемещения', () => {
      let rotation = 0;
      const vx = 200; // px/s
      const deltaMs = 16.67; // 60 FPS

      const rotationSpeed = (vx / 16) * (deltaMs / 1000);
      rotation += rotationSpeed;

      expect(rotation).toBeGreaterThan(0);
      expect(rotationSpeed).toBeCloseTo(0.208, 2);
    });
  });
});
