import { LevelData } from './LevelData';

export const level03: LevelData = {
  id: 3,
  chapter: 1,
  name: 'Подожди, куда?',
  width: 30,
  height: 12,
  spawn: { x: 2, y: 9 },
  solidTiles: [
    // Основной пол
    ...Array.from({ length: 30 }, (_, i) => ({ x: i, y: 10 })),
    ...Array.from({ length: 30 }, (_, i) => ({ x: i, y: 11 })),
    // Маленькая возвышенная платформа для второй позиции портала
    { x: 24, y: 8 }, { x: 25, y: 8 }, { x: 26, y: 8 },
    // Стены
    ...Array.from({ length: 12 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 12 }, (_, i) => ({ x: 29, y: i }))
  ],
  staticSpikes: [
    { x: 7, y: 9 }
  ],
  portal: {
    x: 15,
    y: 9,
    targets: [
      { x: 21, y: 9 },
      { x: 25, y: 7 }
    ]
  },
  triggers: [
    // Первое убегание портала при приближении к x=15 (дистанция 3 клетки)
    {
      id: 'portal_move_1',
      conditionType: 'player_x_greater',
      conditionValue: 12,
      targetId: 'portal',
      action: 'move_portal',
      once: true
    },
    // Второе перемещение портала на платформу
    {
      id: 'portal_move_2',
      conditionType: 'player_x_greater',
      conditionValue: 19,
      targetId: 'portal',
      action: 'move_portal',
      once: true
    }
  ]
};
