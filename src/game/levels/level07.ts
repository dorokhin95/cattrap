import { LevelData } from './LevelData';

export const level07: LevelData = {
  id: 7,
  name: 'Маленький кот',
  width: 34,
  height: 14,
  spawn: { x: 2, y: 9 },
  solidTiles: [
    // 1. Монолитный пол (y = 10, 11, 12, 13)
    ...Array.from({ length: 34 }, (_, i) => ({ x: i, y: 10 })),
    ...Array.from({ length: 34 }, (_, i) => ({ x: i, y: 11 })),
    ...Array.from({ length: 34 }, (_, i) => ({ x: i, y: 12 })),
    ...Array.from({ length: 34 }, (_, i) => ({ x: i, y: 13 })),

    // 2. Стены
    ...Array.from({ length: 14 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 14 }, (_, i) => ({ x: 33, y: i })),

    // 3. Сплошной потолок стартовой комнаты (x = 1..7, y = 0..5, высота комнаты 4 тайла: y=6,7,8,9)
    ...Array.from({ length: 7 }, (_, xi) =>
      Array.from({ length: 6 }, (_, yi) => ({ x: 1 + xi, y: yi }))
    ).flat(),

    // 4. Сплошная скала над входной секцией туннеля (x = 8..12, y = 0..8, проход туннеля: y=9)
    ...Array.from({ length: 5 }, (_, xi) =>
      Array.from({ length: 9 }, (_, yi) => ({ x: 8 + xi, y: yi }))
    ).flat(),

    // 5. Ниша над выдвижным шипом (x = 13..15, y = 0..6, свободное пространство для прыжка: y=7,8,9 - высота 3 тайла!)
    ...Array.from({ length: 3 }, (_, xi) =>
      Array.from({ length: 7 }, (_, yi) => ({ x: 13 + xi, y: yi }))
    ).flat(),

    // 6. Сплошная скала над выходной секцией туннеля (x = 16..22, y = 0..8, проход туннеля: y=9)
    ...Array.from({ length: 7 }, (_, xi) =>
      Array.from({ length: 9 }, (_, yi) => ({ x: 16 + xi, y: yi }))
    ).flat(),

    // 7. Сплошной потолок финишной комнаты (x = 23..32, y = 0..5, высота комнаты 4 тайла)
    ...Array.from({ length: 10 }, (_, xi) =>
      Array.from({ length: 6 }, (_, yi) => ({ x: 23 + xi, y: yi }))
    ).flat()
  ],
  modifierZones: [
    // Зона уменьшения перед входом в туннель
    { x: 6, y: 9, type: 'shrink' },
    // Зона восстановления размера в просторной финишной комнате
    { x: 24, y: 9, type: 'restore_size' }
  ],
  staticSpikes: [
    // Свисающие шипы на потолке туннеля:
    // Просвет между остриём и полом = 16 px.
    // Большой кот (19-24 px) не пролезает и погибает!
    // Маленький котик (13 px) легко и свободно пробегает под ними!
    { x: 8, y: 9, upsideDown: true },
    { x: 9, y: 9, upsideDown: true },
    { x: 10, y: 9, upsideDown: true },
    { x: 11, y: 9, upsideDown: true },
    { x: 12, y: 9, upsideDown: true },

    // Вторая секция свисающих шипов после ниши с шипом
    { x: 16, y: 9, upsideDown: true },
    { x: 17, y: 9, upsideDown: true },
    { x: 18, y: 9, upsideDown: true },
    { x: 19, y: 9, upsideDown: true },
    { x: 20, y: 9, upsideDown: true },
    { x: 21, y: 9, upsideDown: true },
    { x: 22, y: 9, upsideDown: true },

    // Статический шип перед порталом
    { x: 28, y: 9 }
  ],
  popSpikes: [
    // Выдвижной шип в полу, над которым сделан высокий карман y=7,8,9 для безопасного прыжка
    { id: 'tunnel_spike', x: 14, y: 10 }
  ],
  portal: {
    x: 31,
    y: 9
  },
  triggers: [
    {
      id: 'trig_tunnel_spike',
      conditionType: 'player_x_greater',
      conditionValue: 12.8,
      targetId: 'tunnel_spike',
      action: 'pop',
      once: true
    }
  ]
};
