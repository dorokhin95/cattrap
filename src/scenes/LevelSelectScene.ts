import Phaser from 'phaser';
import { SaveProvider } from '../save/SaveProvider';
import { AudioManager } from '../audio/AudioManager';
import { LevelRegistry } from '../game/levels/LevelRegistry';
import { PlatformManager } from '../platform/PlatformManager';

export class LevelSelectScene extends Phaser.Scene {
  private container!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  private boundResize = () => {
    this.container.removeAll(true);
    this.renderView();
  };

  public create(): void {
    this.cameras.main.setBackgroundColor('#181622');
    this.container = this.add.container(0, 0);

    // Поддержка Telegram BackButton
    PlatformManager.getInstance().showBackButton(() => {
      this.scene.start('MenuScene');
    });

    this.renderView();

    this.scale.on('resize', this.boundResize);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  public shutdown(): void {
    this.scale.off('resize', this.boundResize);
  }

  private renderView(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const save = SaveProvider.getInstance();
    const highestUnlocked = save.getData().highestUnlockedLevel;
    const totalLevels = LevelRegistry.getTotalLevels();

    // Заголовок
    const title = this.add.text(width / 2, height * 0.12, 'ВЫБОР УРОВНЯ', {
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#f59e42'
    }).setOrigin(0.5);

    // Кнопка назад
    const backBtn = this.add.text(width / 2, height * 0.90, '◀ НАЗАД В МЕНЮ', {
      fontSize: '18px',
      color: '#94a3b8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      this.scene.start('MenuScene');
    });

    this.container.add([title, backBtn]);

    // Сетка уровней: 2 ряда по 5 уровней
    const cols = 5;
    const tileSize = Math.min(64, Math.floor(width / 6));
    const gap = 16;
    const startX = width / 2 - ((cols - 1) * (tileSize + gap)) / 2;
    const startY = height * 0.32;

    for (let i = 1; i <= totalLevels; i++) {
      const col = (i - 1) % cols;
      const row = Math.floor((i - 1) / cols);
      const x = startX + col * (tileSize + gap);
      const y = startY + row * (tileSize + gap * 2.2);

      const isUnlocked = i <= highestUnlocked;
      const isCompleted = save.isLevelCompleted(i);
      const isCurrent = i === highestUnlocked;

      let bgColor = 0x242033;
      let strokeColor = 0x3e3857;
      let textColor = '#64748b';

      if (isUnlocked) {
        bgColor = isCurrent ? 0x0284c7 : 0x2e2942;
        strokeColor = isCurrent ? 0x38bdf8 : 0x64748b;
        textColor = '#ffffff';
      }

      const box = this.add.rectangle(x, y, tileSize, tileSize, bgColor)
        .setStrokeStyle(2, strokeColor);

      let labelText = i < 10 ? `0${i}` : `${i}`;
      if (!isUnlocked) {
        labelText = '🔒';
      } else if (isCompleted) {
        labelText += '\n✓';
      }

      const label = this.add.text(x, y, labelText, {
        fontSize: isUnlocked ? '18px' : '22px',
        fontStyle: 'bold',
        color: textColor,
        align: 'center'
      }).setOrigin(0.5);

      if (isUnlocked) {
        box.setInteractive({ useHandCursor: true });
        box.on('pointerdown', () => {
          AudioManager.getInstance().playSFX('click');
          box.setScale(0.92);
        });
        box.on('pointerup', () => {
          box.setScale(1);
          this.scene.start('GameScene', { level: i });
        });
        box.on('pointerover', () => {
          if (!isCurrent) box.setFillStyle(0x3b3554);
        });
        box.on('pointerout', () => {
          if (!isCurrent) box.setFillStyle(bgColor);
          box.setScale(1);
        });

        // Отображение лучшего времени и смертей под плиткой
        const bestTime = save.getData().bestTimes[i];
        const deaths = save.getData().deathsPerLevel[i];
        if (bestTime !== undefined || deaths !== undefined) {
          const statsStr = [
            bestTime !== undefined ? `${bestTime}s` : null,
            deaths !== undefined && deaths > 0 ? `☠${deaths}` : null
          ].filter(Boolean).join(' ');

          const statsText = this.add.text(x, y + tileSize / 2 + 10, statsStr, {
            fontSize: '10px',
            color: '#10b981'
          }).setOrigin(0.5);
          this.container.add(statsText);
        }
      }

      this.container.add([box, label]);
    }
  }
}
