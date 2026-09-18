import { LevelData } from './LevelData';

export const level23: LevelData = {
  id: 23,
  chapter: 3,
  theme: 'chapter3',
  name: 'Кротовая нора',
  width: 46,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Старт с глухой стеной (x=0..7, y=11..13)
    ...Array.from({ length: 8 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: i, y: 13 })),

    // Глухая стена, блокирующая прямой проход
    ...Array.from({ length: 12 }, (_, i) => ({ x: 8, y: i })),

    // Section B: Верхний ярус за стеной (x=13..22, y=6..7)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 13 + i, y: 6 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 13 + i, y: 7 })),

    // Section C: Нижняя платформа с ямой (x=27..35, y=12..13)
    ...Array.from({ length: 9 }, (_, i) => ({ x: 27 + i, y: 12 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: 27 + i, y: 13 })),

    // Section D: Финишный остров (x=40..45, y=8..10)
    ...Array.from({ length: 6 }, (_, i) => ({ x: 40 + i, y: 8 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 40 + i, y: 9 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 40 + i, y: 10 })),

    // Стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 45, y: i }))
  ],

  // Варп-порталы
  warpGates: [
    // Портал 1: Пробивает глухую стену на верхний ярус
    {
      id: 'wg_23_1',
      x: 6,
      y: 10,
      targetX: 14,
      targetY: 5,
      exitImpulseX: 80
    },
    // Портал 2: Прыжок в бездну переносит котика ввысь с ускорением
    {
      id: 'wg_23_2',
      x: 23,
      y: 10,
      targetX: 28,
      targetY: 11,
      exitImpulseX: 120,
      exitImpulseY: -200
    },
    // Портал 3: Выстреливает котика на финишный высокий остров
    {
      id: 'wg_23_3',
      x: 35,
      y: 11,
      targetX: 38,
      targetY: 6,
      exitImpulseX: 160,
      exitImpulseY: -350
    }
  ],

  // Шипы
  staticSpikes: [
    ...Array.from({ length: 4 }, (_, i) => ({ x: 23 + i, y: 14 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 36 + i, y: 14 }))
  ],

  portal: {
    x: 43,
    y: 7
  },

  triggers: []
};
