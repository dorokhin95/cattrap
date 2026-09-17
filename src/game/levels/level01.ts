import { LevelData } from './LevelData';

export const level01: LevelData = {
  id: 1,
  name: 'Первый подвох',
  width: 24,
  height: 12,
  spawn: { x: 2, y: 9 },
  solidTiles: [
    // Пол от x=0 до x=23 (кроме ячейки скрытого шипа x=13)
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 10 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 14 + i, y: 10 })),
    // Нижний слой для монолитности
    ...Array.from({ length: 24 }, (_, i) => ({ x: i, y: 11 })),
    // Левая и правая ограничивающие стены
    ...Array.from({ length: 12 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 12 }, (_, i) => ({ x: 23, y: i }))
  ],
  staticSpikes: [
    { x: 6, y: 9 }
  ],
  popSpikes: [
    { id: 'spike_pop_1', x: 13, y: 10 }
  ],
  portal: {
    x: 21,
    y: 9
  },
  triggers: [
    {
      id: 'trig_pop_spike_1',
      conditionType: 'player_x_greater',
      conditionValue: 11.5,
      targetId: 'spike_pop_1',
      action: 'pop',
      once: true
    }
  ]
};
