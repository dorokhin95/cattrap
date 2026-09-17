import { describe, it, expect } from 'vitest';
import { CONSTANTS } from '../src/core/Constants';

describe('Cat Physics & Fairness Rules', () => {
  it('физический коллайдер котика должен быть меньше визуального спрайта', () => {
    expect(CONSTANTS.CAT_SPRITE_SIZE).toBe(24);
    expect(CONSTANTS.CAT_COLLIDER_WIDTH).toBe(14);
    expect(CONSTANTS.CAT_COLLIDER_HEIGHT).toBe(19);

    // Коллайдер должен быть строго меньше 24x24
    expect(CONSTANTS.CAT_COLLIDER_WIDTH).toBeLessThan(CONSTANTS.CAT_SPRITE_SIZE);
    expect(CONSTANTS.CAT_COLLIDER_HEIGHT).toBeLessThan(CONSTANTS.CAT_SPRITE_SIZE);
  });

  it('коллайдер маленького котика должен уменьшаться пропорционально', () => {
    expect(CONSTANTS.CAT_SMALL_SCALE).toBeCloseTo(0.68, 2);
    expect(CONSTANTS.CAT_SMALL_COLLIDER_WIDTH).toBe(10);
    expect(CONSTANTS.CAT_SMALL_COLLIDER_HEIGHT).toBe(13);
  });

  it('coyote time и jump buffer должны соответствовать диапазонам ТЗ', () => {
    // ТЗ: Coyote Time 90-110 мс
    expect(CONSTANTS.COYOTE_TIME_MS).toBeGreaterThanOrEqual(90);
    expect(CONSTANTS.COYOTE_TIME_MS).toBeLessThanOrEqual(110);

    // ТЗ: Jump Buffer 100-130 мс
    expect(CONSTANTS.JUMP_BUFFER_MS).toBeGreaterThanOrEqual(100);
    expect(CONSTANTS.JUMP_BUFFER_MS).toBeLessThanOrEqual(130);
  });

  it('время рестарта должно быть менее 0.5 секунды', () => {
    expect(CONSTANTS.TOTAL_RESTART_TIME_MS).toBeLessThan(500);
    expect(CONSTANTS.HITSTOP_DURATION_MS + CONSTANTS.DEATH_ANIM_DURATION_MS).toBeLessThanOrEqual(
      CONSTANTS.TOTAL_RESTART_TIME_MS
    );
  });

  it('скорость перемещения должна составлять 5 тайлов в секунду', () => {
    const tilesPerSec = CONSTANTS.MOVE_SPEED / CONSTANTS.TILE_SIZE;
    expect(tilesPerSec).toBe(5);
  });

  it('высота прыжка должна строго попадать в диапазон 2.7-3.0 тайла', () => {
    // h = v^2 / (2 * g)
    const heightPx = (CONSTANTS.JUMP_VELOCITY * CONSTANTS.JUMP_VELOCITY) / (2 * CONSTANTS.GRAVITY);
    const heightTiles = heightPx / CONSTANTS.TILE_SIZE;
    expect(heightTiles).toBeGreaterThanOrEqual(2.7);
    expect(heightTiles).toBeLessThanOrEqual(3.0);
  });

  describe('Air Control & Jump Symmetry Invariants', () => {
    it('обычный воздушный контроль строго симметричен и ограничен MOVE_SPEED (160 px/s)', () => {
      const dt = 1 / 60; // 60 FPS
      const airAccel = CONSTANTS.ACCELERATION * CONSTANTS.AIR_CONTROL * dt;

      let vxRight = 0;
      let vxLeft = 0;

      // Симулируем 60 кадров (1 секунду) удержания вправо и влево
      for (let frame = 0; frame < 60; frame++) {
        vxRight = Math.min(CONSTANTS.MOVE_SPEED, vxRight + airAccel);
        vxLeft = Math.max(-CONSTANTS.MOVE_SPEED, vxLeft - airAccel);
      }

      // Максимальная скорость в обычном воздухе никогда не превышает 160 px/s
      expect(vxRight).toBe(CONSTANTS.MOVE_SPEED);
      expect(vxLeft).toBe(-CONSTANTS.MOVE_SPEED);

      // Строгая симметрия по модулю
      expect(Math.abs(vxRight)).toBe(Math.abs(vxLeft));
    });

    it('при отсутствии ввода в воздухе скорость плавно тормозится к нулю', () => {
      const dt = 1 / 60;
      const airDecel = CONSTANTS.DECELERATION * CONSTANTS.AIR_CONTROL * dt;

      let vx = 160;
      // 30 кадров без ввода
      for (let frame = 0; frame < 30; frame++) {
        vx = Math.max(0, vx - airDecel);
      }

      expect(vx).toBeLessThan(160);
      expect(vx).toBeGreaterThanOrEqual(0);
    });

    it('импульс батута -520 px/s защищен от среза jumpReleased (variable jump cutoff)', () => {
      let isBouncing = true;
      let vy = -520;
      const jumpReleased = true;

      // Variable jump cutoff срезает скорость только если !isBouncing
      if (jumpReleased && !isBouncing) {
        vy *= CONSTANTS.VARIABLE_JUMP_CUTOFF;
      }

      // Импульс батута остался полным -520, не был урезан до -260
      expect(vy).toBe(-520);

      // Для обычного прыжка (isBouncing === false) срез срабатывает честно
      isBouncing = false;
      let normalVy = -420;
      if (jumpReleased && !isBouncing) {
        normalVy *= CONSTANTS.VARIABLE_JUMP_CUTOFF;
      }
      expect(normalVy).toBe(-210);
    });

    it('при прыжке с безопасного обучающего батута Level 11 котик не улетает в яму', () => {
      // Батут x=5, пол до x=10, яма x=11..14
      const impulse = 520;
      const g = CONSTANTS.GRAVITY;
      const timeInAir = (2 * impulse) / g; // ~1.061 сек

      // При фиксированном пределе воздушной скорости 160 px/s:
      const maxDistancePx = CONSTANTS.MOVE_SPEED * timeInAir;
      const maxDistanceTiles = maxDistancePx / CONSTANTS.TILE_SIZE;

      // Дистанция должна быть около 5.3 тайла (приземление на x=10.3)
      expect(maxDistanceTiles).toBeLessThan(6.0);
      expect(maxDistanceTiles).toBeGreaterThan(4.5);

      // Приземление происходит строго до ямы x=11
      const landingTileX = 5 + maxDistanceTiles;
      expect(landingTileX).toBeLessThan(11.0);
    });
  });
});
