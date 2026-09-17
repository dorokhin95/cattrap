import { LevelData } from './LevelData';

export const level08: LevelData = {
  id: 8,
  name: 'Лапами вверх',
  width: 34,
  height: 16,
  spawn: { x: 2, y: 11 },
  solidTiles: [
    // Стартовая платформа на полу
    ...Array.from({ length: 8 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: i, y: 13 })),
    // Потолочная дорожка (кот бежит по ней ногами вверх)
    ...Array.from({ length: 15 }, (_, i) => ({ x: 8 + i, y: 3 })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 8 + i, y: 2 })),
    // Финишная платформа на полу
    ...Array.from({ length: 14 }, (_, i) => ({ x: 20 + i, y: 12 })),
    ...Array.from({ length: 14 }, (_, i) => ({ x: 20 + i, y: 13 })),
    // Стены
    ...Array.from({ length: 16 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 33, y: i }))
  ],
  modifierZones: [
    { x: 7, y: 10, type: 'gravity_invert' },
    { x: 23, y: 5, type: 'gravity_normal' }
  ],
  staticSpikes: [
    // Перевёрнутый шип на потолочной секции
    { x: 15, y: 4, upsideDown: true },
    // Шипы на дне пропасти
    { x: 11, y: 15 }, { x: 12, y: 15 }, { x: 13, y: 15 },
    { x: 14, y: 15 }, { x: 15, y: 15 }, { x: 16, y: 15 }
  ],
  portal: {
    x: 30,
    y: 11
  },
  triggers: []
};
