import Phaser from 'phaser';
import { SaveProvider } from '../save/SaveProvider';
import { AudioManager } from '../audio/AudioManager';
import { PlatformManager } from '../platform/PlatformManager';

interface ChapterMeta {
  id: number;
  fromLevel: number;
  toLevel: number;
  title: string;
  tabLabel: string;
  themeColor: string;
  accentColor: string;
  cardBg: number;
  cardStroke: number;
  tileBg: number;
  tileStroke: number;
  activeTileBg: number;
  activeTileStroke: number;
  unlockRequirement: string;
  description: string;
}

const CHAPTERS: ChapterMeta[] = [
  {
    id: 1,
    fromLevel: 1,
    toLevel: 10,
    title: 'ГЛАВА 1: ПОДВОХИ',
    tabLabel: 'ГЛАВА 1',
    themeColor: '#f59e42',
    accentColor: '#fbbf24',
    cardBg: 0x1c172a,
    cardStroke: 0x3d3559,
    tileBg: 0x252033,
    tileStroke: 0x3e3857,
    activeTileBg: 0xca8a04,
    activeTileStroke: 0xfacc15,
    unlockRequirement: '',
    description: '10 уровней с внезапными ловушками'
  },
  {
    id: 2,
    fromLevel: 11,
    toLevel: 20,
    title: '⚡ ГЛАВА 2: ДВИЖЕНИЕ',
    tabLabel: '⚡ ГЛАВА 2',
    themeColor: '#38bdf8',
    accentColor: '#0ea5e9',
    cardBg: 0x0c1e2c,
    cardStroke: 0x14b8a6,
    tileBg: 0x131c26,
    tileStroke: 0x223242,
    activeTileBg: 0x0284c7,
    activeTileStroke: 0x38bdf8,
    unlockRequirement: 'Пройдите Уровень 10 для доступа',
    description: '10 уровней с изменённой физикой'
  },
  {
    id: 3,
    fromLevel: 21,
    toLevel: 30,
    title: '🌀 ГЛАВА 3: МАТРИЦА',
    tabLabel: '🌀 ГЛАВА 3',
    themeColor: '#06b6d4',
    accentColor: '#ec4899',
    cardBg: 0x0b1120,
    cardStroke: 0x06b6d4,
    tileBg: 0x0f172a,
    tileStroke: 0x1e293b,
    activeTileBg: 0x0891b2,
    activeTileStroke: 0xec4899,
    unlockRequirement: 'Пройдите Уровень 20 для доступа',
    description: '10 уровней с глитчами, порталами и временем'
  },
  {
    id: 4,
    fromLevel: 31,
    toLevel: 40,
    title: '⛰️ ГЛАВА 4: КАТАКОМБЫ',
    tabLabel: '⛰️ ГЛАВА 4',
    themeColor: '#a855f7',
    accentColor: '#f97316',
    cardBg: 0x121118,
    cardStroke: 0x524e68,
    tileBg: 0x1a1923,
    tileStroke: 0x2a2838,
    activeTileBg: 0x7e22ce,
    activeTileStroke: 0xf97316,
    unlockRequirement: 'Пройдите Уровень 30 для доступа',
    description: '10 уровней с катящимися валунами и лабиринтами'
  }
];

export class LevelSelectScene extends Phaser.Scene {
  private container!: Phaser.GameObjects.Container;
  private activeChapter: number = 1;

  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  public init(data?: { chapter?: number }): void {
    const save = SaveProvider.getInstance();
    const highest = save.getData().highestUnlockedLevel;
    if (data?.chapter && data.chapter >= 1 && data.chapter <= 4) {
      this.activeChapter = data.chapter;
    } else {
      if (highest >= 31) {
        this.activeChapter = 4;
      } else if (highest >= 21) {
        this.activeChapter = 3;
      } else if (highest >= 11) {
        this.activeChapter = 2;
      } else {
        this.activeChapter = 1;
      }
    }
  }

  private boundResize = () => {
    this.container.removeAll(true);
    this.renderView();
  };

  public create(): void {
    this.cameras.main.setBackgroundColor('#0b0e17');
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

    const isWide = width >= 640;
    const titleY = Math.max(22, height * 0.05);

    // Главный заголовок
    const title = this.add.text(width / 2, titleY, 'ВЫБОР УРОВНЯ', {
      fontSize: isWide ? '24px' : '20px',
      fontStyle: 'bold',
      color: '#f8fafc'
    }).setOrigin(0.5);
    this.container.add(title);

    // Вкладки глав (Tabs)
    const tabY = titleY + (isWide ? 34 : 30);
    const tabCount = CHAPTERS.length;
    const tabGap = 8;
    const maxTabWidth = isWide ? 150 : Math.floor((width - 32 - (tabCount - 1) * tabGap) / tabCount);
    const totalTabsWidth = tabCount * maxTabWidth + (tabCount - 1) * tabGap;
    const tabStartX = width / 2 - totalTabsWidth / 2 + maxTabWidth / 2;

    CHAPTERS.forEach((ch, idx) => {
      const tabX = tabStartX + idx * (maxTabWidth + tabGap);
      const isUnlocked = ch.id === 1 || (ch.id === 2 && highestUnlocked >= 11) || (ch.id === 3 && highestUnlocked >= 21);
      const isActive = ch.id === this.activeChapter;

      let tabLabel = isWide ? ch.tabLabel : `Гл. ${ch.id}`;
      if (!isUnlocked) {
        tabLabel = isWide ? `🔒 ${ch.tabLabel.replace(/^[⚡🌀]\s*/, '')}` : `🔒 ${ch.id}`;
      }

      const tabBgColor = isActive ? ch.cardBg : 0x151c28;
      const tabStrokeColor = isActive ? Phaser.Display.Color.HexStringToColor(ch.themeColor).color : 0x223242;

      const tabBox = this.add.rectangle(tabX, tabY, maxTabWidth, 32, tabBgColor, 0.95)
        .setStrokeStyle(isActive ? 2 : 1, tabStrokeColor)
        .setInteractive({ useHandCursor: true });

      const tabText = this.add.text(tabX, tabY, tabLabel, {
        fontSize: isWide ? '13px' : '11px',
        fontStyle: isActive ? 'bold' : 'normal',
        color: isActive ? ch.themeColor : (isUnlocked ? '#94a3b8' : '#64748b')
      }).setOrigin(0.5);

      tabBox.on('pointerdown', () => {
        AudioManager.getInstance().playSFX('click');
        this.activeChapter = ch.id;
        this.container.removeAll(true);
        this.renderView();
      });

      this.container.add([tabBox, tabText]);
    });

    // Кнопка назад в меню
    const backBtnY = Math.min(height - 20, height * 0.94);
    const backBtn = this.add.text(width / 2, backBtnY, '◀ НАЗАД В МЕНЮ', {
      fontSize: '14px',
      color: '#94a3b8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      this.scene.start('MenuScene');
    });
    this.container.add(backBtn);

    // Карточка выбранной главы
    const curChapter = CHAPTERS.find(c => c.id === this.activeChapter) || CHAPTERS[0];
    const isCurUnlocked = curChapter.id === 1
      || (curChapter.id === 2 && highestUnlocked >= 11)
      || (curChapter.id === 3 && highestUnlocked >= 21)
      || (curChapter.id === 4 && highestUnlocked >= 31);

    const cardTop = tabY + 22;
    const cardBottom = backBtnY - 14;
    const cardHeight = Math.min(270, cardBottom - cardTop);
    const cardY = cardTop + cardHeight / 2;
    const cardWidth = Math.min(520, width - 24);

    this.renderActiveChapterCard(
      curChapter,
      isCurUnlocked,
      width / 2,
      cardY,
      cardWidth,
      cardHeight,
      highestUnlocked,
      save
    );
  }

  private renderActiveChapterCard(
    chapter: ChapterMeta,
    isChapterUnlocked: boolean,
    cardX: number,
    cardY: number,
    cardWidth: number,
    cardHeight: number,
    highestUnlocked: number,
    save: SaveProvider
  ): void {
    // 1. Панель-карточка с рамкой
    const cardPanel = this.add.rectangle(cardX, cardY, cardWidth, cardHeight, chapter.cardBg, 0.9)
      .setStrokeStyle(2, chapter.cardStroke);
    this.container.add(cardPanel);

    // 2. Шапка карточки со стрелками переключения
    const headerY = cardY - cardHeight / 2 + 20;

    // Стрелка влево
    if (this.activeChapter > 1) {
      const prevBtn = this.add.text(cardX - cardWidth / 2 + 24, headerY, '◀', {
        fontSize: '18px',
        color: '#94a3b8'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      prevBtn.on('pointerdown', () => {
        AudioManager.getInstance().playSFX('click');
        this.activeChapter--;
        this.container.removeAll(true);
        this.renderView();
      });
      this.container.add(prevBtn);
    }

    // Стрелка вправо
    if (this.activeChapter < CHAPTERS.length) {
      const nextBtn = this.add.text(cardX + cardWidth / 2 - 24, headerY, '▶', {
        fontSize: '18px',
        color: '#94a3b8'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      nextBtn.on('pointerdown', () => {
        AudioManager.getInstance().playSFX('click');
        this.activeChapter++;
        this.container.removeAll(true);
        this.renderView();
      });
      this.container.add(nextBtn);
    }

    // Заголовок главы
    const headerTitle = isChapterUnlocked ? chapter.title : `🔒 ${chapter.title.replace(/^[⚡🌀]\s*/, '')}`;
    const header = this.add.text(cardX, headerY, headerTitle, {
      fontSize: '16px',
      fontStyle: 'bold',
      color: isChapterUnlocked ? chapter.themeColor : '#94a3b8'
    }).setOrigin(0.5);
    this.container.add(header);

    // 3. Подзаголовок / подсказка
    const subY = headerY + 18;
    const subText = isChapterUnlocked ? chapter.description : chapter.unlockRequirement;
    const subtitle = this.add.text(cardX, subY, subText, {
      fontSize: '11px',
      color: isChapterUnlocked ? '#94a3b8' : '#f59e0b'
    }).setOrigin(0.5);
    this.container.add(subtitle);

    // 4. Сетка кнопок (5 колонок × 2 ряда)
    const cols = 5;
    const tileSize = Math.min(54, Math.max(36, Math.floor((cardWidth - 50) / 5.5)));
    const gap = Math.max(6, Math.floor(tileSize * 0.22));

    const startX = cardX - ((cols - 1) * (tileSize + gap)) / 2;
    const contentTopOffset = 52;
    const startY = cardY - cardHeight / 2 + contentTopOffset + tileSize / 2 + 8;

    for (let i = chapter.fromLevel; i <= chapter.toLevel; i++) {
      const indexInChapter = i - chapter.fromLevel;
      const col = indexInChapter % cols;
      const row = Math.floor(indexInChapter / cols);
      const x = startX + col * (tileSize + gap);
      const y = startY + row * (tileSize + gap * 1.8);

      const isUnlocked = isChapterUnlocked && i <= highestUnlocked;
      const isCompleted = save.isLevelCompleted(i);
      const isCurrent = i === highestUnlocked;

      // Цветовая схема кнопки
      let bgColor = chapter.tileBg;
      let strokeColor = chapter.tileStroke;
      let textColor = '#64748b';

      if (isUnlocked) {
        if (isCurrent) {
          bgColor = chapter.activeTileBg;
          strokeColor = chapter.activeTileStroke;
          textColor = '#ffffff';
        } else {
          bgColor = chapter.cardBg;
          strokeColor = chapter.cardStroke;
          textColor = '#f8fafc';
        }
      }

      const box = this.add.rectangle(x, y, tileSize, tileSize, bgColor)
        .setStrokeStyle(isCurrent ? 2 : 1.5, strokeColor);

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
            box.setFillStyle(chapter.activeTileBg, 0.6);
          }
        });
        box.on('pointerout', () => {
          if (!isCurrent) box.setFillStyle(chapter.cardBg);
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
            color: chapter.themeColor
          }).setOrigin(0.5);
          this.container.add(statsText);
        }
      }

      this.container.add([box, label]);
    }
  }
}
