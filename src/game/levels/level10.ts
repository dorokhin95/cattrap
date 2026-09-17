import { LevelData } from './LevelData';

export const level10: LevelData = {
  id: 10,
  name: 'Девять жизней',
  width: 54,
  height: 16,
  spawn: { x: 2, y: 11 },
  checkpoint: { x: 22, y: 11 },
  solidTiles: [
    // Секция A: стартовый пол
    ...Array.from({ length: 15 }, (_, i) => ({ x: i, y: 12 })),
    // Островок с чекпоинтом
    { x: 21, y: 12 }, { x: 22, y: 12 }, { x: 23, y: 12 },
    // Секция C: туннель для маленького котика (пол на y=12)
    ...Array.from({ length: 11 }, (_, i) => ({ x: 24 + i, y: 12 })),
    // Низкий потолок туннеля с карманом на x=28 над выдвижным шипом
    ...Array.from({ length: 3 }, (_, i) => ({ x: 25 + i, y: 10 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 29 + i, y: 10 })),
    // Низкий твердый свод лаза (просвет 16 px)
    ...Array.from({ length: 3 }, (_, i) => ({ x: 25 + i, y: 11, type: 'tunnel_bar' as const })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 29 + i, y: 11, type: 'tunnel_bar' as const })),
    // Секция D: потолочная дорожка гравитации
    ...Array.from({ length: 6 }, (_, i) => ({ x: 35 + i, y: 4 })),
    // Секция E: финишная площадка
    ...Array.from({ length: 13 }, (_, i) => ({ x: 42 + i, y: 12 })),
    // Монолитный нижний слой
    ...Array.from({ length: 54 }, (_, i) => ({ x: i, y: 15 })),
    // Стены
    ...Array.from({ length: 16 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 53, y: i }))
  ],
  staticSpikes: [
    // Секция A
    { x: 6, y: 11 },
    // Секция D: перевернутый шип на потолке
    { x: 38, y: 5, upsideDown: true },
    // Шипы на дне пропасти под гравитационной секцией
    { x: 35, y: 14 }, { x: 36, y: 14 }, { x: 37, y: 14 },
    { x: 38, y: 14 }, { x: 39, y: 14 }, { x: 40, y: 14 }
  ],
  popSpikes: [
    // Секция A: два выдвижных шипа
    { id: 'l10_pop_1', x: 9, y: 12 },
    { id: 'l10_pop_2', x: 12, y: 12 },
    // Секция C: шип в туннеле
    { id: 'l10_tunnel_spike', x: 28, y: 12 },
    // Секция E: финальная волна шипов
    { id: 'l10_wave_1', x: 44, y: 12 },
    { id: 'l10_wave_2', x: 45, y: 12 },
    { id: 'l10_wave_3', x: 46, y: 12 },
    { id: 'l10_wave_4', x: 47, y: 12 }
  ],
  fallingBlocks: [
    {
      id: 'l10_falling_block',
      x: 16,
      y: 4,
      landingY: 10.5
    }
  ],
  crumbleBlocks: [
    // Мост в Секции B
    { id: 'l10_c1', x: 18, y: 12 },
    { id: 'l10_c2', x: 19, y: 12 },
    { id: 'l10_c3', x: 20, y: 12 },
    // Осыпающаяся плитка на потолке в Секции D
    { id: 'l10_c_ceil', x: 41, y: 4 }
  ],
  modifierZones: [
    // Секция C: уменьшение и восстановление
    { x: 24, y: 11, type: 'shrink' },
    { x: 33, y: 11, type: 'restore_size' },
    // Секция D: инверсия и восстановление гравитации
    { x: 34, y: 11, type: 'gravity_invert' },
    { x: 42, y: 6, type: 'gravity_normal' }
  ],
  portal: {
    x: 46,
    y: 11,
    targets: [
      { x: 51, y: 11 } // Убегает вправо на 5 клеток к финишу
    ]
  },
  triggers: [
    // Секция A
    {
      id: 'trig_l10_p1',
      conditionType: 'player_x_greater',
      conditionValue: 7.8,
      targetId: 'l10_pop_1',
      action: 'pop',
      once: true
    },
    {
      id: 'trig_l10_p2',
      conditionType: 'player_x_greater',
      conditionValue: 10.5,
      targetId: 'l10_pop_2',
      action: 'pop',
      once: true
    },
    // Секция B: сброс блока
    {
      id: 'trig_l10_drop',
      conditionType: 'player_x_greater',
      conditionValue: 13.5,
      targetId: 'l10_falling_block',
      action: 'drop',
      once: true
    },
    // Секция C: шип в узком туннеле
    {
      id: 'trig_l10_tunnel',
      conditionType: 'player_x_greater',
      conditionValue: 26.5,
      targetId: 'l10_tunnel_spike',
      action: 'pop',
      once: true
    },
    // Секция E: приближение к порталу -> портал убегает, волна шипов щелкает сзади!
    {
      id: 'trig_l10_portal_run',
      conditionType: 'player_x_greater',
      conditionValue: 43.2,
      targetId: 'portal',
      action: 'move_portal',
      once: true
    },
    {
      id: 'trig_l10_wave_1',
      conditionType: 'player_x_greater',
      conditionValue: 45.2,
      targetId: 'l10_wave_1',
      action: 'pop',
      delayMs: 40,
      once: true
    },
    {
      id: 'trig_l10_wave_2',
      conditionType: 'player_x_greater',
      conditionValue: 46.2,
      targetId: 'l10_wave_2',
      action: 'pop',
      delayMs: 40,
      once: true
    },
    {
      id: 'trig_l10_wave_3',
      conditionType: 'player_x_greater',
      conditionValue: 47.2,
      targetId: 'l10_wave_3',
      action: 'pop',
      delayMs: 40,
      once: true
    },
    {
      id: 'trig_l10_wave_4',
      conditionType: 'player_x_greater',
      conditionValue: 48.2,
      targetId: 'l10_wave_4',
      action: 'pop',
      delayMs: 40,
      once: true
    },
    {
      id: 'trig_l10_wave_fuse_1',
      conditionType: 'player_x_greater',
      conditionValue: 43.5,
      targetId: 'l10_wave_1',
      action: 'pop',
      delayMs: 550,
      once: true
    },
    {
      id: 'trig_l10_wave_fuse_2',
      conditionType: 'player_x_greater',
      conditionValue: 43.5,
      targetId: 'l10_wave_2',
      action: 'pop',
      delayMs: 800,
      once: true
    },
    {
      id: 'trig_l10_wave_fuse_3',
      conditionType: 'player_x_greater',
      conditionValue: 43.5,
      targetId: 'l10_wave_3',
      action: 'pop',
      delayMs: 1050,
      once: true
    },
    {
      id: 'trig_l10_wave_fuse_4',
      conditionType: 'player_x_greater',
      conditionValue: 43.5,
      targetId: 'l10_wave_4',
      action: 'pop',
      delayMs: 1300,
      once: true
    }
  ]
};
