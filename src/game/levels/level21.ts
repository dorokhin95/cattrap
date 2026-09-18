import { LevelData } from './LevelData';

export const level21: LevelData = {
  id: 21,
  chapter: 3,
  theme: 'chapter3',
  name: 'Системный сбой',
  width: 44,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Стартовая площадка (x=0..8, y=11..13)
    ...Array.from({ length: 9 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: i, y: 13 })),

    // Section B: Остров между лазерами (x=13..20, y=11..13)
    ...Array.from({ length: 8 }, (_, i) => ({ x: 13 + i, y: 11 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 13 + i, y: 12 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 13 + i, y: 13 })),

    // Section C: Высокая ступень (x=24..30, y=10..13)
    ...Array.from({ length: 7 }, (_, i) => ({ x: 24 + i, y: 10 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 24 + i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 24 + i, y: 12 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 24 + i, y: 13 })),

    // Section D: Финишная платформа (x=34..43, y=11..13)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 34 + i, y: 11 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 34 + i, y: 12 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 34 + i, y: 13 })),

    // Стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 43, y: i }))
  ],

  // Лазеры - скрытые ловушки-засады (по правилам CatTrap)
  lasers: [
    // Лазер 1: Скрытый горизонтальный луч над ямой A-B, срабатывает при попытке прыжка
    {
      id: 'laser_21_1',
      x: 8,
      y: 9,
      length: 5,
      direction: 'horizontal',
      warningMs: 120,
      activeMs: 500,
      cooldownMs: 1400,
      cycle: false,
      autoStart: false
    },
    // Лазер 2: Скрытый вертикальный луч перед ступенью C, срабатывает при разбеге
    {
      id: 'laser_21_2',
      x: 22,
      y: 3,
      length: 8,
      direction: 'vertical',
      warningMs: 140,
      activeMs: 500,
      cooldownMs: 1200,
      cycle: false,
      autoStart: false
    },
    // Лазер 3: Секущий горизонтальный луч над платформой Section C (можно перепрыгнуть или забайтить)
    {
      id: 'laser_21_3',
      x: 26,
      y: 9,
      length: 4,
      direction: 'horizontal',
      warningMs: 160,
      activeMs: 450,
      cooldownMs: 1200,
      cycle: false,
      autoStart: false
    }
  ],

  // Шипы на дне ям
  staticSpikes: [
    { x: 10, y: 14 },
    { x: 11, y: 14 },
    { x: 31, y: 14 },
    { x: 32, y: 14 }
  ],

  portal: {
    x: 40,
    y: 10
  },

  triggers: [
    // Внезапная активация Лазера 1 при попытке перепрыгнуть яму
    {
      id: 'trig_21_laser1',
      conditionType: 'player_x_greater',
      conditionValue: 8.0,
      targetId: 'laser_21_1',
      action: 'fire_laser',
      once: true
    },
    // Внезапная активация Лазера 2 при попытке запрыгнуть на высокую ступень C
    {
      id: 'trig_21_laser2',
      conditionType: 'player_x_greater',
      conditionValue: 20.0,
      targetId: 'laser_21_2',
      action: 'fire_laser',
      once: true
    },
    // Внезапная активация Лазера 3 при продвижении по платформе C (срабатывает заранее на x=24.8)
    {
      id: 'trig_21_laser3',
      conditionType: 'player_x_greater',
      conditionValue: 24.8,
      targetId: 'laser_21_3',
      action: 'fire_laser',
      once: true
    }
  ]
};
