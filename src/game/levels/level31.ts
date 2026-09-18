import { LevelData } from './LevelData';

export const level31: LevelData = {
  id: 31,
  chapter: 4,
  theme: 'chapter4',
  name: 'Первый валун',
  width: 44,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Стартовая площадка (x=0..9, y=11..13)
    ...Array.from({ length: 10 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: i, y: 13 })),

    // Пол коридора побега (x=10..15, y=11..13)
    ...Array.from({ length: 6 }, (_, i) => ({ x: 10 + i, y: 11 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 10 + i, y: 12 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 10 + i, y: 13 })),

    // Спасительная ниша-карман в полу (x=16..17, пол на y=12, котик укрывается от валуна)
    { x: 16, y: 13 }, { x: 17, y: 13 },

    // Пол после ниши (x=18..27, y=11..13)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 18 + i, y: 11 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 18 + i, y: 12 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 18 + i, y: 13 })),

    // Мостик через яму (x=28..31 - яма, валун падает в яму на дно!)
    // Финишная платформа (x=32..43, y=11..13)
    ...Array.from({ length: 12 }, (_, i) => ({ x: 32 + i, y: 11 })),
    ...Array.from({ length: 12 }, (_, i) => ({ x: 32 + i, y: 12 })),
    ...Array.from({ length: 12 }, (_, i) => ({ x: 32 + i, y: 13 })),

    // Стены и верхняя ниша, откуда падает валун (x=1..3, y=3..4)
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 43, y: i }))
  ],

  // Скрытые шипы на дне ямы (куда проваливается шар)
  staticSpikes: [
    ...Array.from({ length: 4 }, (_, i) => ({ x: 28 + i, y: 14 }))
  ],

  // Катящийся валун: спрятан вверху сзади на x=2, y=6.
  // При переходе котиком черты x=8 срывается вниз и катится следом за котиком со скоростью 195 px/s
  rollingBoulders: [
    {
      id: 'boulder_31',
      x: 2,
      y: 6,
      speedX: 195,
      autoStart: false,
      bounce: 0.1
    }
  ],

  portal: {
    x: 39,
    y: 10
  },

  triggers: [
    // Внезапный срыв валуна за спиной котика при попытке пробежать вперёд
    {
      id: 'trig_31_boulder',
      conditionType: 'player_x_greater',
      conditionValue: 8.0,
      targetId: 'boulder_31',
      action: 'release_boulder',
      once: true
    }
  ]
};
