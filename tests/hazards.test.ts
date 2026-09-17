import { describe, it, expect } from 'vitest';
import { CONSTANTS } from '../src/core/Constants';

describe('Hazards Fairness & Lethal Ratios', () => {
  it('доля смертельного хитбокса ловушек должна составлять 65-75%', () => {
    expect(CONSTANTS.HAZARD_HITBOX_RATIO).toBeGreaterThanOrEqual(0.65);
    expect(CONSTANTS.HAZARD_HITBOX_RATIO).toBeLessThanOrEqual(0.75);
  });

  it('тайминги выдвижных шипов и осыпающихся блоков должны соответствовать ТЗ', () => {
    // Pop Spike: около 120 мс
    expect(CONSTANTS.POP_SPIKE_RISE_TIME_MS).toBe(120);

    // Crumble: трещина 0мс, дрожь 150мс, падение 450мс
    expect(CONSTANTS.CRUMBLE_SHAKE_DELAY_MS).toBe(150);
    expect(CONSTANTS.CRUMBLE_FALL_DELAY_MS).toBe(450);

    // Fake Floor: опускание 180мс, падение 350мс
    expect(CONSTANTS.FAKE_FLOOR_DROP_DELAY_MS).toBe(180);
    expect(CONSTANTS.FAKE_FLOOR_VANISH_MS).toBe(350);
  });
});
