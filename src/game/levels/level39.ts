import { LevelData } from './LevelData';

export const level39: LevelData = {
  id: 39,
  chapter: 4,
  theme: 'chapter4',
  name: 'Лабиринт падающих плит',
  width: 48,
  height: 16,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Стартовая часть (x=0..6, y=11..13)
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 13 })),

    // Ложная верхняя ветка (x=8..22, y=6..7)
    ...Array.from({ length: 15 }, (_, i) => ({ x: 8 + i, y: 6 })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 8 + i, y: 7 })),

    // Истинная нижняя ветка: островки над шипами
    { x: 9, y: 11 }, { x: 10, y: 11 },
    { x: 13, y: 11 }, { x: 14, y: 11 },
    { x: 17, y: 11 }, { x: 18, y: 11 },
    { x: 21, y: 11 }, { x: 22, y: 11 },

    // Центральная соединительная площадка (x=23..27, y=11..13)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 23 + i, y: 11 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: 23 + i, y: 12 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: 23 + i, y: 13 })),

    // Столбы для прыжков перед финишем
    { x: 30, y: 11 },
    { x: 33, y: 10 },
    { x: 36, y: 9 },

    // Финишная площадка (x=39..47, y=8..10)
    ...Array.from({ length: 9 }, (_, i) => ({ x: 39 + i, y: 8 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: 39 + i, y: 9 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: 39 + i, y: 10 })),

    // Граничные стены
    ...Array.from({ length: 16 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 47, y: i }))
  ],

  // Каскад падающих плит на верхней ложной ветке
  fallingBlocks: [
    { id: 'fb_39_1', x: 12, y: 2, landingY: 5 },
    { id: 'fb_39_2', x: 16, y: 2, landingY: 5 },
    { id: 'fb_39_3', x: 20, y: 2, landingY: 5 }
  ],

  // Валун, срывающийся на центральной площадке и преследующий котика к столбам
  rollingBoulders: [
    {
      id: 'boulder_39',
      x: 21,
      y: 3,
      speedX: 200,
      autoStart: false,
      bounce: 0.1
    }
  ],

  // Шипы в нижних пропастях
  staticSpikes: [
    ...Array.from({ length: 16 }, (_, i) => ({ x: 7 + i, y: 15 })),
    ...Array.from({ length: 11 }, (_, i) => ({ x: 28 + i, y: 15 }))
  ],

  portal: {
    x: 44,
    y: 7
  },

  triggers: [
    {
      id: 'trig_39_trap',
      conditionType: 'player_x_greater',
      conditionValue: 9.0,
      targetId: 'fb_39_1',
      action: 'drop',
      once: true
    },
    {
      id: 'trig_39_boulder',
      conditionType: 'player_x_greater',
      conditionValue: 24.5,
      targetId: 'boulder_39',
      action: 'release_boulder',
      once: true
    }
  ]
};
