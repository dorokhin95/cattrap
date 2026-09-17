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
    // Пол после волны шипов
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
    // Последовательная волна шипов за спиной кота с интервалом 120 мс
    {
      id: 'chain_spike_1',
      conditionType: 'player_x_greater',
      conditionValue: 8.5,
      targetId: 'wave_1',
      action: 'pop',
      delayMs: 0,
      once: true
    },
    {
      id: 'chain_spike_2',
      conditionType: 'player_x_greater',
      conditionValue: 8.5,
      targetId: 'wave_2',
      action: 'pop',
      delayMs: 130,
      once: true
    },
    {
      id: 'chain_spike_3',
      conditionType: 'player_x_greater',
      conditionValue: 8.5,
      targetId: 'wave_3',
      action: 'pop',
      delayMs: 260,
      once: true
    },
    {
      id: 'chain_spike_4',
      conditionType: 'player_x_greater',
      conditionValue: 8.5,
      targetId: 'wave_4',
      action: 'pop',
      delayMs: 390,
      once: true
    },
    {
      id: 'chain_spike_5',
      conditionType: 'player_x_greater',
      conditionValue: 8.5,
      targetId: 'wave_5',
      action: 'pop',
      delayMs: 520,
      once: true
    },
    {
      id: 'chain_spike_6',
      conditionType: 'player_x_greater',
      conditionValue: 8.5,
      targetId: 'wave_6',
      action: 'pop',
      delayMs: 650,
      once: true
    }
  ]
};
