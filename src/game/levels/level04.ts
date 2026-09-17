import { LevelData } from './LevelData';

export const level04: LevelData = {
  id: 4,
  name: 'Беги, кот',
  width: 30,
  height: 12,
  spawn: { x: 2, y: 9 },
  solidTiles: [
    // Пол до шипов
    ...Array.from({ length: 9 }, (_, i) => ({ x: i, y: 10 })),
    // Пол после волны шипов (3 клетки безопасного разбега перед статическим шипом по ТЗ)
    ...Array.from({ length: 15 }, (_, i) => ({ x: 15 + i, y: 10 })),
    // Нижний монолитный слой
    ...Array.from({ length: 30 }, (_, i) => ({ x: i, y: 11 })),
    // Стены
    ...Array.from({ length: 12 }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: 12 }, (_, i) => ({ x: 29, y: i }))
  ],
  popSpikes: [
    { id: 'wave_1', x: 9, y: 10 },
    { id: 'wave_2', x: 10, y: 10 },
    { id: 'wave_3', x: 11, y: 10 },
    { id: 'wave_4', x: 12, y: 10 },
    { id: 'wave_5', x: 13, y: 10 },
    { id: 'wave_6', x: 14, y: 10 }
  ],
  staticSpikes: [
    { x: 18, y: 9 } // В конце беговой дорожки с запасом в 3 клетки
  ],
  portal: {
    x: 26,
    y: 9
  },
  triggers: [
    // Шипы активируются строго ПОЗАДИ котика, когда он пробегает вперед!
    // Каждая плитка взрывается шипом через 40 мс после того, как котик полностью сошел с неё на следующую плитку.
    // Если игрок бежит на полной скорости — шипы ритмично щёлкают прямо за его хвостом.
    {
      id: 'chain_spike_1',
      conditionType: 'player_x_greater',
      conditionValue: 10.2,
      targetId: 'wave_1',
      action: 'pop',
      delayMs: 40,
      once: true
    },
    {
      id: 'chain_spike_2',
      conditionType: 'player_x_greater',
      conditionValue: 11.2,
      targetId: 'wave_2',
      action: 'pop',
      delayMs: 40,
      once: true
    },
    {
      id: 'chain_spike_3',
      conditionType: 'player_x_greater',
      conditionValue: 12.2,
      targetId: 'wave_3',
      action: 'pop',
      delayMs: 40,
      once: true
    },
    {
      id: 'chain_spike_4',
      conditionType: 'player_x_greater',
      conditionValue: 13.2,
      targetId: 'wave_4',
      action: 'pop',
      delayMs: 40,
      once: true
    },
    {
      id: 'chain_spike_5',
      conditionType: 'player_x_greater',
      conditionValue: 14.2,
      targetId: 'wave_5',
      action: 'pop',
      delayMs: 40,
      once: true
    },
    {
      id: 'chain_spike_6',
      conditionType: 'player_x_greater',
      conditionValue: 15.2,
      targetId: 'wave_6',
      action: 'pop',
      delayMs: 40,
      once: true
    },
    // Резервная волна погони по времени:
    // Если игрок зашел на беговую дорожку (x >= 8.5), но испугался и остановился,
    // волна шипов стартует через 550 мс с интервалом 250 мс между плитками
    // (скорость волны медленнее бега кота: 250 мс против 178 мс кота, поэтому бегущий кот всегда опережает её).
    {
      id: 'fuse_wave_1',
      conditionType: 'player_x_greater',
      conditionValue: 8.5,
      targetId: 'wave_1',
      action: 'pop',
      delayMs: 550,
      once: true
    },
    {
      id: 'fuse_wave_2',
      conditionType: 'player_x_greater',
      conditionValue: 8.5,
      targetId: 'wave_2',
      action: 'pop',
      delayMs: 800,
      once: true
    },
    {
      id: 'fuse_wave_3',
      conditionType: 'player_x_greater',
      conditionValue: 8.5,
      targetId: 'wave_3',
      action: 'pop',
      delayMs: 1050,
      once: true
    },
    {
      id: 'fuse_wave_4',
      conditionType: 'player_x_greater',
      conditionValue: 8.5,
      targetId: 'wave_4',
      action: 'pop',
      delayMs: 1300,
      once: true
    },
    {
      id: 'fuse_wave_5',
      conditionType: 'player_x_greater',
      conditionValue: 8.5,
      targetId: 'wave_5',
      action: 'pop',
      delayMs: 1550,
      once: true
    },
    {
      id: 'fuse_wave_6',
      conditionType: 'player_x_greater',
      conditionValue: 8.5,
      targetId: 'wave_6',
      action: 'pop',
      delayMs: 1800,
      once: true
    }
  ]
};
