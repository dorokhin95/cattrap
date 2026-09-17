import { LevelData } from './LevelData';

export const level14: LevelData = {
  id: 14,
  chapter: 2,
  theme: 'chapter2',
  name: 'Не та кнопка',
  width: 42,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Стартовая площадка (x=0..8, y=11..14)
    ...Array.from({ length: 9 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: i, y: 13 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: i, y: 14 })),

    // Потолок над дверью Section A (x=9, y=0..7)
    ...Array.from({ length: 8 }, (_, i) => ({ x: 9, y: i })),

    // Section A -> B верхний карниз (x=10..13, y=11)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 10 + i, y: 11 })),

    // Section B: Нижняя площадка с кнопкой и батутом (x=15..21, y=14)
    ...Array.from({ length: 7 }, (_, i) => ({ x: 15 + i, y: 14 })),

    // Section B: Остров приёма после моста (x=26..28, y=11..14)
    ...Array.from({ length: 3 }, (_, i) => ({ x: 26 + i, y: 11 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 26 + i, y: 12 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 26 + i, y: 13 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 26 + i, y: 14 })),

    // Section C: Финишный коридор (x=29..41, y=11..14)
    ...Array.from({ length: 13 }, (_, i) => ({ x: 29 + i, y: 11 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: 29 + i, y: 12 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: 29 + i, y: 13 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: 29 + i, y: 14 })),

    // Потолок над дверью Section C (x=37, y=0..7)
    ...Array.from({ length: 8 }, (_, i) => ({ x: 37, y: i })),

    // Стены уровня
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 41, y: i }))
  ],

  // Переключаемые блоки (ToggleBlocks)
  toggleBlocks: [
    // Дверь 1: Закрыта изначально (x=9, y=8..10)
    { id: 'tb_door1_a', x: 9, y: 8, initiallyActive: true },
    { id: 'tb_door1_b', x: 9, y: 9, initiallyActive: true },
    { id: 'tb_door1_c', x: 9, y: 10, initiallyActive: true },

    // Мост Section B: Неактивен изначально (x=22..25, y=11)
    { id: 'tb_bridge_1', x: 22, y: 11, initiallyActive: false },
    { id: 'tb_bridge_2', x: 23, y: 11, initiallyActive: false },
    { id: 'tb_bridge_3', x: 24, y: 11, initiallyActive: false },
    { id: 'tb_bridge_4', x: 25, y: 11, initiallyActive: false },

    // Дверь 2 перед порталом: Закрыта изначально (x=37, y=8..10)
    { id: 'tb_door2_a', x: 37, y: 8, initiallyActive: true },
    { id: 'tb_door2_b', x: 37, y: 9, initiallyActive: true },
    { id: 'tb_door2_c', x: 37, y: 10, initiallyActive: true }
  ],

  // Кнопки
  buttons: [
    // Кнопка 1: Открывает дверь 1
    {
      id: 'btn_intro',
      x: 5,
      y: 10,
      targets: ['tb_door1_a', 'tb_door1_b', 'tb_door1_c'],
      once: true
    },
    // Кнопка 2: Включает мост
    {
      id: 'btn_bridge',
      x: 17,
      y: 13,
      targets: ['tb_bridge_1', 'tb_bridge_2', 'tb_bridge_3', 'tb_bridge_4'],
      once: true
    },
    // Кнопка 3: Открывает финальную дверь (и активирует тролль-шип сзади через триггер)
    {
      id: 'btn_final',
      x: 34,
      y: 10,
      targets: ['tb_door2_a', 'tb_door2_b', 'tb_door2_c'],
      once: true
    }
  ],

  // Батут для возвращения из ямы кнопки 2
  bouncePads: [
    { id: 'bp_pit_return', x: 20, y: 13, power: -520 }
  ],

  // Психологический шип позади игрока при нажатии третьей кнопки
  popSpikes: [
    { id: 'ps_behind', x: 31, y: 10 }
  ],

  portal: {
    x: 39,
    y: 10
  },

  triggers: [
    {
      id: 'trig_behind_pop',
      conditionType: 'player_x_greater',
      conditionValue: 33.5,
      targetId: 'ps_behind',
      action: 'pop',
      once: true
    }
  ]
};
