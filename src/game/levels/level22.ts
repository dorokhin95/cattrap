import { LevelData } from './LevelData';

export const level22: LevelData = {
  id: 22,
  chapter: 3,
  theme: 'chapter3',
  name: 'Мерцающий шаг',
  width: 44,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Старт (x=0..6, y=11..13)
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 13 })),

    // Section B: Остров безопасности посередине (x=19..22, y=11..13)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 19 + i, y: 11 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 19 + i, y: 12 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 19 + i, y: 13 })),

    // Section C: Финишная платформа (x=36..43, y=11..13)
    ...Array.from({ length: 8 }, (_, i) => ({ x: 36 + i, y: 11 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 36 + i, y: 12 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 36 + i, y: 13 })),

    // Стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 43, y: i }))
  ],

  // Фазовые блоки над пропастями
  glitchBlocks: [
    // Первая пропасть (x=7..18): Группа A (активна первой) и B
    { id: 'gb_22_1', x: 8, y: 10, phaseGroup: 'A', activeMs: 1100, inactiveMs: 1100, initialPhase: 'active' },
    { id: 'gb_22_2', x: 11, y: 9, phaseGroup: 'A', activeMs: 1100, inactiveMs: 1100, initialPhase: 'active' },
    { id: 'gb_22_3', x: 14, y: 10, phaseGroup: 'B', activeMs: 1100, inactiveMs: 1100, initialPhase: 'inactive' },
    { id: 'gb_22_4', x: 17, y: 11, phaseGroup: 'B', activeMs: 1100, inactiveMs: 1100, initialPhase: 'inactive' },

    // Вторая пропасть (x=23..35): Чередование групп в ритме
    { id: 'gb_22_5', x: 24, y: 11, phaseGroup: 'A', activeMs: 1000, inactiveMs: 1000, initialPhase: 'active' },
    { id: 'gb_22_6', x: 27, y: 10, phaseGroup: 'B', activeMs: 1000, inactiveMs: 1000, initialPhase: 'inactive' },
    { id: 'gb_22_7', x: 30, y: 9, phaseGroup: 'A', activeMs: 1000, inactiveMs: 1000, initialPhase: 'active' },
    { id: 'gb_22_8', x: 33, y: 10, phaseGroup: 'B', activeMs: 1000, inactiveMs: 1000, initialPhase: 'inactive' }
  ],

  // Шипы на дне пропасти
  staticSpikes: [
    ...Array.from({ length: 12 }, (_, i) => ({ x: 7 + i, y: 14 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: 23 + i, y: 14 }))
  ],

  portal: {
    x: 40,
    y: 10
  },

  triggers: []
};
