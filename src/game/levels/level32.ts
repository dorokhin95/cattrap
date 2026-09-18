import { LevelData } from './LevelData';

export const level32: LevelData = {
  id: 32,
  chapter: 4,
  theme: 'chapter4',
  name: 'Встречная лавина',
  width: 44,
  height: 15,
  spawn: { x: 2, y: 9 },
  solidTiles: [
    // Стартовая площадка (x=0..7, y=10..12)
    ...Array.from({ length: 8 }, (_, i) => ({ x: i, y: 10 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: i, y: 12 })),

    // Спуск в нижний коридор (пол на y=12..14 для x=8..33)
    ...Array.from({ length: 26 }, (_, i) => ({ x: 8 + i, y: 12 })),
    ...Array.from({ length: 26 }, (_, i) => ({ x: 8 + i, y: 13 })),
    ...Array.from({ length: 26 }, (_, i) => ({ x: 8 + i, y: 14 })),

    // Верхняя полка-укрытие над коридором (x=14..19, y=9)
    // Котик может запрыгнуть сюда (высота прыжка 3 тайла от y=12), чтобы пропустить валун
    ...Array.from({ length: 6 }, (_, i) => ({ x: 14 + i, y: 9 })),

    // Финишная платформа после коридора (x=34..43, y=10..12)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 34 + i, y: 10 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 34 + i, y: 11 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 34 + i, y: 12 })),

    // Граничные стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 43, y: i }))
  ],

  // Скрытый шип на нижнем полу (котик должен запрыгнуть на полку!)
  staticSpikes: [
    { x: 24, y: 11 }
  ],

  // Встречный валун: начинает справа на x=33, y=10 и катится НАВСТРЕЧУ котику (-205 px/s)
  rollingBoulders: [
    {
      id: 'boulder_32',
      x: 33,
      y: 10,
      speedX: -205,
      autoStart: false,
      bounce: 0.15
    }
  ],

  portal: {
    x: 40,
    y: 9
  },

  triggers: [
    // Встречная лавина срывается при спуске котика в коридор
    {
      id: 'trig_32_boulder',
      conditionType: 'player_x_greater',
      conditionValue: 9.0,
      targetId: 'boulder_32',
      action: 'release_boulder',
      once: true
    }
  ]
};
