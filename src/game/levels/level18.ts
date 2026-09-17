import { LevelData } from './LevelData';

export const level18: LevelData = {
  id: 18,
  chapter: 2,
  theme: 'chapter2',
  name: 'Нажми и беги',
  width: 48,
  height: 16,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Стартовая площадка (x=0..8, y=11..13)
    ...Array.from({ length: 9 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: i, y: 13 })),

    // Потолочная балка над стеной Section A (x=11, y=0..7)
    ...Array.from({ length: 8 }, (_, i) => ({ x: 11, y: i })),

    // Section B: Нижняя площадка с кнопкой и батутом (x=15..21, y=14..15)
    ...Array.from({ length: 7 }, (_, i) => ({ x: 15 + i, y: 14 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 15 + i, y: 15 })),

    // Section C & E: Верхний открывающийся коридор (x=12..14, y=11) и (x=22..25, y=11)
    ...Array.from({ length: 3 }, (_, i) => ({ x: 12 + i, y: 11 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 22 + i, y: 11 })),

    // Остров после ямы x=32..34 (x=35..40, y=11..13)
    ...Array.from({ length: 6 }, (_, i) => ({ x: 35 + i, y: 11 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 35 + i, y: 12 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 35 + i, y: 13 })),

    // Финальная площадка с порталом (x=43..47, y=11..13)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 43 + i, y: 11 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: 43 + i, y: 12 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: 43 + i, y: 13 })),

    // Стены
    ...Array.from({ length: 16 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 47, y: i }))
  ],

  // Движущаяся платформа, опускающая котика к кнопке
  movingPlatforms: [
    {
      id: 'mp_to_button',
      x: 9,
      y: 11,
      targetX: 14,
      targetY: 14,
      speed: 60,
      pingPong: true
    }
  ],

  // Переключаемая стена на верхнем уровне
  toggleBlocks: [
    { id: 'tb_gate_a', x: 11, y: 8, initiallyActive: true },
    { id: 'tb_gate_b', x: 11, y: 9, initiallyActive: true },
    { id: 'tb_gate_c', x: 11, y: 10, initiallyActive: true }
  ],

  // Кнопка внизу: открывает проход
  buttons: [
    {
      id: 'btn_unlock_corridor',
      x: 17,
      y: 13,
      targets: ['tb_gate_a', 'tb_gate_b', 'tb_gate_c'],
      once: true
    }
  ],

  // Батут, возвращающий наверх
  bouncePads: [
    { id: 'bp_return_up', x: 20, y: 13, power: -520 }
  ],

  // Конвейеры в открывшемся коридоре
  conveyors: [
    { id: 'conv_run1', x: 26, y: 11, direction: 'right' },
    { id: 'conv_run2', x: 27, y: 11, direction: 'right' },
    { id: 'conv_run3', x: 28, y: 11, direction: 'right' },
    { id: 'conv_run4', x: 29, y: 11, direction: 'right' },
    { id: 'conv_run5', x: 30, y: 11, direction: 'right' },
    { id: 'conv_run6', x: 31, y: 11, direction: 'right' },

    // Финишный конвейер к порталу
    { id: 'conv_finish1', x: 41, y: 11, direction: 'right' },
    { id: 'conv_finish2', x: 42, y: 11, direction: 'right' }
  ],

  staticSpikes: [
    { x: 38, y: 10 }
  ],

  portal: {
    x: 45,
    y: 10
  },

  triggers: []
};
