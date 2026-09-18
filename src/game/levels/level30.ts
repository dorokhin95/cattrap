import { LevelData } from './LevelData';

export const level30: LevelData = {
  id: 30,
  chapter: 3,
  theme: 'chapter3',
  name: 'Ядро матрицы',
  isChapterEnd: true,
  width: 64,
  height: 16,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Старт и лазерный коридор (x=0..10, y=11..13)
    ...Array.from({ length: 11 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 11 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 11 }, (_, i) => ({ x: i, y: 13 })),

    // Остров перед телепортом (x=17..20, y=11..13)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 17 + i, y: 11 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 17 + i, y: 12 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 17 + i, y: 13 })),

    // Section B: Остров с ЧЕКПОИНТОМ (x=28..34, y=11..13)
    ...Array.from({ length: 7 }, (_, i) => ({ x: 28 + i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 28 + i, y: 12 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 28 + i, y: 13 })),

    // Section C: Реверс-полоса с батутом (x=38..46, y=11..13)
    ...Array.from({ length: 9 }, (_, i) => ({ x: 38 + i, y: 11 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: 38 + i, y: 12 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: 38 + i, y: 13 })),

    // Section D: Финишная платформа (x=53..63, y=11..13)
    ...Array.from({ length: 11 }, (_, i) => ({ x: 53 + i, y: 11 })),
    ...Array.from({ length: 11 }, (_, i) => ({ x: 53 + i, y: 12 })),
    ...Array.from({ length: 11 }, (_, i) => ({ x: 53 + i, y: 13 })),

    // Верхний постамент для переместившегося портала (x=57..60, y=6..7)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 57 + i, y: 6 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 57 + i, y: 7 })),

    // Стены
    ...Array.from({ length: 16 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 63, y: i }))
  ],

  // Контрольная точка (Checkpoint) посередине мега-уровня
  checkpoint: {
    x: 31,
    y: 10
  },

  // Фазовые платформы в Section A (x=11..17)
  glitchBlocks: [
    { id: 'gb30_1a', x: 12, y: 11, phaseGroup: 'A', activeMs: 1000, inactiveMs: 1000, initialPhase: 'active' },
    { id: 'gb30_1b', x: 13, y: 11, phaseGroup: 'A', activeMs: 1000, inactiveMs: 1000, initialPhase: 'active' },
    { id: 'gb30_2a', x: 16, y: 10, phaseGroup: 'B', activeMs: 1000, inactiveMs: 1000, initialPhase: 'inactive' },
    { id: 'gb30_2b', x: 17, y: 10, phaseGroup: 'B', activeMs: 1000, inactiveMs: 1000, initialPhase: 'inactive' }
  ],

  // Варп-портал из Section A в Section B (к чекпоинту)
  warpGates: [
    {
      id: 'wg30_to_cp',
      x: 19,
      y: 10,
      targetX: 29,
      targetY: 10,
      exitImpulseX: 80
    }
  ],

  // Зона реверса управления в Section C
  controlZones: [
    {
      id: 'cz30_rev',
      x: 38,
      y: 9,
      width: 9,
      height: 3,
      type: 'reverse'
    },
    {
      id: 'cz30_norm',
      x: 47,
      y: 9,
      width: 6,
      height: 3,
      type: 'normal'
    }
  ],

  // Батут в реверс-секции
  bouncePads: [
    { id: 'bp30_c', x: 44, y: 10, power: -520 }
  ],

  // Зона замедления времени над финальной ямой (Section D)
  timeZones: [
    {
      id: 'tz30_final',
      x: 50,
      y: 7,
      width: 10,
      height: 10,
      timeScale: 0.45
    }
  ],

  // Лазеры - внезапные засады
  lasers: [
    // Лазер в начале уровня (срабатывает при приближении к яме Section A)
    {
      id: 'laser30_start',
      x: 6,
      y: 2,
      length: 9,
      direction: 'vertical',
      warningMs: 160,
      activeMs: 450,
      cooldownMs: 1300,
      cycle: false,
      autoStart: false
    },
    // Лазер над финишной зоной (срабатывает перед порталом)
    {
      id: 'laser30_end',
      x: 55,
      y: 3,
      length: 8,
      direction: 'vertical',
      warningMs: 160,
      activeMs: 500,
      cooldownMs: 1500,
      cycle: false,
      autoStart: false
    }
  ],

  // Шипы на дне пропастей
  staticSpikes: [
    ...Array.from({ length: 6 }, (_, i) => ({ x: 11 + i, y: 15 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 21 + i, y: 15 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 47 + i, y: 15 }))
  ],

  // Портал изначально на полу x=59, y=10. При приближении улетает наверх x=58, y=5!
  portal: {
    x: 59,
    y: 10,
    targets: [
      { x: 58, y: 5 }
    ]
  },

  triggers: [
    // Внезапный лазер в Section A
    {
      id: 'trig30_laser_start',
      conditionType: 'player_x_greater',
      conditionValue: 4.6,
      targetId: 'laser30_start',
      action: 'fire_laser',
      once: true
    },
    // Внезапный лазер перед порталом
    {
      id: 'trig30_laser_end',
      conditionType: 'player_x_greater',
      conditionValue: 53.5,
      targetId: 'laser30_end',
      action: 'fire_laser',
      once: true
    },
    // Побег портала на постамент
    {
      id: 'trig30_portal_shift',
      conditionType: 'player_x_greater',
      conditionValue: 56.5,
      targetId: 'portal',
      action: 'move_portal',
      once: true
    }
  ]
};
