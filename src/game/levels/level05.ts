import { LevelData } from './LevelData';

export const level05: LevelData = {
  id: 5,
  name: 'Смотри вверх',
  width: 32,
  height: 14,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Основной пол до высокой стены
    ...Array.from({ length: 18 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 18 }, (_, i) => ({ x: i, y: 12 })),
    // Высокая стена (на неё нельзя запрыгнуть без упавшего блока)
    { x: 18, y: 11 }, { x: 18, y: 10 }, { x: 18, y: 9 }, { x: 18, y: 8 }, { x: 18, y: 7 },
    // Верхняя площадка за стеной
    ...Array.from({ length: 14 }, (_, i) => ({ x: 18 + i, y: 7 })),
    ...Array.from({ length: 14 }, (_, i) => ({ x: 18 + i, y: 8 })),
    // Стены
    ...Array.from({ length: 14 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 14 }, (_, i) => ({ x: 31, y: i }))
  ],
  fallingBlocks: [
    {
      id: 'falling_block_1',
      x: 14,
      y: 2,
      landingY: 9.5 // Опускается точно на пол y=11, образуя ступеньку
    }
  ],
  staticSpikes: [
    { x: 23, y: 6 } // Шип на верхней платформе
  ],
  portal: {
    x: 28,
    y: 6
  },
  triggers: [
    // Триггер падения за 3 клетки до блока (x=11)
    {
      id: 'trig_fall_block',
      conditionType: 'player_x_greater',
      conditionValue: 10.5,
      targetId: 'falling_block_1',
      action: 'drop',
      once: true
    }
  ]
};
