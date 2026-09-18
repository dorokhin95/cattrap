import { LevelData } from './LevelData';

export const level29: LevelData = {
  id: 29,
  chapter: 3,
  theme: 'chapter3',
  name: 'Охота на себя',
  width: 50,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Непрерывная коридорная трасса с препятствиями
    // Section A (x=0..12, y=11..13)
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 13 })),

    // Потолок над прессом Section B (x=17..21, y=3..4)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 17 + i, y: 3 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: 17 + i, y: 4 })),

    // Section B: Пол под прессом (x=14..25, y=11..13)
    ...Array.from({ length: 12 }, (_, i) => ({ x: 14 + i, y: 11 })),
    ...Array.from({ length: 12 }, (_, i) => ({ x: 14 + i, y: 12 })),
    ...Array.from({ length: 12 }, (_, i) => ({ x: 14 + i, y: 13 })),

    // Section C: Ступенчатый участок (x=28..37, y=10..13)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 28 + i, y: 10 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 28 + i, y: 11 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 28 + i, y: 12 })),

    // Section D: Финишная прямая (x=40..49, y=11..13)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 40 + i, y: 11 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 40 + i, y: 12 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 40 + i, y: 13 })),

    // Стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 49, y: i }))
  ],

  // Теневой двойник-эхо
  echoCat: {
    id: 'echo_29',
    delayMs: 780,
    autoStart: true
  },

  // Пресс-сюрприз (срабатывает при приближении, cycle: false)
  crushers: [
    {
      id: 'crush_29',
      x: 19,
      y: 5,
      targetX: 19,
      targetY: 10,
      orientation: 'down',
      warningMs: 220,
      slamMs: 120,
      retractMs: 300,
      cycle: false,
      autoStart: false
    }
  ],

  // Лазер-растяжка в секции ступеней
  lasers: [
    {
      id: 'laser_29_trip',
      x: 32,
      y: 2,
      length: 8,
      direction: 'vertical',
      warningMs: 220,
      activeMs: 450,
      tripwire: true,
      cycle: false,
      autoStart: false
    }
  ],

  // Выдвижные шипы
  popSpikes: [
    { id: 'ps_29_1', x: 23, y: 10 },
    { id: 'ps_29_2', x: 43, y: 10 }
  ],

  portal: {
    x: 46,
    y: 10
  },

  triggers: [
    // Активация пресса
    {
      id: 'trig_29_crush',
      conditionType: 'player_x_greater',
      conditionValue: 15.5,
      targetId: 'crush_29',
      action: 'crush',
      once: true
    },
    // Выдвижение первого шипа
    {
      id: 'trig_29_ps1',
      conditionType: 'player_x_greater',
      conditionValue: 21.0,
      targetId: 'ps_29_1',
      action: 'pop',
      once: true
    },
    // Выдвижение финишного шипа-сюрприза
    {
      id: 'trig_29_ps2',
      conditionType: 'player_x_greater',
      conditionValue: 40.5,
      targetId: 'ps_29_2',
      action: 'pop',
      once: true
    }
  ]
};
