import { LevelData } from './LevelData';

export const level35: LevelData = {
  id: 35,
  chapter: 4,
  theme: 'chapter4',
  name: 'Бег наперегонки',
  width: 48,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Стартовая зона (x=0..5, y=11..13)
    ...Array.from({ length: 6 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: i, y: 13 })),

    // Беговая дорожка (x=6..36, y=11..13) с ямой на x=28..29
    ...Array.from({ length: 22 }, (_, i) => ({ x: 6 + i, y: 11 })),
    ...Array.from({ length: 22 }, (_, i) => ({ x: 6 + i, y: 12 })),
    ...Array.from({ length: 22 }, (_, i) => ({ x: 6 + i, y: 13 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 30 + i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 30 + i, y: 12 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 30 + i, y: 13 })),

    // Низкий потолочный свод (x=20..22, y=8) - препятствие, если прыгнуть слишком высоко
    ...Array.from({ length: 3 }, (_, i) => ({ x: 20 + i, y: 8 })),

    // Финишная зона после пропасти (x=40..47, y=11..13)
    ...Array.from({ length: 8 }, (_, i) => ({ x: 40 + i, y: 11 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 40 + i, y: 12 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 40 + i, y: 13 })),

    // Граничные стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 47, y: i }))
  ],

  // Зона автобега котика (держит скорость 160 px/s)
  controlZones: [
    {
      id: 'cz_35_autorun',
      x: 4,
      y: 8,
      width: 35,
      height: 5,
      type: 'autorun_right'
    },
    {
      id: 'cz_35_norm',
      x: 40,
      y: 8,
      width: 8,
      height: 5,
      type: 'normal'
    }
  ],

  // Препятствия на беговой дорожке
  staticSpikes: [
    { x: 15, y: 10 },
    { x: 28, y: 14 },
    { x: 29, y: 14 },
    { x: 37, y: 14 },
    { x: 38, y: 14 },
    { x: 39, y: 14 }
  ],

  // Валун преследования: катится позади со скоростью 180 px/s (чуть быстрее котика!)
  rollingBoulders: [
    {
      id: 'boulder_35',
      x: 1,
      y: 9,
      speedX: 180,
      autoStart: false,
      bounce: 0.1
    }
  ],

  portal: {
    x: 44,
    y: 10
  },

  triggers: [
    {
      id: 'trig_35_boulder',
      conditionType: 'player_x_greater',
      conditionValue: 4.0,
      targetId: 'boulder_35',
      action: 'release_boulder',
      once: true
    }
  ]
};
