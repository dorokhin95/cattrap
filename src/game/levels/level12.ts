import { LevelData } from './LevelData';

export const level12: LevelData = {
  id: 12,
  chapter: 2,
  theme: 'chapter2',
  name: 'Пол поехал',
  width: 38,
  height: 14,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Стартовая платформа (x=0..4, y=11)
    ...Array.from({ length: 5 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: i, y: 13 })),

    // Section A -> B перемычка (x=11..14, y=11)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 11 + i, y: 11 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 11 + i, y: 12 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 11 + i, y: 13 })),

    // Section B остров с шипом (x=21..23, y=11)
    ...Array.from({ length: 3 }, (_, i) => ({ x: 21 + i, y: 11 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 21 + i, y: 12 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 21 + i, y: 13 })),

    // Section C платформа старта конвейера с ускорением (x=24..25, y=11)
    ...Array.from({ length: 2 }, (_, i) => ({ x: 24 + i, y: 11 })),
    ...Array.from({ length: 2 }, (_, i) => ({ x: 24 + i, y: 12 })),
    ...Array.from({ length: 2 }, (_, i) => ({ x: 24 + i, y: 13 })),

    // Финальная платформа после ямы x=29..31 (x=32..37, y=11)
    ...Array.from({ length: 6 }, (_, i) => ({ x: 32 + i, y: 11 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 32 + i, y: 12 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 32 + i, y: 13 })),

    // Ограничивающие стены
    ...Array.from({ length: 14 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 14 }, (_, i) => ({ x: 37, y: i }))
  ],

  // Конвейеры на уровне
  conveyors: [
    // Section A: 6 безопасных конвейеров вправо (x=5..10, y=11)
    { id: 'conv_a1', x: 5, y: 11, direction: 'right' },
    { id: 'conv_a2', x: 6, y: 11, direction: 'right' },
    { id: 'conv_a3', x: 7, y: 11, direction: 'right' },
    { id: 'conv_a4', x: 8, y: 11, direction: 'right' },
    { id: 'conv_a5', x: 9, y: 11, direction: 'right' },
    { id: 'conv_a6', x: 10, y: 11, direction: 'right' },

    // Section B: Конвейер влево (x=15..20, y=11), бег против шерсти
    { id: 'conv_b1', x: 15, y: 11, direction: 'left' },
    { id: 'conv_b2', x: 16, y: 11, direction: 'left' },
    { id: 'conv_b3', x: 17, y: 11, direction: 'left' },
    { id: 'conv_b4', x: 18, y: 11, direction: 'left' },
    { id: 'conv_b5', x: 19, y: 11, direction: 'left' },
    { id: 'conv_b6', x: 20, y: 11, direction: 'left' },

    // Section C: Конвейер разгона вправо перед ямой (x=26..28, y=11)
    { id: 'conv_c1', x: 26, y: 11, direction: 'right' },
    { id: 'conv_c2', x: 27, y: 11, direction: 'right' },
    { id: 'conv_c3', x: 28, y: 11, direction: 'right' },

    // Troll перед порталом: стрелки честно указывают влево (x=34..35, y=11)
    { id: 'conv_troll1', x: 34, y: 11, direction: 'left' },
    { id: 'conv_troll2', x: 35, y: 11, direction: 'left' }
  ],

  // Препятствие в Section B
  staticSpikes: [
    { x: 22, y: 10 }
  ],

  portal: {
    x: 36,
    y: 10
  },

  triggers: []
};
