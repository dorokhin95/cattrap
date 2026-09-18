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

  // Фазовые платформы над пропастями (полноценные двухблочные платформы вместо одиночных кубиков)
  glitchBlocks: [
    // Первая пропасть (x=7..18): Островки из 2 блоков с чередованием фаз A и B
    { id: 'gb_22_c1_1a', x: 8, y: 11, phaseGroup: 'A', activeMs: 1100, inactiveMs: 1100, initialPhase: 'active' },
    { id: 'gb_22_c1_1b', x: 9, y: 11, phaseGroup: 'A', activeMs: 1100, inactiveMs: 1100, initialPhase: 'active' },

    { id: 'gb_22_c1_2a', x: 12, y: 11, phaseGroup: 'B', activeMs: 1100, inactiveMs: 1100, initialPhase: 'inactive' },
    { id: 'gb_22_c1_2b', x: 13, y: 11, phaseGroup: 'B', activeMs: 1100, inactiveMs: 1100, initialPhase: 'inactive' },

    { id: 'gb_22_c1_3a', x: 16, y: 11, phaseGroup: 'A', activeMs: 1100, inactiveMs: 1100, initialPhase: 'active' },
    { id: 'gb_22_c1_3b', x: 17, y: 11, phaseGroup: 'A', activeMs: 1100, inactiveMs: 1100, initialPhase: 'active' },

    // Вторая пропасть (x=23..35): Островки из 2 блоков
    { id: 'gb_22_c2_4a', x: 24, y: 11, phaseGroup: 'A', activeMs: 1000, inactiveMs: 1000, initialPhase: 'active' },
    { id: 'gb_22_c2_4b', x: 25, y: 11, phaseGroup: 'A', activeMs: 1000, inactiveMs: 1000, initialPhase: 'active' },

    { id: 'gb_22_c2_5a', x: 28, y: 11, phaseGroup: 'B', activeMs: 1000, inactiveMs: 1000, initialPhase: 'inactive' },
    { id: 'gb_22_c2_5b', x: 29, y: 11, phaseGroup: 'B', activeMs: 1000, inactiveMs: 1000, initialPhase: 'inactive' },

    { id: 'gb_22_c2_6a', x: 32, y: 11, phaseGroup: 'A', activeMs: 1000, inactiveMs: 1000, initialPhase: 'active' },
    { id: 'gb_22_c2_6b', x: 33, y: 11, phaseGroup: 'A', activeMs: 1000, inactiveMs: 1000, initialPhase: 'active' }
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

  triggers: [
    // Неожиданная активация фазовых платформ первой пропасти при приближении к яме
    {
      id: 'trig_22_glitch1',
      conditionType: 'player_x_greater',
      conditionValue: 5.8,
      targetId: 'gb_22_c1_',
      action: 'trigger_glitch',
      once: true
    },
    // Неожиданная активация фазовых платформ второй пропасти при выходе с центрального островка
    {
      id: 'trig_22_glitch2',
      conditionType: 'player_x_greater',
      conditionValue: 21.5,
      targetId: 'gb_22_c2_',
      action: 'trigger_glitch',
      once: true
    }
  ]
};
