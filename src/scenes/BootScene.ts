import Phaser from 'phaser';
import { PixelArtGenerator } from '../assets/PixelArtGenerator';
import { PlatformManager } from '../platform/PlatformManager';
import { AudioManager } from '../audio/AudioManager';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  public async create(): Promise<void> {
    // 1. Инициализация платформы (Telegram WebApp / Browser)
    await PlatformManager.getInstance().init();
    PlatformManager.getInstance().getPlatform().ready();

    // 2. Генерация всех пиксель-арт текстур процедурно
    PixelArtGenerator.generateAll(this);

    // 3. Синхронизация фоновой музыки
    AudioManager.getInstance().syncMusicState();

    // 4. Переход в главное меню
    this.scene.start('MenuScene');
  }
}
