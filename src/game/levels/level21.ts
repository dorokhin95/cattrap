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

  // Лазеры
  lasers: [
    // Лазер 1: Обучающий горизонтальный луч над ямой A-B
    {
      id: 'laser_21_1',
      x: 8,
      y: 9,
      length: 5,
      direction: 'horizontal',
      warningMs: 350,
      activeMs: 450,
      cooldownMs: 1400,
      cycle: true
    },
    // Лазер 2: Вертикальный луч, секущий переход на высокую ступень Section C
    {
      id: 'laser_21_2',
      x: 22,
      y: 3,
      length: 8,
      direction: 'vertical',
      warningMs: 320,
      activeMs: 450,
      cooldownMs: 1200,
      cycle: true
    },
    // Лазер 3: Скрытая растяжка (tripwire) над платформой Section C
    {
      id: 'laser_21_3_trip',
      x: 27,
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

  triggers: []
};
