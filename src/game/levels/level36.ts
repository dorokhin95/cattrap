import { LevelData } from './LevelData';

export const level36: LevelData = {
  id: 36,
  chapter: 4,
  theme: 'chapter4',
  name: 'Двойной капкан',
  width: 46,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Стартовая часть (x=0..12, y=11..13)
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 13 })),

    // Пол перед нишей (x=13..15, y=11..13)
    ...Array.from({ length: 3 }, (_, i) => ({ x: 13 + i, y: 11 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 13 + i, y: 12 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 13 + i, y: 13 })),

    // Укрытие 1 (карман в полу, x=16..17, пол на y=13)
    { x: 16, y: 13 }, { x: 17, y: 13 },

    // Пол коридора (x=18..33, y=11..13)
    ...Array.from({ length: 16 }, (_, i) => ({ x: 18 + i, y: 11 })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 18 + i, y: 12 })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 18 + i, y: 13 })),

    // Укрытие 2 (верхняя полка над коридором, x=23..26, y=8)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 23 + i, y: 8 })),

    // Финишная часть после ловушки (x=36..45, y=11..13)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 36 + i, y: 11 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 36 + i, y: 12 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 36 + i, y: 13 })),

    // Граничные стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 45, y: i }))
  ],

  // Шипы в яме сброса шаров (x=34..35)
  staticSpikes: [
    { x: 34, y: 14 },
    { x: 35, y: 14 }
  ],

  // Двойные валуны: 1-й сзади, 2-й спереди
  rollingBoulders: [
    {
      id: 'boulder_36_rear',
      x: 1,
      y: 9,
      speedX: 195,
      autoStart: false,
      bounce: 0.1
    },
    {
      id: 'boulder_36_front',
      x: 37,
      y: 9,
      speedX: -210,
      autoStart: false,
      bounce: 0.1
    }
  ],

  portal: {
    x: 42,
    y: 10
  },

  triggers: [
    // 1-й валун со спины
    {
      id: 'trig_36_rear',
      conditionType: 'player_x_greater',
      conditionValue: 7.0,
      targetId: 'boulder_36_rear',
      action: 'release_boulder',
      once: true
    },
    // 2-й валун навстречу, когда котик выходит из первой ниши
    {
      id: 'trig_36_front',
      conditionType: 'player_x_greater',
      conditionValue: 18.5,
      targetId: 'boulder_36_front',
      action: 'release_boulder',
      once: true
    }
  ]
};
