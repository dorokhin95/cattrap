import Phaser from 'phaser';
import { EVENTS } from '../core/Events';
import { TouchControls } from '../ui/TouchControls';
import { SaveProvider } from '../save/SaveProvider';
import { AudioManager } from '../audio/AudioManager';
import { PlatformManager } from '../platform/PlatformManager';

export class UIScene extends Phaser.Scene {
  private levelId = 1;
  private levelName = '';

  private hudContainer!: Phaser.GameObjects.Container;
  private pauseModal!: Phaser.GameObjects.Container;
  private settingsModal!: Phaser.GameObjects.Container;
  private victoryModal!: Phaser.GameObjects.Container;

  private pauseBtn!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private deathsText!: Phaser.GameObjects.Text;

  private touchControls!: TouchControls;
  private isPaused = false;
  private isSettingsOpen = false;
  private settingsOrigin: 'menu' | 'pause' = 'pause';

  // Именованные обработчики событий для безопасной отписки при SHUTDOWN
  private boundHandleResize = (gameSize?: Phaser.Structs.Size) => this.handleResize(gameSize);
  private boundLevelStart = (data: { levelId: number; levelName: string }) => {
    this.levelId = data.levelId;
    this.levelName = data.levelName;
    const numStr = this.levelId < 10 ? `0${this.levelId}` : `${this.levelId}`;
    this.levelText.setText(`УРОВЕНЬ ${numStr}`);
    this.timerText.setText('00.0s');
    this.deathsText.setText('☠ 0');
  };
  private boundUpdateTimer = (seconds: number) => {
    this.timerText.setText(`${seconds.toFixed(1)}s`);
  };
  private boundPlayerDeath = (deaths: number) => {
    this.deathsText.setText(`☠ ${deaths}`);
  };
  private boundLevelRestart = () => {
    this.touchControls.resetInputOnRespawn();
  };
  private boundPauseStateChanged = (paused: boolean) => {
    this.isPaused = paused;
    if (this.isPaused) {
      this.renderPauseModalContent();
      this.pauseModal.setVisible(true);
      this.touchControls.setVisible(false);
      this.touchControls.setEnabled(false);
    } else {
      this.pauseModal.setVisible(false);
      this.touchControls.setVisible(true);
      this.touchControls.setEnabled(true);
    }
  };
  private boundChapterComplete = (data: { totalDeaths: number }) => {
    this.showVictoryScreen(data.totalDeaths);
  };

  constructor() {
    super({ key: 'UIScene' });
  }

  public init(data: { levelId?: number; levelName?: string; openSettingsFromMenu?: boolean }): void {
    this.levelId = data.levelId || 1;
    this.levelName = data.levelName || '';
    this.isSettingsOpen = !!data.openSettingsFromMenu;
    this.settingsOrigin = data.openSettingsFromMenu ? 'menu' : 'pause';
  }

  public create(): void {
    this.hudContainer = this.add.container(0, 0);

    // 1. Создание сенсорных контроллеров
    this.touchControls = new TouchControls(this);

    // 2. Создание HUD
    this.createHUD();

    // 3. Создание модальных окон
    this.createPauseModal();
    this.createSettingsModal();
    this.createVictoryModal();

    if (this.isSettingsOpen) {
      this.openSettings(true);
    }

    // 4. Подписка на события
    this.setupEventListeners();

    // 5. Обработка ресайза
    this.scale.on('resize', this.boundHandleResize);
    this.handleResize();

    // 6. Очистка при завершении сцены
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  private createHUD(): void {
    // Кнопка паузы
    this.pauseBtn = this.add.text(24, 20, '⏸', {
      fontSize: '26px',
      color: '#ffffff'
    }).setInteractive({ useHandCursor: true });

    this.pauseBtn.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      this.game.events.emit(EVENTS.PAUSE_REQUEST);
    });

    // Название уровня
    const numStr = this.levelId < 10 ? `0${this.levelId}` : `${this.levelId}`;
    this.levelText = this.add.text(80, 24, `УРОВЕНЬ ${numStr}`, {
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#38bdf8'
    });

    // Таймер
    this.timerText = this.add.text(240, 24, '00.0s', {
      fontSize: '15px',
      color: '#94a3b8'
    });

    // Счётчик смертей
    this.deathsText = this.add.text(320, 24, '☠ 0', {
      fontSize: '15px',
      color: '#f43f5e'
    });

    this.hudContainer.add([this.pauseBtn, this.levelText, this.timerText, this.deathsText]);
  }

  private createPauseModal(): void {
    this.pauseModal = this.add.container(0, 0);
    this.pauseModal.setVisible(false);
  }

  private renderPauseModalContent(): void {
    this.pauseModal.removeAll(true);
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 50% затемнение экрана (ТЗ пункт 35)
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
      .setInteractive();

    const title = this.add.text(width / 2, height * 0.22, 'ПАУЗА', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#f59e42'
    }).setOrigin(0.5);

    const levelInfo = this.add.text(width / 2, height * 0.29, `Уровень ${this.levelId} — ${this.levelName}`, {
      fontSize: '16px',
      color: '#94a3b8'
    }).setOrigin(0.5);

    this.pauseModal.add([overlay, title, levelInfo]);

    const startY = height * 0.38;
    const spacing = 52;
    let idx = 0;

    // Кнопки паузы
    this.createModalButton(this.pauseModal, width / 2, startY + idx++ * spacing, 'ПРОДОЛЖИТЬ', '#38bdf8', () => {
      this.game.events.emit(EVENTS.PAUSE_REQUEST, false);
    });

    this.createModalButton(this.pauseModal, width / 2, startY + idx++ * spacing, 'НАЧАТЬ ЗАНОВО', '#f59e42', () => {
      this.game.events.emit(EVENTS.PAUSE_REQUEST, false);
      this.game.events.emit(EVENTS.RETRY_LEVEL);
    });

    this.createModalButton(this.pauseModal, width / 2, startY + idx++ * spacing, 'ВЫБОР УРОВНЯ', '#ffffff', () => {
      this.scene.stop('GameScene');
      this.scene.start('LevelSelectScene');
    });

    this.createModalButton(this.pauseModal, width / 2, startY + idx++ * spacing, 'НАСТРОЙКИ', '#ffffff', () => {
      this.pauseModal.setVisible(false);
      this.openSettings(false);
    });

    this.createModalButton(this.pauseModal, width / 2, startY + idx++ * spacing, 'ГЛАВНОЕ МЕНЮ', '#94a3b8', () => {
      this.scene.stop('GameScene');
      this.scene.start('MenuScene');
    });
  }

  private createSettingsModal(): void {
    this.settingsModal = this.add.container(0, 0);
    this.settingsModal.setVisible(false);
  }

  private openSettings(fromMenu: boolean): void {
    this.isSettingsOpen = true;
    this.settingsOrigin = fromMenu ? 'menu' : 'pause';
    this.renderSettingsContent(fromMenu);
    this.settingsModal.setVisible(true);
    this.hudContainer.setVisible(false);
    this.touchControls.setVisible(false);
    this.touchControls.setEnabled(false);
  }

  private renderSettingsContent(fromMenu: boolean): void {
    this.settingsModal.removeAll(true);
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const save = SaveProvider.getInstance();
    const settings = save.getSettings();

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x14121c, 0.95)
      .setInteractive();

    const title = this.add.text(width / 2, height * 0.14, 'НАСТРОЙКИ', {
      fontSize: '30px',
      fontStyle: 'bold',
      color: '#f59e42'
    }).setOrigin(0.5);

    this.settingsModal.add([overlay, title]);

    const startY = height * 0.25;
    const spacing = 48;
    let idx = 0;

    // Музыка
    this.createToggleOption(
      width / 2, startY + idx++ * spacing,
      'Музыка',
      settings.music,
      (val) => {
        save.updateSettings({ music: val });
        AudioManager.getInstance().syncMusicState();
        this.renderSettingsContent(fromMenu);
      }
    );

    // Звуки SFX
    this.createToggleOption(
      width / 2, startY + idx++ * spacing,
      'Звуки SFX',
      settings.sfx,
      (val) => {
        save.updateSettings({ sfx: val });
        this.renderSettingsContent(fromMenu);
      }
    );

    // Вибрация (Haptics)
    this.createToggleOption(
      width / 2, startY + idx++ * spacing,
      'Вибрация',
      settings.vibration,
      (val) => {
        save.updateSettings({ vibration: val });
        this.renderSettingsContent(fromMenu);
      }
    );

    // Тряска экрана (Screen Shake)
    this.createToggleOption(
      width / 2, startY + idx++ * spacing,
      'Тряска экрана',
      settings.screenShake,
      (val) => {
        save.updateSettings({ screenShake: val });
        this.renderSettingsContent(fromMenu);
      }
    );

    // Прозрачность кнопок (50% / 75% / 100%)
    const opacityText = `${Math.round(settings.touchOpacity * 100)}%`;
    this.createOptionButton(
      width / 2, startY + idx++ * spacing,
      `Прозрачность кнопок: ${opacityText}`,
      () => {
        let nextOpacity = 0.75;
        if (settings.touchOpacity === 0.75) nextOpacity = 1.0;
        else if (settings.touchOpacity === 1.0) nextOpacity = 0.5;
        save.updateSettings({ touchOpacity: nextOpacity });
        const aspect = width / (height || 1);
        const modeNow = aspect < 0.85 ? 'portrait' : aspect <= 1.15 ? 'compact' : 'landscape';
        const rootNow = getComputedStyle(document.documentElement);
        const sab = parseFloat(rootNow.getPropertyValue('--sab')) || 0;
        const sat = parseFloat(rootNow.getPropertyValue('--sat')) || 0;
        this.touchControls.updateLayout(modeNow, width, height, sab, sat);
        this.renderSettingsContent(fromMenu);
      }
    );

    // Кнопка сброса смертей и прогресса
    this.createOptionButton(
      width / 2, startY + idx++ * spacing,
      'Сбросить смерти и прогресс',
      () => {
        save.resetProgress();
        this.renderSettingsContent(fromMenu);
      },
      '#f43f5e'
    );

    // Кнопка Назад / Сохранить
    this.createModalButton(this.settingsModal, width / 2, startY + (idx + 0.3) * spacing, 'НАЗАД', '#38bdf8', () => {
      this.settingsModal.setVisible(false);
      this.isSettingsOpen = false;
      if (fromMenu) {
        this.scene.start('MenuScene');
      } else {
        this.pauseModal.setVisible(true);
        this.hudContainer.setVisible(true);
        this.touchControls.setVisible(true);
        this.touchControls.setEnabled(true);
      }
    });
  }

  private createToggleOption(x: number, y: number, label: string, value: boolean, onToggle: (newVal: boolean) => void): void {
    const text = `${label}: ${value ? 'ВКЛ' : 'ВЫКЛ'}`;
    const color = value ? '#10b981' : '#64748b';
    this.createOptionButton(x, y, text, () => onToggle(!value), color);
  }

  private createOptionButton(x: number, y: number, text: string, onClick: () => void, textColor = '#ffffff'): void {
    const bg = this.add.rectangle(x, y, 290, 40, 0x272438)
      .setStrokeStyle(1, 0x474261)
      .setInteractive({ useHandCursor: true });

    const lbl = this.add.text(x, y, text, {
      fontSize: '15px',
      color: textColor
    }).setOrigin(0.5);

    bg.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      onClick();
    });

    this.settingsModal.add([bg, lbl]);
  }

  private createVictoryModal(): void {
    this.victoryModal = this.add.container(0, 0);
    this.victoryModal.setVisible(false);
  }

  private showVictoryScreen(totalDeaths: number): void {
    this.victoryModal.removeAll(true);
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // overlay — самый нижний слой, иначе он перекроет кнопки
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x120e24, 0.96)
      .setInteractive();
    this.victoryModal.add(overlay);

    const title = this.add.text(width / 2, height * 0.18, 'ГЛАВА 1 ПРОЙДЕНА!', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#facc15',
      stroke: '#451a03',
      strokeThickness: 5
    }).setOrigin(0.5);

    const cat = this.add.sprite(width / 2, height * 0.38, 'cat').setScale(3.5);
    cat.play('cat_idle');

    const stats = this.add.text(width / 2, height * 0.55, `Всего смертей: ${totalDeaths}\nКотик доволен и мурлычет! 🐱`, {
      fontSize: '18px',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 10
    }).setOrigin(0.5);

    this.victoryModal.add([title, cat, stats]);

    // Кнопки добавляются последними — поверх всего
    this.createModalButton(this.victoryModal, width / 2, height * 0.74, 'В ГЛАВНОЕ МЕНЮ', '#38bdf8', () => {
      this.scene.stop('GameScene');
      this.scene.start('MenuScene');
    });
    this.createModalButton(this.victoryModal, width / 2, height * 0.74 + 56, 'ВЫБОР УРОВНЯ', '#94a3b8', () => {
      this.scene.stop('GameScene');
      this.scene.start('LevelSelectScene');
    });

    this.victoryModal.setVisible(true);
    this.hudContainer.setVisible(false);
    this.touchControls.setVisible(false);
    this.touchControls.setEnabled(false);
  }

  private createModalButton(container: Phaser.GameObjects.Container, x: number, y: number, text: string, color: string, onClick: () => void): void {
    const bg = this.add.rectangle(x, y, 260, 44, 0x272438)
      .setStrokeStyle(2, 0x474261)
      .setInteractive({ useHandCursor: true });

    const lbl = this.add.text(x, y, text, {
      fontSize: '16px',
      fontStyle: 'bold',
      color: color
    }).setOrigin(0.5);

    bg.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      bg.setScale(0.96);
    });

    bg.on('pointerup', () => {
      bg.setScale(1);
      onClick();
    });

    container.add([bg, lbl]);
  }

  private setupEventListeners(): void {
    this.game.events.on(EVENTS.LEVEL_START, this.boundLevelStart);
    this.game.events.on(EVENTS.UPDATE_TIMER, this.boundUpdateTimer);
    this.game.events.on(EVENTS.PLAYER_DEATH, this.boundPlayerDeath);
    this.game.events.on(EVENTS.LEVEL_RESTART, this.boundLevelRestart);
    this.game.events.on(EVENTS.PAUSE_STATE_CHANGED, this.boundPauseStateChanged);
    this.game.events.on(EVENTS.CHAPTER_COMPLETE, this.boundChapterComplete);
  }

  public shutdown(): void {
    this.scale.off('resize', this.boundHandleResize);
    this.game.events.off(EVENTS.LEVEL_START, this.boundLevelStart);
    this.game.events.off(EVENTS.UPDATE_TIMER, this.boundUpdateTimer);
    this.game.events.off(EVENTS.PLAYER_DEATH, this.boundPlayerDeath);
    this.game.events.off(EVENTS.LEVEL_RESTART, this.boundLevelRestart);
    this.game.events.off(EVENTS.PAUSE_STATE_CHANGED, this.boundPauseStateChanged);
    this.game.events.off(EVENTS.CHAPTER_COMPLETE, this.boundChapterComplete);
  }

  private handleResize(gameSize?: Phaser.Structs.Size): void {
    const width = gameSize ? gameSize.width : this.scale.gameSize.width;
    const height = gameSize ? gameSize.height : this.scale.gameSize.height;

    // Гарантируем, что камера UIScene строго совпадает с новым окном
    this.cameras.main.setViewport(0, 0, width, height);
    this.cameras.main.setSize(width, height);

    // Единый платформенный источник геометрии и Safe Area
    const vp = PlatformManager.getInstance().getViewport(width, height);
    const mode = vp.mode;
    const safeTop = vp.safeArea.top;
    const safeBottom = vp.safeArea.bottom;
    const safeLeft = vp.safeArea.left;

    // Обновляем геометрию сенсорных кнопок под новый размер
    this.touchControls.updateLayout(mode, width, height, safeBottom, safeTop);

    // Центрирование HUD
    if (mode === 'portrait') {
      this.pauseBtn.setPosition(safeLeft + 16, safeTop + 16);
      this.levelText.setPosition(safeLeft + 64, safeTop + 20);
      this.timerText.setPosition(safeLeft + 180, safeTop + 20);
      this.deathsText.setPosition(safeLeft + 250, safeTop + 20);
    } else {
      this.pauseBtn.setPosition(safeLeft + 24, safeTop + 20);
      this.levelText.setPosition(safeLeft + 76, safeTop + 24);
      this.timerText.setPosition(safeLeft + 240, safeTop + 24);
      this.deathsText.setPosition(safeLeft + 330, safeTop + 24);
    }

    // Если открыты модальные окна, обновляем их центрирование под новый размер
    if (this.isPaused && this.pauseModal && this.pauseModal.visible) {
      this.renderPauseModalContent();
    }
    if (this.isSettingsOpen && this.settingsModal && this.settingsModal.visible) {
      this.renderSettingsContent(this.settingsOrigin === 'menu');
    }
  }

  public getTouchInput() {
    return this.touchControls.getInput();
  }
}
