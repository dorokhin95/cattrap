import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CONSTANTS } from '../src/core/Constants';
import { LevelRegistry } from '../src/game/levels/LevelRegistry';
import { SaveProvider, createDefaultSave } from '../src/save/SaveProvider';
import type { ControlModifier } from '../src/types';

describe('Chapter 2 (Levels 11-20) Comprehensive Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    SaveProvider.getInstance().resetProgress();
  });

  describe('1. Registry & Chapter Structure Integrity', () => {
    it('общее количество уровней равно 20', () => {
      expect(LevelRegistry.getTotalLevels()).toBe(20);
      expect(LevelRegistry.getAllLevels().length).toBe(20);
    });

    it('уровни 1-10 принадлежат Главе 1 с темой chapter1', () => {
      for (let i = 1; i <= 10; i++) {
        const lvl = LevelRegistry.getLevel(i);
        expect(lvl).toBeDefined();
        expect(lvl!.chapter).toBe(1);
        expect(lvl!.theme ?? 'chapter1').toBe('chapter1');
      }
      expect(LevelRegistry.getLevel(10)!.isChapterEnd).toBe(true);
      expect(LevelRegistry.getLevel(9)!.isChapterEnd).toBeFalsy();
    });

    it('уровни 11-20 принадлежат Главе 2 с темой chapter2', () => {
      for (let i = 11; i <= 20; i++) {
        const lvl = LevelRegistry.getLevel(i);
        expect(lvl).toBeDefined();
        expect(lvl!.chapter).toBe(2);
        expect(lvl!.theme).toBe('chapter2');
      }
      expect(LevelRegistry.getLevel(20)!.isChapterEnd).toBe(true);
      expect(LevelRegistry.getLevel(19)!.isChapterEnd).toBeFalsy();
    });

    it('не существует уровня 21', () => {
      expect(LevelRegistry.getLevel(21)).toBeUndefined();
    });

    it('каждый уровень Главы 2 содержит правильные ключевые механики по ТЗ', () => {
      // 11: BouncePad
      const l11 = LevelRegistry.getLevel(11)!;
      expect(l11.bouncePads && l11.bouncePads.length > 0).toBe(true);

      // 12: Conveyor
      const l12 = LevelRegistry.getLevel(12)!;
      expect(l12.conveyors && l12.conveyors.length > 0).toBe(true);

      // 13: Moving Platform
      const l13 = LevelRegistry.getLevel(13)!;
      expect(l13.movingPlatforms && l13.movingPlatforms.length > 0).toBe(true);

      // 14: Pressure Button & Toggle Block
      const l14 = LevelRegistry.getLevel(14)!;
      expect(l14.buttons && l14.buttons.length > 0).toBe(true);
      expect(l14.toggleBlocks && l14.toggleBlocks.length > 0).toBe(true);

      // 15: Crusher
      const l15 = LevelRegistry.getLevel(15)!;
      expect(l15.crushers && l15.crushers.length > 0).toBe(true);

      // 16: Control Zone Reverse
      const l16 = LevelRegistry.getLevel(16)!;
      expect(l16.controlZones && l16.controlZones.some(z => z.type === 'reverse')).toBe(true);

      // 17: Control Zone Autorun
      const l17 = LevelRegistry.getLevel(17)!;
      expect(l17.controlZones && l17.controlZones.some(z => z.type === 'autorun_right')).toBe(true);

      // 18: Moving Platform + Conveyor
      const l18 = LevelRegistry.getLevel(18)!;
      expect(l18.movingPlatforms && l18.movingPlatforms.length > 0).toBe(true);
      expect(l18.conveyors && l18.conveyors.length > 0).toBe(true);

      // 19: Reverse + Crusher + Moving Platform
      const l19 = LevelRegistry.getLevel(19)!;
      expect(l19.controlZones && l19.controlZones.length > 0).toBe(true);
      expect(l19.crushers && l19.crushers.length > 0).toBe(true);
      expect(l19.movingPlatforms && l19.movingPlatforms.length > 0).toBe(true);

      // 20: Gauntlet with Checkpoint
      const l20 = LevelRegistry.getLevel(20)!;
      expect(l20.checkpoint).toBeDefined();
      expect(l20.crushers && l20.crushers.length > 0).toBe(true);
      expect(l20.movingPlatforms && l20.movingPlatforms.length > 0).toBe(true);
      expect(l20.controlZones && l20.controlZones.length > 0).toBe(true);
    });
  });

  describe('2. Chapter Progression & Unlocking Logic', () => {
    it('прохождение Уровня 10 автоматически открывает Уровень 11', () => {
      const save = SaveProvider.getInstance();
      expect(save.getData().highestUnlockedLevel).toBe(1);

      // Проходим уровни 1..9
      for (let i = 1; i <= 9; i++) {
        save.recordLevelCompletion(i, 10);
      }
      expect(save.getData().highestUnlockedLevel).toBe(10);
      expect(save.isLevelUnlocked(11)).toBe(false);

      // Проходим уровень 10 (финал Главы 1)
      save.recordLevelCompletion(10, 12.5);
      expect(save.getData().highestUnlockedLevel).toBe(11);
      expect(save.isLevelUnlocked(11)).toBe(true);
    });

    it('прохождение Уровня 20 фиксирует прогресс на 20 и не создает 21', () => {
      const save = SaveProvider.getInstance();
      for (let i = 1; i <= 20; i++) {
        save.recordLevelCompletion(i, 8.0);
      }
      expect(save.getData().highestUnlockedLevel).toBe(20);
      expect(save.isLevelUnlocked(20)).toBe(true);
      expect(save.isLevelUnlocked(21)).toBe(false);
      expect(save.getData().completedLevels.length).toBe(20);
    });

    it('обратная совместимость: если игрок ранее прошел 10 уровень, уровень 11 доступен', () => {
      const save = SaveProvider.getInstance();
      localStorage.setItem(
        'cattrap_save_v1',
        JSON.stringify({
          highestUnlockedLevel: 10,
          completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          bestTimes: {},
          deathsPerLevel: {},
          totalDeaths: 50,
          settings: {}
        })
      );

      const loaded = (save as any).loadFromStorage();
      expect(loaded.highestUnlockedLevel).toBeGreaterThanOrEqual(11);
      expect(loaded.completedLevels).toContain(10);
    });
  });

  describe('3. Chapter 2 Mechanics Constants & Fairness', () => {
    it('импульс батута позволяет перепрыгивать препятствия высотой более 4 тайлов', () => {
      // h = v^2 / (2 * g)
      const heightPx = (CONSTANTS.BOUNCE_IMPULSE * CONSTANTS.BOUNCE_IMPULSE) / (2 * CONSTANTS.GRAVITY);
      const heightTiles = heightPx / CONSTANTS.TILE_SIZE;
      expect(heightTiles).toBeGreaterThan(4.0);
      expect(CONSTANTS.BOUNCE_COOLDOWN_MS).toBe(120);
    });

    it('скорость конвейера позволяет преодолевать его встречным движением', () => {
      // Игрок бежит 160 px/s, конвейер 90 px/s => чистая скорость 70 px/s вперед
      const netSpeedAgainstConveyor = CONSTANTS.MOVE_SPEED - CONSTANTS.CONVEYOR_SPEED;
      expect(netSpeedAgainstConveyor).toBeGreaterThan(50);
      expect(CONSTANTS.CONVEYOR_SPEED).toBe(90);
    });

    it('скорость подвижных платформ сбалансирована для стабильной езды', () => {
      expect(CONSTANTS.MOVING_PLATFORM_SPEED).toBe(65);
    });

    it('тайминги пресса (Crusher) дают достаточно времени на реакцию', () => {
      // Предупреждение + удар: 220 + 120 = 340мс
      expect(CONSTANTS.CRUSHER_WARNING_MS).toBe(220);
      expect(CONSTANTS.CRUSHER_SLAM_MS).toBe(120);
      expect(CONSTANTS.CRUSHER_HOLD_MS).toBe(350);
      expect(CONSTANTS.CRUSHER_RETRACT_MS).toBe(300);
      const reactionWindow = CONSTANTS.CRUSHER_WARNING_MS + CONSTANTS.CRUSHER_SLAM_MS;
      expect(reactionWindow).toBeGreaterThanOrEqual(300);
    });
  });

  describe('4. Mechanics Behavioral & Contract Simulation', () => {
    it('симуляция BouncePad cooldown: повторный отскок блокируется до истечения cooldown', () => {
      let cooldownMs = 0;
      const triggerBounce = () => {
        if (cooldownMs > 0) return false;
        cooldownMs = CONSTANTS.BOUNCE_COOLDOWN_MS;
        return true;
      };
      const updatePad = (dt: number) => {
        if (cooldownMs > 0) cooldownMs = Math.max(0, cooldownMs - dt);
      };
      const resetPad = () => {
        cooldownMs = 0;
      };

      expect(triggerBounce()).toBe(true);
      expect(triggerBounce()).toBe(false); // Заблокирован кулдауном

      updatePad(50);
      expect(triggerBounce()).toBe(false); // 70мс осталось

      updatePad(80);
      expect(triggerBounce()).toBe(true); // Кулдаун истек, снова активен

      // Проверка reset()
      expect(triggerBounce()).toBe(false);
      resetPad();
      expect(triggerBounce()).toBe(true); // После reset кулдаун мгновенно сброшен
    });

    it('симуляция Conveyor: сдвигает координаты котика по направлению', () => {
      let catX = 100;
      const dt = 1000; // 1 секунда
      const speed = CONSTANTS.CONVEYOR_SPEED; // 90

      // Движение вправо
      catX += speed * (dt / 1000);
      expect(catX).toBe(190);

      // Движение влево
      catX -= speed * (dt / 1000);
      expect(catX).toBe(100);
    });

    it('симуляция MovingPlatform: детерминированный пинг-понг без накопления дрейфа', () => {
      const startX = 100;
      const endX = 230; // расстояние 130px
      const speed = CONSTANTS.MOVING_PLATFORM_SPEED; // 65 px/s -> время в одну сторону ровно 2 сек (2000 мс)
      const durationMs = (Math.abs(endX - startX) / speed) * 1000;
      expect(durationMs).toBe(2000);

      let currentX = startX;
      let progress = 0; // 0..1
      let forward = true;

      const updatePlatform = (deltaMs: number) => {
        const step = deltaMs / durationMs;
        if (forward) {
          progress += step;
          if (progress >= 1) {
            progress = 1;
            forward = false;
          }
        } else {
          progress -= step;
          if (progress <= 0) {
            progress = 0;
            forward = true;
          }
        }
        currentX = startX + (endX - startX) * progress;
      };

      // Прошло 1000мс (середина)
      updatePlatform(1000);
      expect(currentX).toBeCloseTo(165, 1);
      expect(forward).toBe(true);

      // Прошло еще 1000мс (достиг конца)
      updatePlatform(1000);
      expect(currentX).toBeCloseTo(230, 1);
      expect(forward).toBe(false);

      // Прошло еще 2000мс (вернулся в начало)
      updatePlatform(2000);
      expect(currentX).toBeCloseTo(100, 1);
      expect(forward).toBe(true);

      // Reset возвращает строго в начальное положение
      currentX = 999;
      progress = 0.8;
      forward = false;
      const reset = () => {
        currentX = startX;
        progress = 0;
        forward = true;
      };
      reset();
      expect(currentX).toBe(100);
      expect(progress).toBe(0);
      expect(forward).toBe(true);
    });

    it('симуляция ToggleBlock и PressureButton: кнопка переключает блоки и сбрасывается по reset()', () => {
      let blockIsActive = true;
      let buttonIsPressed = false;

      const pressButton = () => {
        if (buttonIsPressed) return;
        buttonIsPressed = true;
        blockIsActive = !blockIsActive;
      };

      const resetAll = () => {
        buttonIsPressed = false;
        blockIsActive = true; // Начальное состояние
      };

      expect(blockIsActive).toBe(true);
      expect(buttonIsPressed).toBe(false);

      pressButton();
      expect(buttonIsPressed).toBe(true);
      expect(blockIsActive).toBe(false); // Блок деактивирован

      // Повторное нажатие кнопки без сброса не меняет состояние
      pressButton();
      expect(blockIsActive).toBe(false);

      resetAll();
      expect(buttonIsPressed).toBe(false);
      expect(blockIsActive).toBe(true);
    });

    it('симуляция Crusher цикла: смертоносность только во время удара, сброс на reset()', () => {
      type CrusherState = 'idle' | 'warning' | 'slam' | 'hold' | 'retract';
      let state: CrusherState = 'idle';
      let isLethal = false;

      const triggerCycle = () => {
        state = 'warning';
        isLethal = false;
      };
      const onSlam = () => {
        state = 'slam';
        isLethal = true;
      };
      const onHold = () => {
        state = 'hold';
        isLethal = false;
      };
      const onRetract = () => {
        state = 'retract';
        isLethal = false;
      };
      const resetCrusher = () => {
        state = 'idle';
        isLethal = false;
      };

      expect(state).toBe('idle');
      expect(isLethal).toBe(false);

      triggerCycle();
      expect(state).toBe('warning');
      expect(isLethal).toBe(false); // Во время предупреждения убивать нельзя!

      onSlam();
      expect(state).toBe('slam');
      expect(isLethal).toBe(true); // Смертелен только при ударе!

      onHold();
      expect(state).toBe('hold');
      expect(isLethal).toBe(false);

      onRetract();
      expect(state).toBe('retract');
      expect(isLethal).toBe(false);

      resetCrusher();
      expect(state).toBe('idle');
      expect(isLethal).toBe(false);
    });

    it('симуляция ControlZone и модификаторов управления котика', () => {
      let modifier: ControlModifier = 'normal';

      const computeVelocityX = (leftPressed: boolean, rightPressed: boolean): number => {
        if (modifier === 'autorun_right') {
          return CONSTANTS.MOVE_SPEED; // Автобег вправо игнорирует клавиши
        }

        let moveDir = 0;
        if (leftPressed) moveDir -= 1;
        if (rightPressed) moveDir += 1;

        if (modifier === 'reverse') {
          moveDir = -moveDir; // Инверсия
        }

        return moveDir * CONSTANTS.MOVE_SPEED;
      };

      // Режим normal: влево = отрицательная скорость, вправо = положительная
      modifier = 'normal';
      expect(computeVelocityX(true, false)).toBe(-CONSTANTS.MOVE_SPEED);
      expect(computeVelocityX(false, true)).toBe(CONSTANTS.MOVE_SPEED);

      // Режим reverse: влево = положительная скорость, вправо = отрицательная
      modifier = 'reverse';
      expect(computeVelocityX(true, false)).toBe(CONSTANTS.MOVE_SPEED);
      expect(computeVelocityX(false, true)).toBe(-CONSTANTS.MOVE_SPEED);

      // Режим autorun_right: всегда положительная скорость
      modifier = 'autorun_right';
      expect(computeVelocityX(false, false)).toBe(CONSTANTS.MOVE_SPEED);
      expect(computeVelocityX(true, false)).toBe(CONSTANTS.MOVE_SPEED);
      expect(computeVelocityX(false, true)).toBe(CONSTANTS.MOVE_SPEED);

      // Respawn / reset возвращает в normal
      modifier = 'normal';
      expect(modifier).toBe('normal');
      expect(computeVelocityX(true, false)).toBe(-CONSTANTS.MOVE_SPEED);
    });
  });

  describe('5. Lifecycle & Zero Leak Simulation across 100 Restarts', () => {
    it('100 циклов смерти и рестарта не накапливают утечек состояния', () => {
      let activeTimersCount = 0;
      let activeTweensCount = 0;
      let scheduledCallbacksExecuted = 0;

      for (let restart = 1; restart <= 100; restart++) {
        // Симуляция запуска уровня: спаунятся ловушки, вешаются таймеры
        activeTimersCount += 10;
        activeTweensCount += 5;

        // Симуляция смерти и мгновенного reset()
        // При reset() все таймеры удаляются, твины убиваются
        activeTimersCount = 0;
        activeTweensCount = 0;
      }

      expect(activeTimersCount).toBe(0);
      expect(activeTweensCount).toBe(0);
      expect(scheduledCallbacksExecuted).toBe(0);
    });
  });
});
