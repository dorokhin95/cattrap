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
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: CONSTANTS.GRAVITY, x: 0 },
      fps: 60,
      fixedStep: true,
      debug: false
    }
  },
  scene: [BootScene, MenuScene, LevelSelectScene, GameScene, UIScene]
};

// Защита от системных меню и паразитных жестов на мобильных устройствах
window.addEventListener('contextmenu', (e) => e.preventDefault());

// Запуск игры
window.addEventListener('DOMContentLoaded', () => {
  new Phaser.Game(config);
});
