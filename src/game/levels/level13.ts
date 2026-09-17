import { LevelData } from './LevelData';

export const level13: LevelData = {
  id: 13,
  chapter: 2,
  theme: 'chapter2',
  name: 'Лифт не ждёт',
  width: 40,
  height: 16,
  spawn: { x: 2, y: 11 },
  solidTiles: [
    // Section A: Стартовая платформа (x=0..5, y=12..14)
    ...Array.from({ length: 6 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: i, y: 13 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: i, y: 14 })),

    // Section A -> B промежуточная площадка (x=11..14, y=12..14)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 11 + i, y: 12 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 11 + i, y: 13 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 11 + i, y: 14 })),

    // Section B: Верхний этаж (x=18..23, y=7..8)
    ...Array.from({ length: 6 }, (_, i) => ({ x: 18 + i, y: 7 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 18 + i, y: 8 })),

    // Section C: Промежуточная стыковочная площадка (x=28..29, y=6)
    ...Array.from({ length: 2 }, (_, i) => ({ x: 28 + i, y: 6 })),

    // Финальная площадка (x=34..39, y=4..6)
    ...Array.from({ length: 6 }, (_, i) => ({ x: 34 + i, y: 4 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 34 + i, y: 5 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 34 + i, y: 6 })),

    // Стены
    ...Array.from({ length: 16 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 39, y: i }))
  ],

  // Смертельные шипы на дне всех ям под платформами (исключает застревание)
  staticSpikes: [
    // Под платформой Section A (x=6..10)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 6 + i, y: 15 })),
    // Под лифтом Section B (x=15..17)
    ...Array.from({ length: 3 }, (_, i) => ({ x: 15 + i, y: 15 })),
    // Под пересадкой Section C (x=24..27)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 24 + i, y: 15 })),
    // Под лифтом Section D к финишу (x=30..33)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 30 + i, y: 15 }))
  ],

  // Движущиеся платформы
  movingPlatforms: [
    // Section A: Горизонтальная платформа через яму (A -> B)
    {
      id: 'mp_horizontal_a',
      x: 6,
      y: 12,
      targetX: 10,
      targetY: 12,
      speed: 55,
      pingPong: true
    },
    // Section B: Вертикальный лифт на верхний этаж (y=12 -> y=7)
    {
      id: 'mp_vertical_b',
      x: 16,
      y: 12,
      targetX: 16,
      targetY: 7,
      speed: 60,
      pingPong: true
    },
    // Section C1: Горизонтальная пересадка (x=24 -> x=27)
    {
      id: 'mp_transfer_h',
      x: 24,
      y: 7,
      targetX: 27,
      targetY: 7,
      speed: 65,
      pingPong: true
    },
    // Section C2: Вертикальный лифт на финишную высоту (y=6 -> y=4)
    {
      id: 'mp_transfer_v',
      x: 31,
      y: 6,
      targetX: 31,
      targetY: 4,
      speed: 55,
      pingPong: true
    }
  ],

  portal: {
    x: 35,
    y: 3,
    targets: [
      { x: 38, y: 3 }
    ]
  },

  triggers: [
    {
      id: 'trig_portal_shift',
      conditionType: 'player_x_greater',
      conditionValue: 33,
      targetId: 'portal',
      action: 'move_portal',
      once: true
    }
  ]
};
