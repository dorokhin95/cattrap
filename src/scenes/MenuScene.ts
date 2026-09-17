import Phaser from 'phaser';
import { SaveProvider } from '../save/SaveProvider';
import { AudioManager } from '../audio/AudioManager';
import { PlatformManager } from '../platform/PlatformManager';

export class MenuScene extends Phaser.Scene {
  private container!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'MenuScene' });
  }

  public create(): void {
    const save = SaveProvider.getInstance();
    const highestLevel = save.getData().highestUnlockedLevel;
    const isContinued = highestLevel > 1;

    this.cameras.main.setBackgroundColor('#181622');

    // Скрываем нативную кнопку Back в главном меню
    PlatformManager.getInstance().getPlatform().hideBackButton();

    this.container = this.add.container(0, 0);
    this.renderMenu(isContinued, highestLevel);

    // Подписка на изменение размера окна
    this.scale.on('resize', () => {
      this.container.removeAll(true);
      this.renderMenu(isContinued, highestLevel);
    });
  }

  private renderMenu(isContinued: boolean, highestLevel: number): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const isPortrait = height > width * 1.1;

    if (isPortrait) {
      this.renderPortrait(width, height, isContinued, highestLevel);
    } else {
      this.renderLandscape(width, height, isContinued, highestLevel);
    }
  }

  private renderPortrait(width: number, height: number, isContinued: boolean, highestLevel: number): void {
    // 1. Заголовок
    const title = this.add.text(width / 2, height * 0.16, 'CAT TRAP', {
      fontSize: '40px',
      fontStyle: 'bold',
      color: '#f59e42',
      stroke: '#2d2a32',
      strokeThickness: 6
    }).setOrigin(0.5);

    const subtitle = this.add.text(width / 2, height * 0.22, 'Ничему не верь', {
      fontSize: '18px',
      color: '#94a3b8'
    }).setOrigin(0.5);

    // 2. Декоративный котик и портал
    const portal = this.add.image(width / 2, height * 0.35, 'portal').setScale(1.2);
    this.tweens.add({
      targets: portal,
      scaleX: 1.3,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    const cat = this.add.sprite(width / 2, height * 0.36, 'cat').setScale(2.5);
    cat.play('cat_idle');

    this.container.add([title, subtitle, portal, cat]);

    // 3. Кнопки меню
    const startY = height * 0.52;
    const spacing = 58;
    let btnIndex = 0;

    // Главная кнопка Играть / Продолжить
    const mainBtnText = isContinued ? `ПРОДОЛЖИТЬ — УРОВЕНЬ ${highestLevel}` : 'ИГРАТЬ';
    this.createButton(width / 2, startY + btnIndex * spacing, mainBtnText, '#38bdf8', () => {
      this.scene.start('GameScene', { level: highestLevel });
    });
    btnIndex++;

    if (isContinued) {
      this.createButton(width / 2, startY + btnIndex * spacing, 'НОВАЯ ИГРА', '#f59e42', () => {
        this.scene.start('GameScene', { level: 1 });
      });
      btnIndex++;
    }

    this.createButton(width / 2, startY + btnIndex * spacing, 'УРОВНИ', '#ffffff', () => {
      this.scene.start('LevelSelectScene');
    });
    btnIndex++;

    this.createButton(width / 2, startY + btnIndex * spacing, 'НАСТРОЙКИ', '#ffffff', () => {
      this.scene.start('UIScene', { openSettingsFromMenu: true });
    });
  }

  private renderLandscape(width: number, height: number, isContinued: boolean, highestLevel: number): void {
    const leftCenterX = width * 0.32;
    const rightCenterX = width * 0.70;

    // Левая часть: логотип, котик, портал
    const title = this.add.text(leftCenterX, height * 0.22, 'CAT TRAP', {
      fontSize: '44px',
      fontStyle: 'bold',
      color: '#f59e42',
      stroke: '#2d2a32',
      strokeThickness: 6
    }).setOrigin(0.5);

    const subtitle = this.add.text(leftCenterX, height * 0.32, 'Ничему не верь', {
      fontSize: '18px',
      color: '#94a3b8'
    }).setOrigin(0.5);

    const portal = this.add.image(leftCenterX, height * 0.60, 'portal').setScale(1.4);
    const cat = this.add.sprite(leftCenterX, height * 0.62, 'cat').setScale(3.0);
    cat.play('cat_idle');

    this.container.add([title, subtitle, portal, cat]);

    // Правая часть: кнопки
    const startY = height * 0.30;
    const spacing = 62;
    let btnIndex = 0;

    const mainBtnText = isContinued ? `ПРОДОЛЖИТЬ — УРОВЕНЬ ${highestLevel}` : 'ИГРАТЬ';
    this.createButton(rightCenterX, startY + btnIndex * spacing, mainBtnText, '#38bdf8', () => {
      this.scene.start('GameScene', { level: highestLevel });
    });
    btnIndex++;

    if (isContinued) {
      this.createButton(rightCenterX, startY + btnIndex * spacing, 'НОВАЯ ИГРА', '#f59e42', () => {
        this.scene.start('GameScene', { level: 1 });
      });
      btnIndex++;
    }

    this.createButton(rightCenterX, startY + btnIndex * spacing, 'УРОВНИ', '#ffffff', () => {
      this.scene.start('LevelSelectScene');
    });
    btnIndex++;

    this.createButton(rightCenterX, startY + btnIndex * spacing, 'НАСТРОЙКИ', '#ffffff', () => {
      this.scene.start('UIScene', { openSettingsFromMenu: true });
    });
  }

  private createButton(x: number, y: number, text: string, color: string, onClick: () => void): void {
    const btnW = 280;
    const btnH = 46;

    const bg = this.add.rectangle(x, y, btnW, btnH, 0x272438, 0.9)
      .setStrokeStyle(2, 0x474261)
      .setInteractive({ useHandCursor: true });

    const label = this.add.text(x, y, text, {
      fontSize: '17px',
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

    bg.on('pointerover', () => {
      bg.setFillStyle(0x383452);
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(0x272438);
      bg.setScale(1);
    });

    this.container.add([bg, label]);
  }
}
