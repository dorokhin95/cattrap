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

    const isWide = width >= 720;
    const titleY = Math.max(24, height * 0.06);

    // Главный заголовок
    const title = this.add.text(width / 2, titleY, 'ВЫБОР УРОВНЯ', {
      fontSize: isWide ? '26px' : '22px',
      fontStyle: 'bold',
      color: '#f59e42'
    }).setOrigin(0.5);
    this.container.add(title);

    // Кнопка назад в меню
    const backBtnY = Math.min(height - 22, height * 0.94);
    const backBtn = this.add.text(width / 2, backBtnY, '◀ НАЗАД В МЕНЮ', {
      fontSize: '15px',
      color: '#94a3b8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      this.scene.start('MenuScene');
    });
    this.container.add(backBtn);

    const availableHeight = backBtnY - titleY - 24;

    if (isWide) {
      // Горизонтальный макет: 2 карточки-панели бок о бок
      const cardWidth = Math.min(480, Math.floor((width - 60) / 2));
      const cardHeight = Math.min(availableHeight - 10, Math.max(260, Math.floor(height * 0.72)));
      const cardY = (titleY + 16 + backBtnY) / 2;

      const card1X = width / 2 - cardWidth / 2 - 14;
      const card2X = width / 2 + cardWidth / 2 + 14;

      this.renderChapterCard(
        1, 10,
        'ГЛАВА 1: ПОДВОХИ',
        '#f59e42',
        true,
        card1X,
        cardY,
        cardWidth,
        cardHeight,
        false,
        highestUnlocked,
        save,
        '10 уровней с внезапными ловушками'
      );

      this.renderChapterCard(
        11, 20,
        isChapter2Unlocked ? '⚡ ГЛАВА 2: ПРАВИЛА ДВИЖЕНИЯ' : '🔒 ГЛАВА 2: ПРАВИЛА ДВИЖЕНИЯ',
        isChapter2Unlocked ? '#38bdf8' : '#94a3b8',
        isChapter2Unlocked,
        card2X,
        cardY,
        cardWidth,
        cardHeight,
        true,
        highestUnlocked,
        save,
        !isChapter2Unlocked ? 'Пройдите Уровень 10 для доступа' : '10 уровней с новой физикой и механикой'
      );
    } else {
      // Вертикальный макет: 2 карточки-панели друг под другом
      const cardWidth = Math.min(390, width - 20);
      const cardHeight = Math.min(210, Math.floor((availableHeight - 16) / 2));

      const card1Y = titleY + 18 + cardHeight / 2;
      const card2Y = card1Y + cardHeight + 14;

      this.renderChapterCard(
        1, 10,
        'ГЛАВА 1: ПОДВОХИ',
        '#f59e42',
        true,
        width / 2,
        card1Y,
        cardWidth,
        cardHeight,
        false,
        highestUnlocked,
        save
      );

      this.renderChapterCard(
        11, 20,
        isChapter2Unlocked ? '⚡ ГЛАВА 2: ПРАВИЛА ДВИЖЕНИЯ' : '🔒 ГЛАВА 2: ПРАВИЛА ДВИЖЕНИЯ',
        isChapter2Unlocked ? '#38bdf8' : '#94a3b8',
        isChapter2Unlocked,
        width / 2,
        card2Y,
        cardWidth,
        cardHeight,
        true,
        highestUnlocked,
        save,
        !isChapter2Unlocked ? 'Пройдите Уровень 10' : undefined
      );
    }
  }

  private renderChapterCard(
    fromLevel: number,
    toLevel: number,
    titleText: string,
    titleColor: string,
    isChapterUnlocked: boolean,
    cardX: number,
    cardY: number,
    cardWidth: number,
    cardHeight: number,
    isChapter2: boolean,
    highestUnlocked: number,
    save: SaveProvider,
    subtitleText?: string
  ): void {
    // 1. Панель-карточка с рамкой
    const cardBgColor = isChapter2
      ? (isChapterUnlocked ? 0x0c1e2c : 0x111822)
      : 0x1c172a;
    const cardStrokeColor = isChapter2
      ? (isChapterUnlocked ? 0x14b8a6 : 0x223242)
      : 0x3d3559;

    const cardPanel = this.add.rectangle(cardX, cardY, cardWidth, cardHeight, cardBgColor, 0.85)
      .setStrokeStyle(2, cardStrokeColor);
    this.container.add(cardPanel);

    // 2. Заголовок карточки
    const headerY = cardY - cardHeight / 2 + 20;
    const header = this.add.text(cardX, headerY, titleText, {
      fontSize: '15px',
      fontStyle: 'bold',
      color: titleColor
    }).setOrigin(0.5);
    this.container.add(header);

    // 3. Подзаголовок / подсказка
    let contentTopOffset = 36;
    if (subtitleText) {
      const subY = headerY + 16;
      const subtitle = this.add.text(cardX, subY, subtitleText, {
        fontSize: '11px',
        color: isChapter2 && !isChapterUnlocked ? '#f59e0b' : '#64748b'
      }).setOrigin(0.5);
      this.container.add(subtitle);
      contentTopOffset = 48;
    }

    // 4. Сетка кнопок (5 колонок × 2 ряда)
    const cols = 5;
    const tileSize = Math.min(50, Math.max(32, Math.floor((cardWidth - 50) / 5.5)));
    const gap = Math.max(6, Math.floor(tileSize * 0.22));

    const startX = cardX - ((cols - 1) * (tileSize + gap)) / 2;
    const startY = cardY - cardHeight / 2 + contentTopOffset + tileSize / 2 + 6;

    for (let i = fromLevel; i <= toLevel; i++) {
      const indexInChapter = i - fromLevel;
      const col = indexInChapter % cols;
      const row = Math.floor(indexInChapter / cols);
      const x = startX + col * (tileSize + gap);
      const y = startY + row * (tileSize + gap * 1.8);

      const isUnlocked = isChapterUnlocked && i <= highestUnlocked;
      const isCompleted = save.isLevelCompleted(i);
      const isCurrent = i === highestUnlocked;

      // Цветовая схема
      let bgColor = isChapter2 ? 0x131c26 : 0x252033;
      let strokeColor = isChapter2 ? 0x223242 : 0x3e3857;
      let textColor = '#64748b';

      if (isUnlocked) {
        if (isChapter2) {
          bgColor = isCurrent ? 0x0284c7 : 0x0e2738;
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
        fontSize: isUnlocked ? '15px' : '17px',
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

          const statsText = this.add.text(x, y + tileSize / 2 + 7, statsStr, {
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
