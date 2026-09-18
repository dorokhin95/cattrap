import { LevelData } from './LevelData';

export const level28: LevelData = {
  id: 28,
  chapter: 3,
  theme: 'chapter3',
  name: 'Фазовый автобег',
  width: 48,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Стартовая площадка разбега (x=0..6, y=11..13)
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: i, y: 13 })),

    // Остров безопасности посередине (x=22..24, y=11..13)
    ...Array.from({ length: 3 }, (_, i) => ({ x: 22 + i, y: 11 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 22 + i, y: 12 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 22 + i, y: 13 })),

    // Финишная площадка (x=40..47, y=11..13)
    ...Array.from({ length: 8 }, (_, i) => ({ x: 40 + i, y: 11 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 40 + i, y: 12 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 40 + i, y: 13 })),

    // Стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 47, y: i }))
  ],

  // Зона автобега
  controlZones: [
    {
      id: 'cz_28_auto',
      x: 5,
      y: 9,
      width: 34,
      height: 3,
      type: 'autorun_right'
    },
    {
      id: 'cz_28_norm',
      x: 39,
      y: 9,
      width: 8,
      height: 3,
      type: 'normal'
    }
  ],

  // Фазовые блоки: котик бежит автоматически вправо, нужно прыгать с блока на блок в такт
  glitchBlocks: [
    // Первая связка
    { id: 'gb_28_1', x: 9, y: 11, phaseGroup: 'A', activeMs: 900, inactiveMs: 900, initialPhase: 'active' },
    { id: 'gb_28_2', x: 13, y: 10, phaseGroup: 'B', activeMs: 900, inactiveMs: 900, initialPhase: 'inactive' },
    { id: 'gb_28_3', x: 17, y: 10, phaseGroup: 'A', activeMs: 900, inactiveMs: 900, initialPhase: 'active' },

    // Вторая связка
    { id: 'gb_28_4', x: 27, y: 11, phaseGroup: 'A', activeMs: 850, inactiveMs: 850, initialPhase: 'active' },
    { id: 'gb_28_5', x: 31, y: 10, phaseGroup: 'B', activeMs: 850, inactiveMs: 850, initialPhase: 'inactive' },
    { id: 'gb_28_6', x: 35, y: 9, phaseGroup: 'A', activeMs: 850, inactiveMs: 850, initialPhase: 'active' }
  ],

  // Батут на среднем острове
  bouncePads: [
    { id: 'bp_28', x: 23, y: 10, power: -500 }
  ],

  // Сплошной слой шипов внизу
  staticSpikes: [
    ...Array.from({ length: 15 }, (_, i) => ({ x: 7 + i, y: 14 })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 25 + i, y: 14 }))
  ],

  portal: {
    x: 44,
    y: 10
  },

  triggers: []
};
