import { LevelData } from './LevelData';

export const level09: LevelData = {
  id: 9,
  name: 'Почти дошёл',
  width: 38,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Стартовая секция
    ...Array.from({ length: 9 }, (_, i) => ({ x: i, y: 11 })),
    // Островок после crumble моста
    { x: 13, y: 11 }, { x: 14, y: 11 }, { x: 15, y: 11 }, { x: 16, y: 11 },
    // Платформа за обманным полом
    { x: 19, y: 11 }, { x: 20, y: 11 },
    // Приподнятая площадка, куда поднимется портал
    { x: 22, y: 9 }, { x: 23, y: 9 }, { x: 24, y: 9 },
    // Финишная зона
    ...Array.from({ length: 14 }, (_, i) => ({ x: 24 + i, y: 11 })),
    // Стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 37, y: i }))
  ],
  staticSpikes: [
    { x: 6, y: 10 },
    // Шипы на дне под мостом и обманным полом
    { x: 10, y: 14 }, { x: 11, y: 14 },
    { x: 17, y: 14 }, { x: 18, y: 14 }
  ],
  crumbleBlocks: [
    { id: 'c9_1', x: 9, y: 11 },
    { id: 'c9_2', x: 10, y: 11 },
    { id: 'c9_3', x: 11, y: 11 },
    { id: 'c9_4', x: 12, y: 11 }
  ],
  fakeFloors: [
    { id: 'fake9_1', x: 17, y: 11 },
    { id: 'fake9_2', x: 18, y: 11 }
  ],
  portal: {
    x: 23,
    y: 10,
    targets: [
      { x: 23, y: 8 } // Поднимается на 2 клетки вверх на платформу
    ],
    isTrollPortal: true // Шуточное сжатие на 0.15с при касании
  },
  triggers: [
    // За 4 клетки до портала (x=15.5): пол рушится, а портал поднимается
    {
      id: 'trig_fake9_1',
      conditionType: 'player_x_greater',
      conditionValue: 15.2,
      targetId: 'fake9_1',
      action: 'collapse',
      once: true
    },
    {
      id: 'trig_fake9_2',
      conditionType: 'player_x_greater',
      conditionValue: 15.2,
      targetId: 'fake9_2',
      action: 'collapse',
      once: true
    },
    {
      id: 'trig_portal_shift',
      conditionType: 'player_x_greater',
      conditionValue: 15.2,
      targetId: 'portal',
      action: 'move_portal',
      once: true
    }
  ]
};
