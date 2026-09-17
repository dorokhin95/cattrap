import { LevelData } from './LevelData';

export const level16: LevelData = {
  id: 16,
  chapter: 2,
  theme: 'chapter2',
  name: 'Лево — это право',
  width: 44,
  height: 14,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Стартовая площадка и зона привыкания (x=0..20, y=11..13)
    ...Array.from({ length: 21 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 21 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 21 }, (_, i) => ({ x: i, y: 13 })),

    // Section B: Приземление после ямы x=21..23 (x=24..27, y=11..13)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 24 + i, y: 11 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 24 + i, y: 12 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 24 + i, y: 13 })),

    // Exit: Зона возврата в normal и адаптация (x=28..33, y=11..13)
    ...Array.from({ length: 6 }, (_, i) => ({ x: 28 + i, y: 11 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 28 + i, y: 12 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 28 + i, y: 13 })),

    // Section C: Вторая короткая реверс-зона и финал (x=34..43, y=11..13)
    ...Array.from({ length: 10 }, (_, i) => ({ x: 34 + i, y: 11 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 34 + i, y: 12 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 34 + i, y: 13 })),

    // Стены
    ...Array.from({ length: 14 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 14 }, (_, i) => ({ x: 43, y: i }))
  ],

  // Зоны изменения управления
  controlZones: [
    // Первая длинная зона реверса (вход на x=5, длина 22)
    {
      id: 'cz_rev_1',
      x: 5,
      y: 9,
      width: 22,
      height: 2,
      type: 'reverse'
    },
    // Зона восстановления обычного управления (x=28, длина 5)
    {
      id: 'cz_norm_1',
      x: 28,
      y: 9,
      width: 5,
      height: 2,
      type: 'normal'
    },
    // Вторая короткая зона реверса перед финишем (x=34, длина 6)
    {
      id: 'cz_rev_2',
      x: 34,
      y: 9,
      width: 6,
      height: 2,
      type: 'reverse'
    },
    // Финальное восстановление перед порталом
    {
      id: 'cz_norm_final',
      x: 40,
      y: 9,
      width: 3,
      height: 2,
      type: 'normal'
    }
  ],

  // Один знакомый PopSpike во второй реверс-зоне
  popSpikes: [
    { id: 'ps_rev_spike', x: 38, y: 10 }
  ],

  portal: {
    x: 41,
    y: 10
  },

  triggers: [
    {
      id: 'trig_rev_spike',
      conditionType: 'player_x_greater',
      conditionValue: 35.5,
      targetId: 'ps_rev_spike',
      action: 'pop',
      once: true
    }
  ]
};
