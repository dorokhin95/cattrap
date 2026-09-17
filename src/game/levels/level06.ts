import { LevelData } from './LevelData';

export const level06: LevelData = {
  id: 6,
  chapter: 1,
  name: 'Пол врёт',
  width: 30,
  height: 13,
  spawn: { x: 2, y: 9 },
  solidTiles: [
    // Пол до провала
    ...Array.from({ length: 10 }, (_, i) => ({ x: i, y: 10 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: i, y: 11 })),
    // Верхний карниз (маршрут обхода после изучения ловушки)
    { x: 9, y: 7, type: 'solid' },
    { x: 10, y: 7, type: 'solid' },
    { x: 11, y: 7, type: 'solid' },
    { x: 12, y: 7, type: 'solid' },
    // Пол после провала
    ...Array.from({ length: 18 }, (_, i) => ({ x: 12 + i, y: 10 })),
    ...Array.from({ length: 18 }, (_, i) => ({ x: 12 + i, y: 11 })),
    // Стены
    ...Array.from({ length: 13 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: 29, y: i }))
  ],
  fakeFloors: [
    { id: 'fake_1', x: 10, y: 10 },
    { id: 'fake_2', x: 11, y: 10 }
  ],
  staticSpikes: [
    // Шипы на дне ямы под обманным полом
    { x: 10, y: 12 },
    { x: 11, y: 12 },
    // Шип перед порталом
    { x: 20, y: 9 }
  ],
  portal: {
    x: 26,
    y: 9
  },
  triggers: [
    {
      id: 'trig_fake_floor',
      conditionType: 'player_x_greater',
      conditionValue: 9.8,
      targetId: 'fake_1',
      action: 'collapse',
      once: true
    },
    {
      id: 'trig_fake_floor_2',
      conditionType: 'player_x_greater',
      conditionValue: 9.8,
      targetId: 'fake_2',
      action: 'collapse',
      once: true
    }
  ]
};
