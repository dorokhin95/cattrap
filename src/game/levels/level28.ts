import { LevelData } from './LevelData';

export const level28: LevelData = {
  id: 28,
  chapter: 3,
  theme: 'chapter3',
  name: 'Фазовый автобег',
  width: 48,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Стартовая площадка разбега (x=0..6, y=11..13)
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 13 })),

    // Остров безопасности посередине (x=21..25, y=11..13)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 21 + i, y: 11 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: 21 + i, y: 12 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: 21 + i, y: 13 })),

    // Финишная площадка (x=40..47, y=11..13)
    ...Array.from({ length: 8 }, (_, i) => ({ x: 40 + i, y: 11 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 40 + i, y: 12 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 40 + i, y: 13 })),

    // Стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 47, y: i }))
  ],

  // Зоны управления: ритмичный автобег с передышкой на острове безопасности
  controlZones: [
    // Секция 1: Автобег от разбега до центрального острова
    {
      id: 'cz_28_auto1',
      x: 5,
      y: 9,
      width: 16,
      height: 3,
      type: 'autorun_right'
    },
    // Передышка на острове безопасности (нормальное управление)
    {
      id: 'cz_28_norm1',
      x: 21,
      y: 9,
      width: 4,
      height: 3,
      type: 'normal'
    },
    // Секция 2: Автобег от острова до финиша
    {
      id: 'cz_28_auto2',
      x: 25,
      y: 9,
      width: 15,
      height: 3,
      type: 'autorun_right'
    },
    // Финишная зона (нормальное управление)
    {
      id: 'cz_28_norm2',
      x: 40,
      y: 9,
      width: 8,
      height: 3,
      type: 'normal'
    }
  ],

  // Фазовые платформы: честный rhythm-run с комфортным окном 1100 мс
  glitchBlocks: [
    // Первая ритм-связка (над пропастью x=7..20)
    { id: 'gb_28_c1_1a', x: 9, y: 11, phaseGroup: 'A', activeMs: 1100, inactiveMs: 1100, initialPhase: 'active' },
    { id: 'gb_28_c1_1b', x: 10, y: 11, phaseGroup: 'A', activeMs: 1100, inactiveMs: 1100, initialPhase: 'active' },

    { id: 'gb_28_c1_2a', x: 13, y: 11, phaseGroup: 'B', activeMs: 1100, inactiveMs: 1100, initialPhase: 'inactive' },
    { id: 'gb_28_c1_2b', x: 14, y: 11, phaseGroup: 'B', activeMs: 1100, inactiveMs: 1100, initialPhase: 'inactive' },

    { id: 'gb_28_c1_3a', x: 17, y: 11, phaseGroup: 'A', activeMs: 1100, inactiveMs: 1100, initialPhase: 'active' },
    { id: 'gb_28_c1_3b', x: 18, y: 11, phaseGroup: 'A', activeMs: 1100, inactiveMs: 1100, initialPhase: 'active' },

    // Вторая ритм-связка (над пропастью x=26..39)
    { id: 'gb_28_c2_4a', x: 28, y: 11, phaseGroup: 'A', activeMs: 1100, inactiveMs: 1100, initialPhase: 'active' },
    { id: 'gb_28_c2_4b', x: 29, y: 11, phaseGroup: 'A', activeMs: 1100, inactiveMs: 1100, initialPhase: 'active' },

    { id: 'gb_28_c2_5a', x: 32, y: 11, phaseGroup: 'B', activeMs: 1100, inactiveMs: 1100, initialPhase: 'inactive' },
    { id: 'gb_28_c2_5b', x: 33, y: 11, phaseGroup: 'B', activeMs: 1100, inactiveMs: 1100, initialPhase: 'inactive' },

    { id: 'gb_28_c2_6a', x: 36, y: 11, phaseGroup: 'A', activeMs: 1100, inactiveMs: 1100, initialPhase: 'active' },
    { id: 'gb_28_c2_6b', x: 37, y: 11, phaseGroup: 'A', activeMs: 1100, inactiveMs: 1100, initialPhase: 'active' }
  ],

  // Сплошной слой шипов на дне пропастей
  staticSpikes: [
    ...Array.from({ length: 14 }, (_, i) => ({ x: 7 + i, y: 14 })),
    ...Array.from({ length: 14 }, (_, i) => ({ x: 26 + i, y: 14 }))
  ],

  portal: {
    x: 44,
    y: 10
  },

  triggers: [
    // Старт первой фазовой последовательности при входе в автобег
    {
      id: 'trig_28_glitch1',
      conditionType: 'player_x_greater',
      conditionValue: 5.0,
      targetId: 'gb_28_c1_',
      action: 'trigger_glitch',
      once: true
    },
    // Старт второй фазовой последовательности при выходе с острова безопасности
    {
      id: 'trig_28_glitch2',
      conditionType: 'player_x_greater',
      conditionValue: 25.0,
      targetId: 'gb_28_c2_',
      action: 'trigger_glitch',
      once: true
    }
  ]
};
