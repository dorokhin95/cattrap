import { LevelData } from './LevelData';

export const level19: LevelData = {
  id: 19,
  chapter: 2,
  theme: 'chapter2',
  name: 'Всё наоборот',
  width: 50,
  height: 16,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Начальная площадка (x=0..7, y=11..13)
    ...Array.from({ length: 8 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: i, y: 13 })),

    // Section B: Реверс-коридор с прессом (x=8..20, y=11..13)
    ...Array.from({ length: 13 }, (_, i) => ({ x: 8 + i, y: 11 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: 8 + i, y: 12 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: 8 + i, y: 13 })),

    // Потолок над прессом Section B (x=13..17, y=2..3)
    ...Array.from({ length: 5 }, (_, i) => ({ x: 13 + i, y: 2 })),
    ...Array.from({ length: 5 }, (_, i) => ({ x: 13 + i, y: 3 })),

    // Section C: Пол с обманным участком (x=21..24 и x=27..32, y=11..13)
    ...Array.from({ length: 4 }, (_, i) => ({ x: 21 + i, y: 11 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 27 + i, y: 11 })),
    // Нижняя поддержка Section C
    ...Array.from({ length: 12 }, (_, i) => ({ x: 21 + i, y: 13 })),

    // Section D: Нижняя площадка ожидания платформы (x=33..38, y=11..13)
    ...Array.from({ length: 6 }, (_, i) => ({ x: 33 + i, y: 11 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 33 + i, y: 12 })),
    ...Array.from({ length: 6 }, (_, i) => ({ x: 33 + i, y: 13 })),

    // Финишная верхняя площадка с настоящим порталом (x=43..49, y=5..7)
    ...Array.from({ length: 7 }, (_, i) => ({ x: 43 + i, y: 5 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 43 + i, y: 6 })),
    ...Array.from({ length: 7 }, (_, i) => ({ x: 43 + i, y: 7 })),

    // Стены
    ...Array.from({ length: 16 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 49, y: i }))
  ],

  // Зоны изменения управления
  controlZones: [
    // Вход в реверс (x=8, длина 13)
    {
      id: 'cz_rev_b',
      x: 8,
      y: 9,
      width: 13,
      height: 2,
      type: 'reverse'
    },
    // Выход в normal (x=21, длина 29)
    {
      id: 'cz_norm_c',
      x: 21,
      y: 9,
      width: 29,
      height: 2,
      type: 'normal'
    }
  ],

  // Пресс в реверс-секции (медленный и читаемый)
  crushers: [
    {
      id: 'crush_rev',
      x: 15,
      y: 4,
      targetX: 15,
      targetY: 10,
      orientation: 'down',
      warningMs: 320,
      slamMs: 140,
      retractMs: 380,
      cycle: true
    }
  ],

  // Обманный пол в Section C (плиты x=25 и x=26)
  fakeFloors: [
    { id: 'ff_19_a', x: 25, y: 11 },
    { id: 'ff_19_b', x: 26, y: 11 }
  ],

  // Движущаяся платформа, поднимающая котика к переместившемуся порталу
  movingPlatforms: [
    {
      id: 'mp_to_real_portal',
      x: 40,
      y: 11,
      targetX: 40,
      targetY: 5,
      speed: 55,
      pingPong: true
    }
  ],

  // Портал сначала внизу на x=37, y=10. При подходе котика смещается наверх на x=46, y=4
  portal: {
    x: 37,
    y: 10,
    targets: [
      { x: 46, y: 4 }
    ]
  },

  triggers: [
    {
      id: 'trig_shift_portal_19',
      conditionType: 'player_x_greater',
      conditionValue: 34,
      targetId: 'portal',
      action: 'move_portal',
      once: true
    }
  ]
};
