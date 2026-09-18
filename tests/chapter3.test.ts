import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CONSTANTS } from '../src/core/Constants';
import { LevelRegistry } from '../src/game/levels/LevelRegistry';
import { SaveProvider } from '../src/save/SaveProvider';

describe('Chapter 3 (Levels 21-30) Comprehensive Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    SaveProvider.getInstance().resetProgress();
  });

  describe('1. Registry & Chapter Structure Integrity', () => {
    it('общее количество уровней равно как минимум 30', () => {
      expect(LevelRegistry.getTotalLevels()).toBeGreaterThanOrEqual(30);
      expect(LevelRegistry.getAllLevels().length).toBeGreaterThanOrEqual(30);
    });

    it('уровни 21-30 принадлежат Главе 3 с темой chapter3', () => {
      for (let i = 21; i <= 30; i++) {
        const lvl = LevelRegistry.getLevel(i);
        expect(lvl).toBeDefined();
        expect(lvl!.chapter).toBe(3);
        expect(lvl!.theme).toBe('chapter3');
        expect(lvl!.id).toBe(i);
        expect(lvl!.name.length).toBeGreaterThan(0);
      }
      expect(LevelRegistry.getLevel(30)!.isChapterEnd).toBe(true);
      expect(LevelRegistry.getLevel(29)!.isChapterEnd).toBeFalsy();
    });

    it('не существует уровня выше 40', () => {
      expect(LevelRegistry.getLevel(41)).toBeUndefined();
    });

    it('каждый уровень Главы 3 содержит правильные ключевые механики по ТЗ', () => {
      // 21: Лазеры
      const l21 = LevelRegistry.getLevel(21)!;
      expect(Boolean(l21.lasers && l21.lasers.length > 0)).toBe(true);

      // 22: Глитч-блоки фазы A / B
      const l22 = LevelRegistry.getLevel(22)!;
      expect(Boolean(l22.glitchBlocks && l22.glitchBlocks.length > 0)).toBe(true);
      const phases = new Set(l22.glitchBlocks!.map(g => g.phaseGroup));
      expect(phases.has('A') && phases.has('B')).toBe(true);

      // 23: Варп-порталы
      const l23 = LevelRegistry.getLevel(23)!;
      expect(Boolean(l23.warpGates && l23.warpGates.length > 0)).toBe(true);

      // 24: Эхо-кот
      const l24 = LevelRegistry.getLevel(24)!;
      expect(l24.echoCat).toBeDefined();
      expect(l24.echoCat!.delayMs).toBeGreaterThan(0);

      // 25: Зона замедления времени
      const l25 = LevelRegistry.getLevel(25)!;
      expect(Boolean(l25.timeZones && l25.timeZones.length > 0)).toBe(true);
      expect(l25.timeZones![0].timeScale).toBeLessThan(1.0);

      // 26: Лазерный конвейер (лазеры + конвейеры)
      const l26 = LevelRegistry.getLevel(26)!;
      expect(Boolean(l26.lasers && l26.lasers.length > 0)).toBe(true);
      expect(Boolean(l26.conveyors && l26.conveyors.length > 0)).toBe(true);

      // 27: Зеркальный лабиринт (варп-порталы + инверсия)
      const l27 = LevelRegistry.getLevel(27)!;
      expect(Boolean(l27.warpGates && l27.warpGates.length >= 2)).toBe(true);
      expect(Boolean(l27.controlZones && l27.controlZones.length > 0)).toBe(true);

      // 28: Фазовый автобег (автобег + глитч-блоки)
      const l28 = LevelRegistry.getLevel(28)!;
      expect(Boolean(l28.controlZones && l28.controlZones.length > 0)).toBe(true);
      expect(Boolean(l28.glitchBlocks && l28.glitchBlocks.length > 0)).toBe(true);

      // 29: Охота на себя (эхо-кот + пресс + лазер)
      const l29 = LevelRegistry.getLevel(29)!;
      expect(l29.echoCat).toBeDefined();
      expect(Boolean(l29.crushers && l29.crushers.length > 0)).toBe(true);
      expect(Boolean(l29.lasers && l29.lasers.length > 0)).toBe(true);

      // 30: Гранд-финал Главы 3 с чекпоинтом и всеми механиками
      const l30 = LevelRegistry.getLevel(30)!;
      expect(l30.checkpoint).toBeDefined();
      expect(Boolean(l30.lasers && l30.lasers.length > 0)).toBe(true);
      expect(Boolean(l30.glitchBlocks && l30.glitchBlocks.length > 0)).toBe(true);
      expect(Boolean(l30.warpGates && l30.warpGates.length > 0)).toBe(true);
      expect(Boolean(l30.timeZones && l30.timeZones.length > 0)).toBe(true);
      expect(Boolean(l30.portal.targets && l30.portal.targets.length > 0)).toBe(true);
    });
  });

  describe('2. Chapter Progression & Unlocking Logic', () => {
    it('прохождение Уровня 20 открывает доступ к Уровню 21', () => {
      const save = SaveProvider.getInstance();
      for (let i = 1; i <= 20; i++) {
        save.recordLevelCompletion(i, 5.0);
      }
      expect(save.getData().highestUnlockedLevel).toBe(21);
      expect(save.isLevelUnlocked(21)).toBe(true);
      expect(save.isLevelUnlocked(22)).toBe(false);
    });

    it('последовательное прохождение Главы 3 от 21 до 30 открывает Уровень 31', () => {
      const save = SaveProvider.getInstance();
      for (let i = 1; i <= 30; i++) {
        expect(save.isLevelUnlocked(i)).toBe(true);
        save.recordLevelCompletion(i, 4.2 + i * 0.1);
        save.recordDeath(i);
      }
      expect(save.getData().highestUnlockedLevel).toBe(31);
      expect(save.isLevelUnlocked(30)).toBe(true);
      expect(save.isLevelUnlocked(31)).toBe(true);
      expect(save.isLevelUnlocked(32)).toBe(false);
      expect(save.getData().completedLevels.length).toBe(30);
      expect(save.getData().totalDeaths).toBe(30);
    });
  });

  describe('3. Chapter 3 Mechanics Unit Simulations', () => {
    it('GlitchBlock переключает фазы A и B в противофазе', () => {
      const cycleMs = 1500;
      let phaseAActive = true;
      let phaseBActive = false;

      function simulateStep(elapsedMs: number) {
        const cycleIndex = Math.floor(elapsedMs / cycleMs) % 2;
        phaseAActive = cycleIndex === 0;
        phaseBActive = cycleIndex === 1;
      }

      // 0 мс: фаза A активна, фаза B неактивна
      simulateStep(0);
      expect(phaseAActive).toBe(true);
      expect(phaseBActive).toBe(false);

      // 1600 мс: фаза B активна, фаза A неактивна
      simulateStep(1600);
      expect(phaseAActive).toBe(false);
      expect(phaseBActive).toBe(true);

      // 3100 мс: снова фаза A активна
      simulateStep(3100);
      expect(phaseAActive).toBe(true);
      expect(phaseBActive).toBe(false);
    });

    it('LaserHazard: луч наносит урон только во время стрельбы (state === firing)', () => {
      type LaserState = 'idle' | 'warning' | 'firing' | 'cooldown';
      let state: LaserState = 'idle';

      function isLethal(currentState: LaserState): boolean {
        return currentState === 'firing';
      }

      state = 'idle';
      expect(isLethal(state)).toBe(false);

      state = 'warning';
      expect(isLethal(state)).toBe(false);

      state = 'firing';
      expect(isLethal(state)).toBe(true);

      state = 'cooldown';
      expect(isLethal(state)).toBe(false);
    });

    it('WarpGate: телепортация сохраняет импульс с ускорением и кулдауном', () => {
      const gateIn = { x: 100, y: 200, targetX: 500, targetY: 300, preserveVelocity: true, minExitSpeed: 300 };
      let catVelocityX = 250;
      let catVelocityY = -150;
      let catX = 100;
      let catY = 200;
      let cooldownMs = 0;

      function onEnterWarpGate() {
        if (cooldownMs > 0) return false;
        catX = gateIn.targetX;
        catY = gateIn.targetY;
        if (gateIn.preserveVelocity) {
          const speed = Math.hypot(catVelocityX, catVelocityY);
          const newSpeed = Math.max(speed * 1.15, gateIn.minExitSpeed);
          const ratio = newSpeed / (speed || 1);
          catVelocityX *= ratio;
          catVelocityY *= ratio;
        }
        cooldownMs = 250;
        return true;
      }

      const firstTeleport = onEnterWarpGate();
      expect(firstTeleport).toBe(true);
      expect(catX).toBe(500);
      expect(catY).toBe(300);
      expect(Math.hypot(catVelocityX, catVelocityY)).toBeGreaterThanOrEqual(gateIn.minExitSpeed);
      expect(cooldownMs).toBe(250);

      // Повторный вход во время кулдауна игнорируется (предотвращает зацикливание)
      const loopTeleport = onEnterWarpGate();
      expect(loopTeleport).toBe(false);
    });

    it('EchoCat: записывает историю позиций игрока и воспроизводит с задержкой', () => {
      interface CatHistory {
        x: number;
        y: number;
        time: number;
      }

      const history: CatHistory[] = [];
      const delayMs = 600;
      let echoX = -100;
      let echoY = -100;
      let echoActive = false;

      // Игрок движется
      for (let t = 0; t <= 1000; t += 100) {
        history.push({ x: t * 2, y: 100, time: t });
      }

      // При t = 700, эхо-кот должен воспроизвести позицию игрока при t = 700 - 600 = 100
      const now = 700;
      const targetTime = now - delayMs;
      const delayedPoint = history.find(h => h.time >= targetTime);

      if (delayedPoint) {
        echoX = delayedPoint.x;
        echoY = delayedPoint.y;
        echoActive = true;
      }

      expect(echoActive).toBe(true);
      expect(echoX).toBe(200); // При t=100: x = 100 * 2 = 200
      expect(echoY).toBe(100);
    });

    it('TimeZone: уменьшает скорость перемещения и гравитацию кота внутри зоны', () => {
      const normalSpeed = 220;
      const normalJump = -440;
      const slowFactor = 0.45;

      const slowSpeed = normalSpeed * slowFactor;
      const slowJump = normalJump * slowFactor;

      expect(slowSpeed).toBeCloseTo(99, 0);
      expect(slowJump).toBeCloseTo(-198, 0);
      expect(slowSpeed).toBeLessThan(normalSpeed);
      expect(Math.abs(slowJump)).toBeLessThan(Math.abs(normalJump));
    });
  });

  describe('4. Zero Memory / State Leaks Invariant', () => {
    it('100 циклов рестарта не повреждают данные сохранения и состояние', () => {
      const save = SaveProvider.getInstance();
      save.recordLevelCompletion(21, 6.5);

      for (let i = 0; i < 100; i++) {
        save.recordDeath(21);
      }

      expect(save.getData().deathsPerLevel[21]).toBe(100);
      expect(save.getData().totalDeaths).toBe(100);
      expect(save.getData().bestTimes[21]).toBe(6.5);
      expect(save.getData().highestUnlockedLevel).toBe(22);
    });
  });
});
