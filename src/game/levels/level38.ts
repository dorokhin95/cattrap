import { LevelData } from './LevelData';

export const level38: LevelData = {
  id: 38,
  chapter: 4,
  theme: 'chapter4',
  name: 'Каменный пинбол',
  width: 46,
  height: 16,
  spawn: { x: 2, y: 12 },
  solidTiles: [
    // Стартовая платформа (x=0..6, y=13..15)
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 13 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 14 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 15 })),

    // Верхний карниз с валуном (x=5..9, y=4)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 5 + i, y: 4 })),

    // Остров 1 (x=12..16, y=12)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 12 + i, y: 12 })),

    // Остров 2 (x=20..24, y=10)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 20 + i, y: 10 })),

    // Остров 3 (x=28..32, y=12)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 28 + i, y: 12 })),

    // Финишная платформа (x=36..45, y=12..15)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 36 + i, y: 12 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 36 + i, y: 13 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 36 + i, y: 14 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 36 + i, y: 15 })),

    // Пол ямы под батутами
    { x: 10, y: 15 },
    { x: 26, y: 15 },

    // Граничные стены
    ...Array.from({ length: 16 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 45, y: i }))
  ],

  // Батуты пинбола, подбрасывающие валун в воздух над островами
  bouncePads: [
    { id: 'bp_38_1', x: 10, y: 14, power: -520 },
    { id: 'bp_38_2', x: 26, y: 14, power: -520 }
  ],

  // Шипы в бездне
  staticSpikes: [
    ...Array.from({ length: 5 }, (_, i) => ({ x: 7 + i, y: 15 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 17 + i, y: 15 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 33 + i, y: 15 }))
  ],

  // Пинбольный валун
  rollingBoulders: [
    {
      id: 'boulder_38',
      x: 7,
      y: 3,
      speedX: 130,
      autoStart: false,
      bounce: 0.85
    }
  ],

  // Выдвижной шип на острове 2
  popSpikes: [
    { id: 'spike_38', x: 22, y: 9 }
  ],

  portal: {
    x: 41,
    y: 11
  },

  triggers: [
    {
      id: 'trig_38_boulder',
      conditionType: 'player_x_greater',
      conditionValue: 5.5,
      targetId: 'boulder_38',
      action: 'release_boulder',
      once: true
    },
    {
      id: 'trig_38_spike',
      conditionType: 'player_x_greater',
      conditionValue: 18.0,
      targetId: 'spike_38',
      action: 'pop',
      once: true
    }
  ]
};
