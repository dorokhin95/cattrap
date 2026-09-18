import { LevelData } from './LevelData';

export const level40: LevelData = {
  id: 40,
  chapter: 4,
  theme: 'chapter4',
  name: 'Горизонт катакомб',
  isChapterEnd: true,
  width: 66,
  height: 18,
  spawn: { x: 2, y: 5 },
  solidTiles: [
    // Секция A (Великий спуск):
    // Верхняя стартовая площадка (x=0..5, y=6..8)
    ...Array.from({ length: 6 }, (_, i) => ({ x: i, y: 6 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: i, y: 7 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: i, y: 8 })),

    // Ступень 1 (x=8..10, y=8..9)
    ...Array.from({ length: 3 }, (_, i) => ({ x: 8 + i, y: 8 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 8 + i, y: 9 })),

    // Ступень 2 (x=13..15, y=10..11)
    ...Array.from({ length: 3 }, (_, i) => ({ x: 13 + i, y: 10 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 13 + i, y: 11 })),

    // Ступень 3 (x=18..20, y=12..13)
    ...Array.from({ length: 3 }, (_, i) => ({ x: 18 + i, y: 12 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 18 + i, y: 13 })),

    // Секция B (Остров с чекпоинтом и тоннель клещей):
    // Чекпоинт-остров (x=25..31, y=13..15)
    ...Array.from({ length: 7 }, (_, i) => ({ x: 25 + i, y: 13 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 25 + i, y: 14 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 25 + i, y: 15 })),

    // Пол коридора (x=32..44, y=13..15)
    ...Array.from({ length: 13 }, (_, i) => ({ x: 32 + i, y: 13 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: 32 + i, y: 14 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: 32 + i, y: 15 })),

    // Верхняя ниша укрытия от валуна 2 (x=36..39, y=9..10)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 36 + i, y: 9 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 36 + i, y: 10 })),

    // Секция C (Финал с батутом и убегающим порталом):
    // Платформа перед прыжком (x=47..56, y=13..15)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 47 + i, y: 13 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 47 + i, y: 14 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 47 + i, y: 15 })),

    // Высокий алтарь с порталом (x=59..65, y=7..9)
    ...Array.from({ length: 7 }, (_, i) => ({ x: 59 + i, y: 7 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 59 + i, y: 8 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 59 + i, y: 9 })),

    // Граничные стены
    ...Array.from({ length: 18 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 18 }, (_, i) => ({ x: 65, y: i }))
  ],

  // Контрольная точка (Checkpoint) посередине мега-уровня
  checkpoint: {
    x: 28,
    y: 12
  },

  // Батут для взлета к переместившемуся порталу
  bouncePads: [
    { id: 'bp_40_finale', x: 54, y: 12, power: -520 }
  ],

  // Катящиеся валуны
  rollingBoulders: [
    // 1. Валун на ступенях спуска Section A
    {
      id: 'boulder_40_1',
      x: 1,
      y: 3,
      speedX: 195,
      autoStart: false,
      bounce: 0.15
    },
    // 2. Встречный валун Section B
    {
      id: 'boulder_40_2',
      x: 44,
      y: 11,
      speedX: -205,
      autoStart: false,
      bounce: 0.1
    },
    // 3. Финальный валун Section C
    {
      id: 'boulder_40_3',
      x: 55,
      y: 5,
      speedX: -180,
      autoStart: false,
      bounce: 0.1
    }
  ],

  // Шипы в бездне под пропастями
  staticSpikes: [
    { x: 6, y: 17 }, { x: 7, y: 17 },
    { x: 11, y: 17 }, { x: 12, y: 17 },
    { x: 16, y: 17 }, { x: 17, y: 17 },
    { x: 21, y: 17 }, { x: 22, y: 17 }, { x: 23, y: 17 }, { x: 24, y: 17 },
    { x: 45, y: 17 }, { x: 46, y: 17 },
    ...Array.from({ length: 8 }, (_, i) => ({ x: 57 + i, y: 17 }))
  ],

  // Портал изначально на нижнем ярусе, при приближении убегает на верхний алтарь!
  portal: {
    x: 55,
    y: 12,
    targets: [
      { x: 61, y: 6 }
    ]
  },

  triggers: [
    // Валун 1 катится по ступеням Section A
    {
      id: 'trig_40_boulder1',
      conditionType: 'player_x_greater',
      conditionValue: 4.5,
      targetId: 'boulder_40_1',
      action: 'release_boulder',
      once: true
    },
    // Валун 2 навстречу в Section B
    {
      id: 'trig_40_boulder2',
      conditionType: 'player_x_greater',
      conditionValue: 33.0,
      targetId: 'boulder_40_2',
      action: 'release_boulder',
      once: true
    },
    // Побег портала на алтарь в Section C
    {
      id: 'trig_40_portal',
      conditionType: 'player_x_greater',
      conditionValue: 50.5,
      targetId: 'portal',
      action: 'move_portal',
      once: true
    },
    // Финальный валун сверху
    {
      id: 'trig_40_boulder3',
      conditionType: 'player_x_greater',
      conditionValue: 51.0,
      targetId: 'boulder_40_3',
      action: 'release_boulder',
      once: true
    }
  ]
};
