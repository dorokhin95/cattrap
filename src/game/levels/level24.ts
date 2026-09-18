import { LevelData } from './LevelData';

export const level24: LevelData = {
  id: 24,
  chapter: 3,
  theme: 'chapter3',
  name: 'Не оглядывайся',
  width: 48,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Сплошной длинный раннер с ямами и ступенями
    // Разгонная полоса (x=0..12, y=11..13)
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 13 })),

    // Остров 1 (x=15..21, y=11..13)
    ...Array.from({ length: 7 }, (_, i) => ({ x: 15 + i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 15 + i, y: 12 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 15 + i, y: 13 })),

    // Ступень вверх (x=24..30, y=9..13)
    ...Array.from({ length: 7 }, (_, i) => ({ x: 24 + i, y: 9 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 24 + i, y: 10 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 24 + i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 24 + i, y: 12 })),

    // Ступень вниз (x=33..38, y=10..13)
    ...Array.from({ length: 6 }, (_, i) => ({ x: 33 + i, y: 10 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 33 + i, y: 11 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 33 + i, y: 12 })),

    // Финишная площадка (x=41..47, y=11..13)
    ...Array.from({ length: 7 }, (_, i) => ({ x: 41 + i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 41 + i, y: 12 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 41 + i, y: 13 })),

    // Стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 47, y: i }))
  ],

  // Теневой клон, гонящийся по пятам (активируется строго по триггеру при выходе со спавна)
  echoCat: {
    id: 'echo_24',
    delayMs: 750,
    autoStart: false
  },

  // Одиночные статические шипы на беговой дорожке
  staticSpikes: [
    { x: 8, y: 10 },
    { x: 18, y: 10 },
    { x: 27, y: 8 },
    { x: 36, y: 9 }
  ],

  portal: {
    x: 45,
    y: 10
  },

  triggers: [
    // Активация эхо-кота только когда игрок начинает забег и сходит со стартовой площадки
    {
      id: 'trig_24_echo',
      conditionType: 'player_x_greater',
      conditionValue: 5.5,
      targetId: 'echo_24',
      action: 'spawn_echo',
      once: true
    }
  ]
};
