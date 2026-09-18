import { LevelData } from './LevelData';

export const level33: LevelData = {
  id: 33,
  chapter: 4,
  theme: 'chapter4',
  name: 'Лабиринт катакомб',
  width: 46,
  height: 16,
  spawn: { x: 2, y: 3 },
  solidTiles: [
    // Уровень 1 (Верхний ярус): пол на y=4 для x=0..18, потолок на y=1 для x=0..22
    ...Array.from({ length: 19 }, (_, i) => ({ x: i, y: 4 })),
    ...Array.from({ length: 23 }, (_, i) => ({ x: i, y: 1 })),
    // Тупиковая стена справа верхнего яруса (x=22, y=1..5)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 22, y: 1 + i })),

    // Уровень 2 (Средний ярус): пол на y=9 для x=6..36, потолок на y=5 для x=6..21
    ...Array.from({ length: 31 }, (_, i) => ({ x: 6 + i, y: 9 })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 6 + i, y: 5 })),
    // Стена тупика среднего яруса справа
    ...Array.from({ length: 5 }, (_, i) => ({ x: 36, y: 5 + i })),

    // Уровень 3 (Нижний ярус): пол на y=14 для x=0..45, потолок на y=10 для x=12..45
    ...Array.from({ length: 46 }, (_, i) => ({ x: i, y: 14 })),
    ...Array.from({ length: 34 }, (_, i) => ({ x: 12 + i, y: 10 })),

    // Граничные стены
    ...Array.from({ length: 16 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 45, y: i }))
  ],

  // Шипы в тупиках и яме нижнего яруса
  staticSpikes: [
    { x: 34, y: 8 },
    { x: 35, y: 8 },
    { x: 23, y: 13 },
    { x: 24, y: 13 }
  ],

  // Валун на среднем ярусе: на x=24, y=7, катится влево со скоростью -195 px/s
  rollingBoulders: [
    {
      id: 'boulder_33',
      x: 24,
      y: 7,
      speedX: -195,
      autoStart: false,
      bounce: 0.1
    }
  ],

  portal: {
    x: 42,
    y: 12
  },

  triggers: [
    // Срыв валуна при падении котика на средний ярус
    {
      id: 'trig_33_boulder',
      conditionType: 'player_x_greater',
      conditionValue: 17.5,
      targetId: 'boulder_33',
      action: 'release_boulder',
      once: true
    }
  ]
};
