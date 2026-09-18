import { LevelData } from './LevelData';

export const level34: LevelData = {
  id: 34,
  chapter: 4,
  theme: 'chapter4',
  name: 'Шар-маятник',
  width: 46,
  height: 16,
  spawn: { x: 2, y: 7 },
  solidTiles: [
    // Стартовая площадка (x=0..6, y=8..10)
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 8 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 9 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 10 })),

    // Левый спуск в чашу
    { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 14 },
    { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 },
    { x: 9, y: 11 }, { x: 9, y: 12 }, { x: 9, y: 13 }, { x: 9, y: 14 },

    // Дно чаши (x=10..26, y=12..14)
    ...Array.from({ length: 17 }, (_, i) => ({ x: 10 + i, y: 12 })),
    ...Array.from({ length: 17 }, (_, i) => ({ x: 10 + i, y: 13 })),
    ...Array.from({ length: 17 }, (_, i) => ({ x: 10 + i, y: 14 })),

    // Правый подъем из чаши
    { x: 27, y: 11 }, { x: 27, y: 12 }, { x: 27, y: 13 }, { x: 27, y: 14 },
    { x: 28, y: 10 }, { x: 28, y: 11 }, { x: 28, y: 12 }, { x: 28, y: 13 }, { x: 28, y: 14 },
    { x: 29, y: 9 }, { x: 29, y: 10 }, { x: 29, y: 11 }, { x: 29, y: 12 }, { x: 29, y: 13 }, { x: 29, y: 14 },

    // Финишная площадка (x=30..45, y=8..10)
    ...Array.from({ length: 16 }, (_, i) => ({ x: 30 + i, y: 8 })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 30 + i, y: 9 })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 30 + i, y: 10 })),

    // Граничные стены
    ...Array.from({ length: 16 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 45, y: i }))
  ],

  // Валун-маятник: стартует на правом склоне чаши, колеблется влево-вправо отскакивая от стен
  rollingBoulders: [
    {
      id: 'boulder_34',
      x: 27,
      y: 9,
      speedX: -220,
      autoStart: true,
      bounce: 0.9
    }
  ],

  // Внезапный шип на выходе из чаши перед порталом
  popSpikes: [
    { id: 'spike_34_exit', x: 34, y: 7 }
  ],

  portal: {
    x: 41,
    y: 7
  },

  triggers: [
    {
      id: 'trig_34_spike',
      conditionType: 'player_x_greater',
      conditionValue: 31.5,
      targetId: 'spike_34_exit',
      action: 'pop',
      once: true
    }
  ]
};
