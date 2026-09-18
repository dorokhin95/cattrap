import { LevelData } from './LevelData';

export const level25: LevelData = {
  id: 25,
  chapter: 3,
  theme: 'chapter3',
  name: 'Вязкое время',
  width: 46,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Старт (x=0..6, y=11..13)
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 13 })),

    // Остров в зоне замедления (x=17..20, y=11..13)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 17 + i, y: 11 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 17 + i, y: 12 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 17 + i, y: 13 })),

    // Остров 2 в зоне замедления (x=27..29, y=10..13)
    ...Array.from({ length: 3 }, (_, i) => ({ x: 27 + i, y: 10 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 27 + i, y: 11 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 27 + i, y: 12 })),

    // Финишная платформа после выхода из зоны (x=36..45, y=11..13)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 36 + i, y: 11 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 36 + i, y: 12 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 36 + i, y: 13 })),

    // Стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 45, y: i }))
  ],

  // Зона замедления времени (Slow-Mo) от x=8 до x=34
  timeZones: [
    {
      id: 'tz_25_main',
      x: 21,
      y: 8,
      width: 26,
      height: 12,
      timeScale: 0.45
    }
  ],

  // Лазерные лучи в зоне замедления (паря в слоу-мо, нужно уклоняться)
  lasers: [
    {
      id: 'laser_25_1',
      x: 12,
      y: 2,
      length: 10,
      direction: 'vertical',
      warningMs: 400,
      activeMs: 600,
      cooldownMs: 1600,
      cycle: true
    },
    {
      id: 'laser_25_2',
      x: 23,
      y: 2,
      length: 10,
      direction: 'vertical',
      warningMs: 400,
      activeMs: 600,
      cooldownMs: 1600,
      cycle: true
    },
    {
      id: 'laser_25_3',
      x: 32,
      y: 2,
      length: 10,
      direction: 'vertical',
      warningMs: 400,
      activeMs: 600,
      cooldownMs: 1600,
      cycle: true
    }
  ],

  // Шипы на дне пропасти
  staticSpikes: [
    ...Array.from({ length: 10 }, (_, i) => ({ x: 7 + i, y: 14 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 21 + i, y: 14 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 30 + i, y: 14 }))
  ],

  portal: {
    x: 42,
    y: 10
  },

  triggers: []
};
