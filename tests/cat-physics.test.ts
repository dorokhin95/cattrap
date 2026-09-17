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
});
