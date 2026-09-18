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

    // Остров 1 в зоне замедления (x=10..13, y=11..13)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 10 + i, y: 11 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 10 + i, y: 12 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 10 + i, y: 13 })),

    // Остров 2 в зоне замедления (x=18..21, y=11..13)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 18 + i, y: 11 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 18 + i, y: 12 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 18 + i, y: 13 })),

    // Остров 3 в зоне замедления (x=26..29, y=10..13)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 26 + i, y: 10 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 26 + i, y: 11 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 26 + i, y: 12 })),

    // Финишная платформа после выхода из зоны (x=34..45, y=11..13)
    ...Array.from({ length: 12 }, (_, i) => ({ x: 34 + i, y: 11 })),
    ...Array.from({ length: 12 }, (_, i) => ({ x: 34 + i, y: 12 })),
    ...Array.from({ length: 12 }, (_, i) => ({ x: 34 + i, y: 13 })),

    // Стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 45, y: i }))
  ],

  // Зона замедления времени (Slow-Mo) от x=6 до x=36
  timeZones: [
    {
      id: 'tz_25_main',
      x: 6,
      y: 1,
      width: 30,
      height: 13,
      timeScale: 0.45
    }
  ],

  // Лазерные лучи между островами в зоне замедления (срабатывают при приближении котика)
  lasers: [
    {
      id: 'laser_25_1',
      x: 15,
      y: 2,
      length: 10,
      direction: 'vertical',
      warningMs: 250,
      activeMs: 650,
      cooldownMs: 1600,
      cycle: false,
      autoStart: false
    },
    {
      id: 'laser_25_2',
      x: 23,
      y: 2,
      length: 10,
      direction: 'vertical',
      warningMs: 250,
      activeMs: 650,
      cooldownMs: 1600,
      cycle: false,
      autoStart: false
    },
    {
      id: 'laser_25_3',
      x: 31,
      y: 2,
      length: 10,
      direction: 'vertical',
      warningMs: 250,
      activeMs: 650,
      cooldownMs: 1600,
      cycle: false,
      autoStart: false
    }
  ],

  // Шипы на дне пропастей между островами
  staticSpikes: [
    ...Array.from({ length: 3 }, (_, i) => ({ x: 7 + i, y: 14 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 14 + i, y: 14 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 22 + i, y: 14 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 30 + i, y: 14 }))
  ],

  portal: {
    x: 42,
    y: 10
  },

  triggers: [
    {
      id: 'trig_25_1',
      conditionType: 'player_x_greater',
      conditionValue: 12.0,
      targetId: 'laser_25_1',
      action: 'fire_laser',
      once: true
    },
    {
      id: 'trig_25_2',
      conditionType: 'player_x_greater',
      conditionValue: 20.0,
      targetId: 'laser_25_2',
      action: 'fire_laser',
      once: true
    },
    {
      id: 'trig_25_3',
      conditionType: 'player_x_greater',
      conditionValue: 28.0,
      targetId: 'laser_25_3',
      action: 'fire_laser',
      once: true
    }
  ]
};
