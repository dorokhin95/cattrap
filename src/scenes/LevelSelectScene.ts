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
    const isChapter2Unlocked = highestUnlocked >= 11;

    // Главный заголовок
    const isWide = width >= 760 && height <= 620;
    const titleY = Math.max(22, height * (isWide ? 0.07 : 0.06));

    const title = this.add.text(width / 2, titleY, 'ВЫБОР УРОВНЯ', {
      fontSize: isWide ? '24px' : '26px',
      fontStyle: 'bold',
      color: '#f59e42'
    }).setOrigin(0.5);
    this.container.add(title);

    // Кнопка назад в меню
    const backBtnY = Math.min(height - 24, height * 0.94);
    const backBtn = this.add.text(width / 2, backBtnY, '◀ НАЗАД В МЕНЮ', {
      fontSize: '16px',
      color: '#94a3b8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      this.scene.start('MenuScene');
    });
    this.container.add(backBtn);

    if (isWide) {
      // Горизонтальный макет: Глава 1 слева, Глава 2 справа
      const ch1CenterX = width * 0.28;
      const ch2CenterX = width * 0.72;
      const startGridY = Math.max(70, height * 0.22);

      this.renderChapterSection(
        1, 10,
        'ГЛАВА 1: ПОДВОХИ',
        '#f59e42',
        true,
        ch1CenterX,
        startGridY,
        false,
        highestUnlocked,
        save
      );

      this.renderChapterSection(
        11, 20,
        isChapter2Unlocked ? '⚡ ГЛАВА 2: ПРАВИЛА ДВИЖЕНИЯ' : '🔒 ГЛАВА 2: ПРАВИЛА ДВИЖЕНИЯ',
        isChapter2Unlocked ? '#38bdf8' : '#64748b',
        isChapter2Unlocked,
        ch2CenterX,
        startGridY,
        true,
        highestUnlocked,
        save,
        !isChapter2Unlocked ? 'Пройдите Уровень 10' : undefined
      );
    } else {
      // Вертикальный адаптивный макет: Глава 1 сверху, Глава 2 снизу
      const centerX = width / 2;
      const ch1HeaderY = titleY + 32;
      const tileSize = Math.min(46, Math.max(34, Math.floor((width - 48) / 5.5)));
      const gap = Math.max(6, Math.floor(tileSize * 0.22));

      const ch1GridY = ch1HeaderY + 22 + tileSize / 2;
      this.renderChapterSection(
        1, 10,
        'ГЛАВА 1: ПОДВОХИ',
        '#f59e42',
        true,
        centerX,
        ch1GridY,
        false,
        highestUnlocked,
        save,
        undefined,
        ch1HeaderY,
        tileSize,
        gap
      );

      // Глава 2
      const ch1BottomY = ch1GridY + tileSize + gap * 2 + tileSize / 2;
      const ch2HeaderY = ch1BottomY + 22;
      const ch2GridY = ch2HeaderY + 22 + tileSize / 2;

      this.renderChapterSection(
        11, 20,
        isChapter2Unlocked ? '⚡ ГЛАВА 2: ПРАВИЛА ДВИЖЕНИЯ' : '🔒 ГЛАВА 2: ПРАВИЛА ДВИЖЕНИЯ',
        isChapter2Unlocked ? '#38bdf8' : '#64748b',
        isChapter2Unlocked,
        centerX,
        ch2GridY,
        true,
        highestUnlocked,
        save,
        !isChapter2Unlocked ? 'Пройдите Уровень 10' : undefined,
        ch2HeaderY,
        tileSize,
        gap
      );
    }
  }

  private renderChapterSection(
    fromLevel: number,
    toLevel: number,
    titleText: string,
    titleColor: string,
    isChapterUnlocked: boolean,
    centerX: number,
    startY: number,
    isChapter2: boolean,
    highestUnlocked: number,
    save: SaveProvider,
    hintText?: string,
    headerY?: number,
    customTileSize?: number,
    customGap?: number
  ): void {
    const width = this.cameras.main.width;
    const cols = 5;
    const tileSize = customTileSize ?? Math.min(48, Math.max(32, Math.floor((width * 0.42) / 5.5)));
    const gap = customGap ?? Math.max(6, Math.floor(tileSize * 0.22));

    // Заголовок главы
    const actualHeaderY = headerY ?? (startY - 26);
    const header = this.add.text(centerX, actualHeaderY, titleText, {
      fontSize: '15px',
      fontStyle: 'bold',
      color: titleColor
    }).setOrigin(0.5);
    this.container.add(header);

    if (hintText) {
      const hint = this.add.text(centerX, actualHeaderY + 16, hintText, {
        fontSize: '11px',
        color: '#64748b'
      }).setOrigin(0.5);
      this.container.add(hint);
    }

    const startX = centerX - ((cols - 1) * (tileSize + gap)) / 2;

    for (let i = fromLevel; i <= toLevel; i++) {
      const indexInChapter = i - fromLevel;
      const col = indexInChapter % cols;
      const row = Math.floor(indexInChapter / cols);
      const x = startX + col * (tileSize + gap);
      const y = startY + row * (tileSize + gap * 1.9);

      const isUnlocked = isChapterUnlocked && i <= highestUnlocked;
      const isCompleted = save.isLevelCompleted(i);
      const isCurrent = i === highestUnlocked;

      // Цветовая схема
      let bgColor = isChapter2 ? 0x111c26 : 0x242033;
      let strokeColor = isChapter2 ? 0x1f3042 : 0x3e3857;
      let textColor = '#64748b';

      if (isUnlocked) {
        if (isChapter2) {
          bgColor = isCurrent ? 0x0284c7 : 0x0c2738;
          strokeColor = isCurrent ? 0x38bdf8 : 0x14b8a6;
          textColor = '#e0f2fe';
        } else {
          bgColor = isCurrent ? 0xca8a04 : 0x2e2942;
          strokeColor = isCurrent ? 0xfacc15 : 0x64748b;
          textColor = '#ffffff';
        }
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
        fontSize: isUnlocked ? '15px' : '18px',
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
          if (!isCurrent) {
            box.setFillStyle(isChapter2 ? 0x173a52 : 0x3b3554);
          }
        });
        box.on('pointerout', () => {
          if (!isCurrent) box.setFillStyle(bgColor);
          box.setScale(1);
        });

        // Статистика лучшего времени и смертей
        const bestTime = save.getData().bestTimes[i];
        const deaths = save.getData().deathsPerLevel[i];
        if (bestTime !== undefined || deaths !== undefined) {
          const statsStr = [
            bestTime !== undefined ? `${bestTime}s` : null,
            deaths !== undefined && deaths > 0 ? `☠${deaths}` : null
          ].filter(Boolean).join(' ');

          const statsText = this.add.text(x, y + tileSize / 2 + 8, statsStr, {
            fontSize: '9px',
            color: isChapter2 ? '#38bdf8' : '#10b981'
          }).setOrigin(0.5);
          this.container.add(statsText);
        }
      }

      this.container.add([box, label]);
    }
  }
}
