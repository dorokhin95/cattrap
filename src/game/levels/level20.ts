import { LevelData } from './LevelData';

export const level20: LevelData = {
  id: 20,
  chapter: 2,
  theme: 'chapter2',
  isChapterEnd: true,
  name: 'Десятая жизнь',
  width: 64,
  height: 18,
  spawn: { x: 2, y: 11 },
  solidTiles: [
    // Section A: Стартовая площадка и платформа перед ямой (x=0..4, y=12..14)
    ...Array.from({ length: 5 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: i, y: 13 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: i, y: 14 })),

    // Остров после батута и движущейся платформы A (x=14..17, y=12..14)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 14 + i, y: 12 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 14 + i, y: 13 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 14 + i, y: 14 })),

    // Опора-колонна под батут Section A (x=9)
    { x: 9, y: 13 },
    { x: 9, y: 14 },

    // Section B: Нижняя площадка с кнопкой (x=20..24, y=15..16)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 20 + i, y: 15 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: 20 + i, y: 16 })),

    // Потолочная балка над стеной Section B (x=28, y=0..8)
    ...Array.from({ length: 9 }, (_, i) => ({ x: 28, y: i })),

    // CHECKPOINT: Безопасный остров (x=29..32, y=12..14)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 29 + i, y: 12 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 29 + i, y: 13 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 29 + i, y: 14 })),

    // Section C: Реверс-остров с прессом (x=33..37, y=12..14)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 33 + i, y: 12 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: 33 + i, y: 13 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: 33 + i, y: 14 })),

    // Section D: Приземление перед автобегом (x=40..42, y=12..14)
    ...Array.from({ length: 3 }, (_, i) => ({ x: 40 + i, y: 12 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 40 + i, y: 13 })),

    // Section D: Остров с шипом и батутом (x=43..46, y=12..14)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 43 + i, y: 12 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 43 + i, y: 13 })),

    // Section D -> E: Безопасная площадка приземления (x=50..52, y=12..14)
    ...Array.from({ length: 3 }, (_, i) => ({ x: 50 + i, y: 12 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 50 + i, y: 13 })),

    // Section E: Потолочная платформа для гравитации (x=53..57, y=2..3)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 53 + i, y: 2 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: 53 + i, y: 3 })),

    // Финал: Финишная платформа с порталом (x=58..63, y=12..14)
    ...Array.from({ length: 6 }, (_, i) => ({ x: 58 + i, y: 12 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 58 + i, y: 13 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 58 + i, y: 14 })),

    // Стены
    ...Array.from({ length: 18 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 18 }, (_, i) => ({ x: 63, y: i }))
  ],

  // Чекпоинт ровно в середине на x=30
  checkpoint: {
    x: 30,
    y: 11
  },

  // Конвейеры (Section A)
  conveyors: [
    { id: 'c20_a1', x: 5, y: 12, direction: 'right' },
    { id: 'c20_a2', x: 6, y: 12, direction: 'right' },
    { id: 'c20_a3', x: 7, y: 12, direction: 'right' }
  ],

  // Батуты (Section A и Section D)
  bouncePads: [
    { id: 'bp20_a', x: 9, y: 12, power: -520 },
    { id: 'bp20_d', x: 46, y: 11, power: -540 }
  ],

  // Движущиеся платформы
  movingPlatforms: [
    // Section A: Платформа от батута к острову
    {
      id: 'mp20_a',
      x: 10,
      y: 9,
      targetX: 13,
      targetY: 9,
      speed: 60,
      pingPong: true
    },
    // Section B: Платформа, опускающая к кнопке
    {
      id: 'mp20_b',
      x: 18,
      y: 12,
      targetX: 20,
      targetY: 15,
      speed: 60,
      pingPong: true
    }
  ],

  // Переключаемая дверь и лестница в Section B
  toggleBlocks: [
    { id: 'tb20_b_1', x: 28, y: 9, initiallyActive: true },
    { id: 'tb20_b_2', x: 28, y: 10, initiallyActive: true },
    { id: 'tb20_b_3', x: 28, y: 11, initiallyActive: true },
    // Ступени к чекпоинту (материализуются при нажатии кнопки)
    { id: 'tb20_b_step1', x: 25, y: 14, initiallyActive: false },
    { id: 'tb20_b_step2', x: 26, y: 13, initiallyActive: false },
    { id: 'tb20_b_step3', x: 27, y: 12, initiallyActive: false },
    { id: 'tb20_b_step4', x: 28, y: 12, initiallyActive: false }
  ],

  // Кнопка в Section B: открывает путь и материализует лестницу к чекпоинту
  buttons: [
    {
      id: 'btn20_b',
      x: 22,
      y: 14,
      targets: ['tb20_b_1', 'tb20_b_2', 'tb20_b_3', 'tb20_b_step1', 'tb20_b_step2', 'tb20_b_step3', 'tb20_b_step4'],
      once: true
    }
  ],

  // Пресс в Section C (реверс-секция)
  crushers: [
    {
      id: 'crush20_c',
      x: 35,
      y: 4,
      targetX: 35,
      targetY: 11,
      orientation: 'down',
      warningMs: 260,
      slamMs: 130,
      retractMs: 340,
      cycle: true
    }
  ],

  // Осыпающиеся плиты в ритме Section D (x=48..49, y=8)
  crumbleBlocks: [
    { id: 'cb20_1', x: 48, y: 8 },
    { id: 'cb20_2', x: 49, y: 8 }
  ],

  // Зоны изменения управления (Section C реверс, Section D автобег)
  controlZones: [
    {
      id: 'cz20_rev',
      x: 33,
      y: 10,
      width: 6,
      height: 2,
      type: 'reverse'
    },
    {
      id: 'cz20_norm_mid',
      x: 39,
      y: 10,
      width: 3,
      height: 2,
      type: 'normal'
    },
    {
      id: 'cz20_auto',
      x: 42,
      y: 10,
      width: 8,
      height: 2,
      type: 'autorun_right'
    },
    {
      id: 'cz20_norm_end',
      x: 50,
      y: 10,
      width: 3,
      height: 2,
      type: 'normal'
    }
  ],

  // Зоны инверсии гравитации (Section E - Ностальгия по главе 1)
  modifierZones: [
    { x: 53, y: 11, type: 'gravity_invert' },
    { x: 58, y: 4, type: 'gravity_normal' }
  ],

  // Ловушки
  staticSpikes: [
    { x: 44, y: 11 }
  ],

  popSpikes: [
    // Поп-шип на обратном пути от кнопки в Section B
    { id: 'ps20_b', x: 25, y: 14 }
  ],

  portal: {
    x: 60,
    y: 11,
    isTrollPortal: true // В финале сжимается и издает звук, но не убегает
  },

  triggers: [
    {
      id: 'trig20_pop_b',
      conditionType: 'player_x_greater',
      conditionValue: 23,
      targetId: 'ps20_b',
      action: 'pop',
      once: true
    }
  ]
};
