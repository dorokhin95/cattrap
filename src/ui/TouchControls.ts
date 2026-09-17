import Phaser from 'phaser';
import { OrientationMode } from '../types';
import { SaveProvider } from '../save/SaveProvider';
import { PlatformManager } from '../platform/PlatformManager';

export class TouchControls {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;

  // D-Pad элементы (влево/вправо)
  private dpadBg!: Phaser.GameObjects.Rectangle;
  private btnLeftBg!: Phaser.GameObjects.Rectangle;
  private btnLeftText!: Phaser.GameObjects.Text;
  private btnRightBg!: Phaser.GameObjects.Rectangle;
  private btnRightText!: Phaser.GameObjects.Text;

  // Кнопка прыжка
  private jumpHitZone!: Phaser.GameObjects.Arc;
  private btnJumpBg!: Phaser.GameObjects.Arc;
  private btnJumpRing!: Phaser.GameObjects.Arc;
  private btnJumpIcon!: Phaser.GameObjects.Text;
  private btnJumpLabel!: Phaser.GameObjects.Text;

  // Текущее состояние ввода
  private isLeftHeld = false;
  private isRightHeld = false;
  private isJumpHeld = false;
  private isJumpJustPressed = false;
  private isJumpJustReleased = false;

  // Мультитач указатели
  private activeDPadPointerId: number | null = null;
  private activeJumpPointerId: number | null = null;

  // Координаты центра D-Pad для скольжения пальца
  private dpadCenterX = 0;
  private dpadCenterY = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.createControls();
    this.setupInteractions();
  }

  private createControls(): void {
    const settings = SaveProvider.getInstance().getSettings();
    const opacity = settings.touchOpacity;

    // --- 1. D-PAD (ВЛЕВО / ВПРАВО) ---
    // Общая сенсорная подложка-капсула D-Pad
    this.dpadBg = this.scene.add.rectangle(0, 0, 184, 84, 0x120e24, opacity * 0.6);
    this.dpadBg.setStrokeStyle(2, 0x474261, opacity * 0.7);

    // Левая клавиша
    this.btnLeftBg = this.scene.add.rectangle(0, 0, 86, 76, 0x221c38, opacity);
    this.btnLeftBg.setStrokeStyle(2, 0x64748b, opacity);
    this.btnLeftText = this.scene.add.text(0, 0, '◀', {
      fontSize: '34px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Правая клавиша
    this.btnRightBg = this.scene.add.rectangle(0, 0, 86, 76, 0x221c38, opacity);
    this.btnRightBg.setStrokeStyle(2, 0x64748b, opacity);
    this.btnRightText = this.scene.add.text(0, 0, '▶', {
      fontSize: '34px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // --- 2. КНОПКА ПРЫЖКА (JUMP) ---
    // Увеличенная невидимая область касания (Touch Target 150px)
    this.jumpHitZone = this.scene.add.circle(0, 0, 75, 0x000000, 0.001);

    // Внешнее светящееся кольцо
    this.btnJumpRing = this.scene.add.circle(0, 0, 52, 0x0284c7, opacity * 0.2);
    this.btnJumpRing.setStrokeStyle(3, 0x38bdf8, opacity * 0.9);

    // Основное тело кнопки прыжка (диаметр 92px)
    this.btnJumpBg = this.scene.add.circle(0, 0, 46, 0x1e293b, opacity);

    // Иконка и подпись прыжка
    this.btnJumpIcon = this.scene.add.text(0, -10, '▲', {
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#38bdf8'
    }).setOrigin(0.5);

    this.btnJumpLabel = this.scene.add.text(0, 16, 'JUMP', {
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.container.add([
      this.dpadBg,
      this.btnLeftBg, this.btnLeftText,
      this.btnRightBg, this.btnRightText,
      this.jumpHitZone,
      this.btnJumpRing, this.btnJumpBg,
      this.btnJumpIcon, this.btnJumpLabel
    ]);
  }

  private setupInteractions(): void {
    // Включаем интерактивность для единой широкой зоны D-Pad (220x120 px)
    this.dpadBg.setInteractive(
      new Phaser.Geom.Rectangle(-110, -60, 220, 120),
      Phaser.Geom.Rectangle.Contains
    );

    // Включаем интерактивность для кнопки прыжка (круг радиусом 75px = 150px диаметр!)
    this.jumpHitZone.setInteractive(
      new Phaser.Geom.Circle(0, 0, 75),
      Phaser.Geom.Circle.Contains
    );

    // --- ОБРАБОТКА D-PAD (С ПОДДЕРЖКОЙ СКОЛЬЖЕНИЯ ПАЛЬЦА) ---
    this.dpadBg.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.activeDPadPointerId = pointer.id;
      this.updateDPadDirection(pointer.x);
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.id === this.activeDPadPointerId) {
        this.updateDPadDirection(pointer.x);
      }
    });

    // --- ОБРАБОТКА ПРЫЖКА ---
    this.jumpHitZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.activeJumpPointerId = pointer.id;
      this.isJumpHeld = true;
      this.isJumpJustPressed = true;

      // Визуальный отклик нажатия
      this.btnJumpBg.setScale(0.92);
      this.btnJumpRing.setScale(0.95);
      this.btnJumpBg.setFillStyle(0x0284c7, 1);
      this.btnJumpIcon.setColor('#ffffff');

      PlatformManager.getInstance().getPlatform().haptic('light');
    });

    // --- ГЛОБАЛЬНЫЕ СОБЫТИЯ ОТПУСКАНИЯ УКАЗАТЕЛЕЙ ---
    const handlePointerRelease = (pointer: Phaser.Input.Pointer) => {
      if (pointer.id === this.activeDPadPointerId) {
        this.isLeftHeld = false;
        this.isRightHeld = false;
        this.activeDPadPointerId = null;
        this.resetDPadVisuals();
      }

      if (pointer.id === this.activeJumpPointerId) {
        this.isJumpHeld = false;
        this.isJumpJustReleased = true;
        this.activeJumpPointerId = null;

        // Возврат визуального состояния
        this.btnJumpBg.setScale(1);
        this.btnJumpRing.setScale(1);
        const opacity = SaveProvider.getInstance().getSettings().touchOpacity;
        this.btnJumpBg.setFillStyle(0x1e293b, opacity);
        this.btnJumpIcon.setColor('#38bdf8');
      }
    };

    this.scene.input.on('pointerup', handlePointerRelease);
    this.scene.input.on('pointercancel', handlePointerRelease);
  }

  // Обновление направления D-Pad по текущей позиции пальца
  private updateDPadDirection(pointerX: number): void {
    const diff = pointerX - this.dpadCenterX;
    const deadzone = 12; // Мёртвая зона по центру

    if (diff < -deadzone) {
      this.isLeftHeld = true;
      this.isRightHeld = false;
      this.btnLeftBg.setFillStyle(0x38bdf8, 0.9);
      this.btnLeftBg.setScale(0.95);
      this.btnRightBg.setFillStyle(0x221c38, SaveProvider.getInstance().getSettings().touchOpacity);
      this.btnRightBg.setScale(1);
    } else if (diff > deadzone) {
      this.isLeftHeld = false;
      this.isRightHeld = true;
      this.btnRightBg.setFillStyle(0x38bdf8, 0.9);
      this.btnRightBg.setScale(0.95);
      this.btnLeftBg.setFillStyle(0x221c38, SaveProvider.getInstance().getSettings().touchOpacity);
      this.btnLeftBg.setScale(1);
    } else {
      this.isLeftHeld = false;
      this.isRightHeld = false;
      this.resetDPadVisuals();
    }
  }

  private resetDPadVisuals(): void {
    const opacity = SaveProvider.getInstance().getSettings().touchOpacity;
    this.btnLeftBg.setFillStyle(0x221c38, opacity);
    this.btnLeftBg.setScale(1);
    this.btnRightBg.setFillStyle(0x221c38, opacity);
    this.btnRightBg.setScale(1);
  }

  public updateLayout(mode: OrientationMode, width: number, height: number, safeBottom = 0): void {
    const paddingX = mode === 'portrait' ? 20 : 36;
    const paddingY = mode === 'portrait' ? 28 : 22;

    const bottomY = height - paddingY - safeBottom - 44;

    // 1. Позиция D-Pad (слева снизу)
    this.dpadCenterX = paddingX + 96;
    this.dpadCenterY = bottomY;

    this.dpadBg.setPosition(this.dpadCenterX, this.dpadCenterY);

    const leftBtnX = this.dpadCenterX - 45;
    const rightBtnX = this.dpadCenterX + 45;

    this.btnLeftBg.setPosition(leftBtnX, this.dpadCenterY);
    this.btnLeftText.setPosition(leftBtnX, this.dpadCenterY);

    this.btnRightBg.setPosition(rightBtnX, this.dpadCenterY);
    this.btnRightText.setPosition(rightBtnX, this.dpadCenterY);

    // 2. Позиция Jump (справа снизу)
    const jumpCenterX = width - paddingX - 60;
    const jumpCenterY = bottomY;

    this.jumpHitZone.setPosition(jumpCenterX, jumpCenterY);
    this.btnJumpRing.setPosition(jumpCenterX, jumpCenterY);
    this.btnJumpBg.setPosition(jumpCenterX, jumpCenterY);
    this.btnJumpIcon.setPosition(jumpCenterX, jumpCenterY - 10);
    this.btnJumpLabel.setPosition(jumpCenterX, jumpCenterY + 16);

    // Обновление прозрачности
    const opacity = SaveProvider.getInstance().getSettings().touchOpacity;
    this.dpadBg.setFillStyle(0x120e24, opacity * 0.6);
    this.resetDPadVisuals();
    this.btnJumpBg.setFillStyle(0x1e293b, opacity);
    this.btnJumpRing.setFillStyle(0x0284c7, opacity * 0.2);
  }

  // Сброс зажатых кнопок при респауне котика (ТЗ раздел 24)
  public resetInputOnRespawn(): void {
    this.isLeftHeld = false;
    this.isRightHeld = false;
    this.isJumpHeld = false;
    this.isJumpJustPressed = false;
    this.isJumpJustReleased = false;
    this.activeDPadPointerId = null;
    this.activeJumpPointerId = null;

    this.resetDPadVisuals();
    this.btnJumpBg.setScale(1);
    this.btnJumpRing.setScale(1);
    const opacity = SaveProvider.getInstance().getSettings().touchOpacity;
    this.btnJumpBg.setFillStyle(0x1e293b, opacity);
    this.btnJumpIcon.setColor('#38bdf8');
  }

  public getInput(): {
    left: boolean;
    right: boolean;
    jumpDown: boolean;
    jumpPressed: boolean;
    jumpReleased: boolean;
  } {
    const result = {
      left: this.isLeftHeld,
      right: this.isRightHeld,
      jumpDown: this.isJumpHeld,
      jumpPressed: this.isJumpJustPressed,
      jumpReleased: this.isJumpJustReleased
    };

    // Одиночные триггеры сбрасываются после считывания в кадре
    this.isJumpJustPressed = false;
    this.isJumpJustReleased = false;

    return result;
  }

  public setVisible(visible: boolean): void {
    this.container.setVisible(visible);
  }
}
