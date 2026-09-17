import { LevelData } from './LevelData';

export const level15: LevelData = {
  id: 15,
  chapter: 2,
  theme: 'chapter2',
  name: 'Тиски',
  width: 42,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Стартовая площадка и безопасный карман (x=0..12, y=11..14)
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 13 })),

    // Потолок над прессом Section A (x=6..10, y=2..3)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 6 + i, y: 2 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: 6 + i, y: 3 })),

    // Section B: Пол под прессами и карманом (x=13..24, y=11..13)
    ...Array.from({ length: 12 }, (_, i) => ({ x: 13 + i, y: 11 })),
    ...Array.from({ length: 12 }, (_, i) => ({ x: 13 + i, y: 12 })),
    ...Array.from({ length: 12 }, (_, i) => ({ x: 13 + i, y: 13 })),

    // Потолок над прессами Section B (x=14..23, y=2..3)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 14 + i, y: 2 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 14 + i, y: 3 })),

    // Section C: Укрытие в нише (пол опущен на 1 тайл в x=27..28, y=12, а основной пол на y=11)
    ...Array.from({ length: 2 }, (_, i) => ({ x: 25 + i, y: 11 })),
    ...Array.from({ length: 2 }, (_, i) => ({ x: 27 + i, y: 12 })), // ниша глубже
    ...Array.from({ length: 3 }, (_, i) => ({ x: 29 + i, y: 11 })),
    // Нижняя монолитная основа
    ...Array.from({ length: 7 }, (_, i) => ({ x: 25 + i, y: 13 })),

    // Потолок над боковым прессом (x=26..32, y=7)
    ...Array.from({ length: 7 }, (_, i) => ({ x: 26 + i, y: 7 })),

    // Finale: Безопасный коридор награды (x=33..41, y=11..13)
    ...Array.from({ length: 9 }, (_, i) => ({ x: 33 + i, y: 11 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: 33 + i, y: 12 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: 33 + i, y: 13 })),

    // Стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 41, y: i }))
  ],

  // Прессы (Crushers)
  crushers: [
    // Section A: Одиночный вертикальный пресс (x=8, y=4 -> y=10)
    {
      id: 'crush_a',
      x: 8,
      y: 4,
      targetX: 8,
      targetY: 10,
      orientation: 'down',
      warningMs: 240,
      slamMs: 120,
      retractMs: 320,
      cycle: true
    },

    // Section B: Два пресса в противофазе со смещением
    {
      id: 'crush_b1',
      x: 15,
      y: 4,
      targetX: 15,
      targetY: 10,
      orientation: 'down',
      warningMs: 220,
      slamMs: 120,
      retractMs: 300,
      cycle: true
    },
    {
      id: 'crush_b2',
      x: 21,
      y: 4,
      targetX: 21,
      targetY: 10,
      orientation: 'down',
      warningMs: 260,
      slamMs: 120,
      retractMs: 300,
      cycle: true
    },

    // Section C: Горизонтальный пресс, бьющий справа налево над нишей (x=31 -> x=29, y=9)
    {
      id: 'crush_c_side',
      x: 32,
      y: 9,
      targetX: 29,
      targetY: 9,
      orientation: 'left',
      warningMs: 280,
      slamMs: 140,
      retractMs: 350,
      cycle: true
    }
  ],

  portal: {
    x: 39,
    y: 10
  },

  triggers: []
};
