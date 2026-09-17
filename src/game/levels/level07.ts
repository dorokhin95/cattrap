import { LevelData } from './LevelData';

export const level07: LevelData = {
  id: 7,
  name: 'Маленький кот',
  width: 34,
  height: 14,
  spawn: { x: 2, y: 9 },
  solidTiles: [
    // Основной пол
    ...Array.from({ length: 34 }, (_, i) => ({ x: i, y: 10 })),
    ...Array.from({ length: 34 }, (_, i) => ({ x: i, y: 11 })),
    // Низкий потолок туннеля (только маленький котик может пройти под ним)
    ...Array.from({ length: 15 }, (_, i) => ({ x: 8 + i, y: 8 })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 8 + i, y: 7 })),
    // Стены
    ...Array.from({ length: 14 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 14 }, (_, i) => ({ x: 33, y: i }))
  ],
  modifierZones: [
    { x: 6, y: 9, type: 'shrink' },
    { x: 24, y: 9, type: 'restore_size' }
  ],
  popSpikes: [
    { id: 'tunnel_spike', x: 14, y: 10 }
  ],
  staticSpikes: [
    { x: 28, y: 9 }
  ],
  portal: {
    x: 31,
    y: 9
  },
  triggers: [
    {
      id: 'trig_tunnel_spike',
      conditionType: 'player_x_greater',
      conditionValue: 12.5,
      targetId: 'tunnel_spike',
      action: 'pop',
      once: true
    }
  ]
};
