import { LevelData } from './LevelData';

export const level11: LevelData = {
  id: 11,
  chapter: 2,
  theme: 'chapter2',
  name: 'Подпрыгни',
  width: 34,
  height: 14,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Стартовая безопасная площадка (x=0..10, y=11)
    ...Array.from({ length: 11 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 11 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 11 }, (_, i) => ({ x: i, y: 13 })),

    // Section B: Широкая площадка приземления после ямы x=11..14 (x=15..22, y=11)
    ...Array.from({ length: 8 }, (_, i) => ({ x: 15 + i, y: 11 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 15 + i, y: 12 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 15 + i, y: 13 })),

    // Section C: Площадка приземления и финал (x=24..33, y=11)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 24 + i, y: 11 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 24 + i, y: 12 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 24 + i, y: 13 })),

    // Потолочная балка над батутом Section C (x=20..24, y=5)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 20 + i, y: 5 })),

    // Границы уровня (стены)
    ...Array.from({ length: 14 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 14 }, (_, i) => ({ x: 33, y: i }))
  ],

  // Батуты: 1 для обучения, 2 перед ямой, 3 со смещением от потолочной угрозы
  bouncePads: [
    { id: 'bp_intro', x: 5, y: 10 },
    { id: 'bp_gap', x: 10, y: 10 },
    { id: 'bp_steer', x: 21, y: 10 }
  ],

  // Статические шипы: потолочные шипы над траекторией Section C
  staticSpikes: [
    { x: 21, y: 6, upsideDown: true },
    { x: 22, y: 6, upsideDown: true }
  ],

  // Один знакомый PopSpike на финишной прямой
  popSpikes: [
    { id: 'ps_finish', x: 28, y: 10 }
  ],

  // Неподвижный честный портал
  portal: {
    x: 31,
    y: 10
  },

  triggers: [
    {
      id: 'trig_finish_pop',
      conditionType: 'player_x_greater',
      conditionValue: 26,
      targetId: 'ps_finish',
      action: 'pop'
    }
  ]
};
