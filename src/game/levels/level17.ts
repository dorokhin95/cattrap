import { LevelData } from './LevelData';

export const level17: LevelData = {
  id: 17,
  chapter: 2,
  theme: 'chapter2',
  name: 'Не тормози',
  width: 46,
  height: 15,
  spawn: { x: 2, y: 10 },
  solidTiles: [
    // Section A: Стартовая площадка и безопасный разбег (x=0..12, y=11..13)
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 13 }, (_, i) => ({ x: i, y: 13 })),

    // Ритм-секция 1: Остров со статическим шипом и батутом (x=15..23, y=11..13)
    ...Array.from({ length: 9 }, (_, i) => ({ x: 15 + i, y: 11 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: 15 + i, y: 12 })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: 15 + i, y: 13 })),

    // Препятствие-стена над ямой (требует подброса на батуте)
    ...Array.from({ length: 2 }, (_, i) => ({ x: 24, y: 8 + i })),

    // Ритм-секция 2: Нижняя площадка приземления (x=25..27, y=12..14)
    ...Array.from({ length: 3 }, (_, i) => ({ x: 25 + i, y: 12 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 25 + i, y: 13 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 25 + i, y: 14 })),

    // Длинный участок с тролль-шипом и порталом (x=30..45, y=11..13)
    ...Array.from({ length: 16 }, (_, i) => ({ x: 30 + i, y: 11 })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 30 + i, y: 12 })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 30 + i, y: 13 })),

    // Стены
    ...Array.from({ length: 15 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 15 }, (_, i) => ({ x: 45, y: i }))
  ],

  // Зоны изменения управления: Автобег
  controlZones: [
    // Вход в режим автобега (x=5, длина 33 до x=38)
    {
      id: 'cz_autorun',
      x: 5,
      y: 9,
      width: 33,
      height: 2,
      type: 'autorun_right'
    },
    // Выход в нормальный режим перед финишем (x=39, длина 6)
    {
      id: 'cz_normal_finish',
      x: 39,
      y: 9,
      width: 6,
      height: 2,
      type: 'normal'
    }
  ],

  // Батут в ритм-секции
  bouncePads: [
    { id: 'bp_rhythm', x: 22, y: 10, power: -520 }
  ],

  // Статический шип на острове
  staticSpikes: [
    { x: 18, y: 10 }
  ],

  // Тролль-шип на длинном прямом участке автобега
  popSpikes: [
    { id: 'ps_autorun_troll', x: 36, y: 10 }
  ],

  portal: {
    x: 43,
    y: 10
  },

  triggers: [
    {
      id: 'trig_autorun_troll',
      conditionType: 'player_x_greater',
      conditionValue: 33.5,
      targetId: 'ps_autorun_troll',
      action: 'pop',
      once: true
    }
  ]
};
