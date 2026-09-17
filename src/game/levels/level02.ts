import { LevelData } from './LevelData';

export const level02: LevelData = {
  id: 2,
  chapter: 1,
  name: 'Не стой',
  width: 28,
  height: 12,
  spawn: { x: 2, y: 9 },
  solidTiles: [
    // Стартовая площадка
    ...Array.from({ length: 12 }, (_, i) => ({ x: i, y: 10 })),
    ...Array.from({ length: 12 }, (_, i) => ({ x: i, y: 11 })),
    // Остров после моста
    { x: 16, y: 10 }, { x: 17, y: 10 }, { x: 18, y: 10 },
    { x: 16, y: 11 }, { x: 17, y: 11 }, { x: 18, y: 11 },
    // Финишная площадка
    ...Array.from({ length: 8 }, (_, i) => ({ x: 20 + i, y: 10 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 20 + i, y: 11 })),
    // Стены
    ...Array.from({ length: 12 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 12 }, (_, i) => ({ x: 27, y: i }))
  ],
  staticSpikes: [
    { x: 6, y: 9 }
  ],
  crumbleBlocks: [
    { id: 'crumble_1', x: 12, y: 10 },
    { id: 'crumble_2', x: 13, y: 10 },
    { id: 'crumble_3', x: 14, y: 10 },
    { id: 'crumble_4', x: 15, y: 10 }
  ],
  popSpikes: [
    { id: 'pop_spike_2', x: 19, y: 10 }
  ],
  portal: {
    x: 25,
    y: 9
  },
  triggers: [
    {
      id: 'trig_pop_spike_2',
      conditionType: 'player_x_greater',
      conditionValue: 17.5,
      targetId: 'pop_spike_2',
      action: 'pop',
      once: true
    }
  ]
};
