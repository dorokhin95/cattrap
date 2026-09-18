import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';
import { CONSTANTS } from './core/Constants';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: CONSTANTS.COLORS.BG_DARK,
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
  },
  input: {
    activePointers: 4,
    touch: {
      capture: true
    }
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
    powerPreference: 'high-performance',
    desynchronized: false
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: CONSTANTS.GRAVITY, x: 0 },
      fixedStep: false,
      debug: false
    }
  },
  scene: [BootScene, MenuScene, LevelSelectScene, GameScene, UIScene]
};

// Защита от системных меню и паразитных жестов на мобильных устройствах
window.addEventListener('contextmenu', (e) => e.preventDefault());

let game: Phaser.Game | null = null;

// Надежный пересчет размеров канваса при повороте экрана
const resizeGame = () => {
  if (!game || !game.scale) return;
  const container = document.getElementById('game-container');
  const width = container ? container.clientWidth : window.innerWidth;
  const height = container ? container.clientHeight : window.innerHeight;
  if (width > 0 && height > 0) {
    game.scale.resize(width, height);
    game.scale.refresh();
  }
};

window.addEventListener('resize', resizeGame);
window.addEventListener('orientationchange', () => {
  // На iOS Safari размеры окна обновляются с анимацией (50-300 мс)
  setTimeout(resizeGame, 50);
  setTimeout(resizeGame, 150);
  setTimeout(resizeGame, 300);
});

// Запуск игры
window.addEventListener('DOMContentLoaded', () => {
  game = new Phaser.Game(config);

  const container = document.getElementById('game-container');
  if (container && 'ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && game && game.scale) {
          game.scale.resize(width, height);
          game.scale.refresh();
        }
      }
    });
    ro.observe(container);
  }
});
