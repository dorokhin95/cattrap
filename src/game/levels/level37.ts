import { LevelData } from './LevelData';

export const level37: LevelData = {
  id: 37,
  chapter: 4,
  theme: 'chapter4',
  name: 'Схлопывающийся лаз',
  width: 46,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Входная комната (x=0..6, пол y=11..13)
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 13 })),

    // Узкий лаз (пол x=7..31, y=11..13)
    ...Array.from({ length: 25 }, (_, i) => ({ x: 7 + i, y: 11 })),
    ...Array.from({ length: 25 }, (_, i) => ({ x: 7 + i, y: 12 })),
    ...Array.from({ length: 25 }, (_, i) => ({ x: 7 + i, y: 13 })),

    // Потолок узкого лаза (x=7..30, y=9..10) - высота ровно 1 тайл на y=10!
    ...Array.from({ length: 24 }, (_, i) => ({ x: 7 + i, y: 9 })),
    ...Array.from({ length: 24 }, (_, i) => ({ x: 7 + i, y: 10 })),

    // Выходная комната (x=32..45, y=11..13) с ямой на x=36..37
    ...Array.from({ length: 4 }, (_, i) => ({ x: 32 + i, y: 11 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 32 + i, y: 12 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 32 + i, y: 13 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 38 + i, y: 11 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 38 + i, y: 12 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 38 + i, y: 13 })),

    // Граничные стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 45, y: i }))
  ],

  // Зоны изменения размера
  modifierZones: [
    { x: 5, y: 10, type: 'shrink' },
    { x: 33, y: 10, type: 'restore_size' }
  ],

  // Падающий блок позади котика, запечатывающий вход
  fallingBlocks: [
    { id: 'fb_37_seal', x: 7, y: 4, landingY: 10 }
  ],

  // Валун, катящийся по крыше лаза и падающий на выходе
  rollingBoulders: [
    {
      id: 'boulder_37',
      x: 10,
      y: 6,
      speedX: 185,
      autoStart: false,
      bounce: 0.1
    }
  ],

  // Шипы на дне ямы
  staticSpikes: [
    { x: 36, y: 14 },
    { x: 37, y: 14 }
  ],

  portal: {
    x: 41,
    y: 10
  },

  triggers: [
    {
      id: 'trig_37_seal',
      conditionType: 'player_x_greater',
      conditionValue: 7.5,
      targetId: 'fb_37_seal',
      action: 'drop',
      once: true
    },
    {
      id: 'trig_37_boulder',
      conditionType: 'player_x_greater',
      conditionValue: 11.0,
      targetId: 'boulder_37',
      action: 'release_boulder',
      once: true
    }
  ]
};
