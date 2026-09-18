import { LevelData } from './LevelData';

export const level27: LevelData = {
  id: 27,
  chapter: 3,
  theme: 'chapter3',
  name: 'Зеркальный лабиринт',
  width: 46,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Старт (x=0..6, y=11..13)
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 13 })),

    // Глухая разделительная стена
    ...Array.from({ length: 14 }, (_, i) => ({ x: 7, y: i })),

    // Section B (Изолированная комната реверса, x=10..22, y=11..13)
    ...Array.from({ length: 13 }, (_, i) => ({ x: 10 + i, y: 11 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: 10 + i, y: 12 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: 10 + i, y: 13 })),

    // Вторая стена
    ...Array.from({ length: 14 }, (_, i) => ({ x: 23, y: i })),

    // Section C: Финишный коридор (x=26..45, y=11..13)
    ...Array.from({ length: 20 }, (_, i) => ({ x: 26 + i, y: 11 })),
    ...Array.from({ length: 20 }, (_, i) => ({ x: 26 + i, y: 12 })),
    ...Array.from({ length: 20 }, (_, i) => ({ x: 26 + i, y: 13 })),

    // Стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 45, y: i }))
  ],

  // Варп-порталы связывают изолированные секции
  warpGates: [
    // Из зоны старта в изолированную комнату реверса
    {
      id: 'wg_27_1',
      x: 5,
      y: 10,
      targetX: 11,
      targetY: 10,
      exitImpulseX: 60
    },
    // Из комнаты реверса в финишную зону
    {
      id: 'wg_27_2',
      x: 21,
      y: 10,
      targetX: 28,
      targetY: 10,
      exitImpulseX: 80
    }
  ],

  // Зона инверсии управления покрывает всю Section B
  controlZones: [
    {
      id: 'cz_27_rev',
      x: 10,
      y: 8,
      width: 13,
      height: 4,
      type: 'reverse'
    },
    // Восстановление нормального управления в финишной зоне
    {
      id: 'cz_27_norm',
      x: 26,
      y: 8,
      width: 19,
      height: 4,
      type: 'normal'
    }
  ],

  // Шипы внутри реверс-комнаты (требуют маневрирования задом наперёд)
  staticSpikes: [
    { x: 14, y: 10 },
    { x: 17, y: 10 },
    { x: 34, y: 10 }
  ],

  // Выдвижной шип-сюрприз перед финишным порталом
  popSpikes: [
    { id: 'ps_27_troll', x: 39, y: 10 }
  ],

  portal: {
    x: 43,
    y: 10
  },

  triggers: [
    {
      id: 'trig_27_pop',
      conditionType: 'player_x_greater',
      conditionValue: 36.5,
      targetId: 'ps_27_troll',
      action: 'pop',
      once: true
    }
  ]
};
