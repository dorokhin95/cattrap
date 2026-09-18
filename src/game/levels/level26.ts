import { LevelData } from './LevelData';

export const level26: LevelData = {
  id: 26,
  chapter: 3,
  theme: 'chapter3',
  name: 'Лазерный конвейер',
  width: 48,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Старт (x=0..6, y=11..13)
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 13 })),

    // Основа под конвейер 1 (x=8..18, y=12..13)
    ...Array.from({ length: 11 }, (_, i) => ({ x: 8 + i, y: 12 })),
    ...Array.from({ length: 11 }, (_, i) => ({ x: 8 + i, y: 13 })),

    // Остров с батутом (x=22..25, y=11..13)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 22 + i, y: 11 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 22 + i, y: 12 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 22 + i, y: 13 })),

    // Стена-препятствие над ямой
    ...Array.from({ length: 3 }, (_, i) => ({ x: 27, y: 7 + i })),

    // Основа под встречный конвейер 2 (x=28..37, y=12..13)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 28 + i, y: 12 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 28 + i, y: 13 })),

    // Финиш (x=41..47, y=11..13)
    ...Array.from({ length: 7 }, (_, i) => ({ x: 41 + i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 41 + i, y: 12 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 41 + i, y: 13 })),

    // Стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 47, y: i }))
  ],

  // Конвейеры
  conveyors: [
    // Конвейер 1: толкает вправо навстречу горизонтальному лазеру
    ...Array.from({ length: 11 }, (_, i) => ({
      id: `conv_26_1_${i}`,
      x: 8 + i,
      y: 11,
      direction: 'right' as const,
      speed: 95
    })),
    // Конвейер 2: встречный (толкает влево назад под вертикальный лазер)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `conv_26_2_${i}`,
      x: 28 + i,
      y: 11,
      direction: 'left' as const,
      speed: 85
    }))
  ],

  // Батут на острове
  bouncePads: [
    { id: 'bp_26', x: 24, y: 10, power: -520 }
  ],

  // Лазеры - внезапные засады
  lasers: [
    // Горизонтальный лазер над первым конвейером (срабатывает при входе на конвейер)
    {
      id: 'laser_26_h',
      x: 9,
      y: 10,
      length: 8,
      direction: 'horizontal',
      warningMs: 140,
      activeMs: 480,
      cooldownMs: 1300,
      cycle: false,
      autoStart: false
    },
    // Вертикальный лазер над траекторией отскока батута (срабатывает при прыжке на батут)
    {
      id: 'laser_26_v1',
      x: 26,
      y: 1,
      length: 8,
      direction: 'vertical',
      warningMs: 140,
      activeMs: 450,
      cooldownMs: 1200,
      cycle: false,
      autoStart: false
    },
    // Лазер над вторым конвейером (срабатывает при приземлении)
    {
      id: 'laser_26_v2',
      x: 34,
      y: 3,
      length: 8,
      direction: 'vertical',
      warningMs: 140,
      activeMs: 450,
      cooldownMs: 1400,
      cycle: false,
      autoStart: false
    }
  ],

  staticSpikes: [
    { x: 7, y: 11 },
    { x: 20, y: 14 },
    { x: 21, y: 14 },
    { x: 39, y: 14 },
    { x: 40, y: 14 }
  ],

  portal: {
    x: 44,
    y: 10
  },

  triggers: [
    {
      id: 'trig_26_1',
      conditionType: 'player_x_greater',
      conditionValue: 8.5,
      targetId: 'laser_26_h',
      action: 'fire_laser',
      once: true
    },
    {
      id: 'trig_26_2',
      conditionType: 'player_x_greater',
      conditionValue: 23.0,
      targetId: 'laser_26_v1',
      action: 'fire_laser',
      once: true
    },
    {
      id: 'trig_26_3',
      conditionType: 'player_x_greater',
      conditionValue: 29.5,
      targetId: 'laser_26_v2',
      action: 'fire_laser',
      once: true
    }
  ]
};
