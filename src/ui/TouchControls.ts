import Phaser from 'phaser';
import { OrientationMode } from '../types';
import { SaveProvider } from '../save/SaveProvider';
import { PlatformManager } from '../platform/PlatformManager';

export class TouchControls {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;

  // Визуальные элементы D-Pad
  private dpadBg!: Phaser.GameObjects.Rectangle;
  private btnLeftBg!: Phaser.GameObjects.Rectangle;
  private btnLeftText!: Phaser.GameObjects.Text;
  private btnRightBg!: Phaser.GameObjects.Rectangle;
  private btnRightText!: Phaser.GameObjects.Text;

  // Визуальные элементы кнопки прыжка
  private btnJumpRing!: Phaser.GameObjects.Arc;
  private btnJumpBg!: Phaser.GameObjects.Arc;
  private btnJumpIcon!: Phaser.GameObjects.Text;
  private btnJumpLabel!: Phaser.GameObjects.Text;

  // Размеры экрана и зоны исключения
  private screenWidth = 0;
  private screenHeight = 0;
  private topExclusionZone = 70; // Зона HUD сверху

  // Центр D-Pad для расчёта направления
  private dpadCenterX = 0;
  private dpadCenterY = 0;

  // Текущее состояние ввода
  private isLeftHeld = false;
  private isRightHeld = false;
  private isJumpHeld = false;
  private isJumpJustPressed = false;
  private isJumpJustReleased = false;

  // Мультитач указатели
  private activeDPadPointerId: number | null = null;
  private activeJumpPointerId: number | null = null;

  // Флаг активности контроллеров (блокируется при открытых окнах паузы/настроек)
  private isEnabled = true;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.createVisuals();
    this.setupGlobalPointerListeners();
  }

  private createVisuals(): void {
    const settings = SaveProvider.getInstance().getSettings();
    const opacity = settings.touchOpacity;

    // --- 1. D-PAD ВИЗУАЛ (ВЛЕВО / ВПРАВО) ---
    // Капсульная подложка D-Pad (190×86 px)
    this.dpadBg = this.scene.add.rectangle(0, 0, 190, 86, 0x120e24, opacity * 0.7);
    this.dpadBg.setStrokeStyle(2, 0x474261, opacity * 0.8);

    // Левая клавиша (88×76 px)
    this.btnLeftBg = this.scene.add.rectangle(0, 0, 88, 76, 0x221c38, opacity);
    this.btnLeftBg.setStrokeStyle(2, 0x64748b, opacity);
    this.btnLeftText = this.scene.add.text(0, 0, '◀', {
      fontSize: '34px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Правая клавиша (88×76 px)
    this.btnRightBg = this.scene.add.rectangle(0, 0, 88, 76, 0x221c38, opacity);
    this.btnRightBg.setStrokeStyle(2, 0x64748b, opacity);
    this.btnRightText = this.scene.add.text(0, 0, '▶', {
      fontSize: '34px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // --- 2. КНОПКА ПРЫЖКА (JUMP) ---
    // Внешнее светящееся кольцо (диаметр 108px)
    this.btnJumpRing = this.scene.add.circle(0, 0, 54, 0x0284c7, opacity * 0.25);
    this.btnJumpRing.setStrokeStyle(3, 0x38bdf8, opacity * 0.9);

    // Основной диск кнопки прыжка (диаметр 94px)
    this.btnJumpBg = this.scene.add.circle(0, 0, 47, 0x1e293b, opacity);

    // Стрелка вверх
    this.btnJumpIcon = this.scene.add.text(0, -10, '▲', {
      fontSize: '30px',
      fontStyle: 'bold',
      color: '#38bdf8'
    }).setOrigin(0.5);

    // Подпись JUMP
    this.btnJumpLabel = this.scene.add.text(0, 16, 'JUMP', {
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.container.add([
      this.dpadBg,
      this.btnLeftBg, this.btnLeftText,
      this.btnRightBg, this.btnRightText,
      this.btnJumpRing, this.btnJumpBg,
      this.btnJumpIcon, this.btnJumpLabel
    ]);
  }

  private setupGlobalPointerListeners(): void {
    // Полноэкранный двухзонный ввод (Dual-Zone Touch):
    // Вся левая половина экрана — бег и скольжение (D-Pad).
    // Вся правая половина экрана — 100% безотказный прыжок (Jump).
    this.scene.input.on('pointerdown', this.onPointerDown, this);
    this.scene.input.on('pointermove', this.onPointerMove, this);
    this.scene.input.on('pointerup', this.onPointerUp, this);
    this.scene.input.on('pointercancel', this.onPointerUp, this);
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (!this.isEnabled) return;

    // Исключаем верхнюю зону экрана (где расположена пауза и HUD)
    if (pointer.y < this.topExclusionZone) return;

    const midX = this.screenWidth * 0.5;

    if (pointer.x < midX) {
      // 1. Касание в левой половине экрана -> D-Pad
      // Если зона уже занята активным указателем, игнорируем второй палец (защита от "залипания")
      if (this.activeDPadPointerId !== null && this.activeDPadPointerId !== pointer.id) return;
      this.activeDPadPointerId = pointer.id;
      this.updateDPadDirection(pointer.x);
    } else {
      // 2. Касание в правой половине экрана -> Прыжок
      // Если кнопка прыжка уже удерживается пальцем, игнорируем второй палец
      if (this.activeJumpPointerId !== null && this.activeJumpPointerId !== pointer.id) return;
      this.activeJumpPointerId = pointer.id;
      this.triggerJumpPress();
    }
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isEnabled) return;

    // Непрерывное отслеживание скольжения пальца по левой половине
    if (pointer.id === this.activeDPadPointerId) {
      this.updateDPadDirection(pointer.x);
    }
  }

  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.id === this.activeDPadPointerId) {
      this.isLeftHeld = false;
      this.isRightHeld = false;
      this.activeDPadPointerId = null;
      this.resetDPadVisuals();
    }

    if (pointer.id === this.activeJumpPointerId) {
      this.triggerJumpRelease();
      this.activeJumpPointerId = null;
    }
  }

  private updateDPadDirection(pointerX: number): void {
    const diff = pointerX - this.dpadCenterX;
    const deadzone = 10; // Мёртвая зона по центру

    if (diff < -deadzone) {
      // Движение влево
      this.isLeftHeld = true;
      this.isRightHeld = false;
      this.btnLeftBg.setFillStyle(0x38bdf8, 0.95);
      this.btnLeftBg.setScale(0.94);
      this.btnRightBg.setFillStyle(0x221c38, SaveProvider.getInstance().getSettings().touchOpacity);
      this.btnRightBg.setScale(1);
    } else if (diff > deadzone) {
      // Движение вправо
      this.isLeftHeld = false;
      this.isRightHeld = true;
      this.btnRightBg.setFillStyle(0x38bdf8, 0.95);
      this.btnRightBg.setScale(0.94);
      this.btnLeftBg.setFillStyle(0x221c38, SaveProvider.getInstance().getSettings().touchOpacity);
      this.btnLeftBg.setScale(1);
    } else {
      // Остановка по центру
      this.isLeftHeld = false;
      this.isRightHeld = false;
      this.resetDPadVisuals();
    }
  }

  private triggerJumpPress(): void {
    this.isJumpHeld = true;
    this.isJumpJustPressed = true;

    // Мгновенный сочный визуальный отклик кнопки прыжка
    this.btnJumpBg.setScale(0.90);
    this.btnJumpRing.setScale(0.93);
    this.btnJumpBg.setFillStyle(0x0284c7, 1);
    this.btnJumpIcon.setColor('#ffffff');

    PlatformManager.getInstance().haptic('light');
  }

  private triggerJumpRelease(): void {
    this.isJumpHeld = false;
    this.isJumpJustReleased = true;

    // Возврат в исходное состояние
    this.btnJumpBg.setScale(1);
    this.btnJumpRing.setScale(1);
    const opacity = SaveProvider.getInstance().getSettings().touchOpacity;
    this.btnJumpBg.setFillStyle(0x1e293b, opacity);
    this.btnJumpIcon.setColor('#38bdf8');
  }

  private resetDPadVisuals(): void {
    const opacity = SaveProvider.getInstance().getSettings().touchOpacity;
    this.btnLeftBg.setFillStyle(0x221c38, opacity);
    this.btnLeftBg.setScale(1);
    this.btnRightBg.setFillStyle(0x221c38, opacity);
    this.btnRightBg.setScale(1);
  }

  public updateLayout(mode: OrientationMode, width: number, height: number, safeBottom = 0, safeTop = 0): void {
    this.screenWidth = width;
    this.screenHeight = height;
    this.topExclusionZone = Math.max(68, safeTop + 54);

    const paddingX = mode === 'portrait' ? 22 : 44;
    const paddingY = mode === 'portrait' ? 26 : 22;

    const bottomY = height - paddingY - safeBottom - 45;

    // 1. Позиция D-Pad (слева снизу)
    this.dpadCenterX = paddingX + 95;
    this.dpadCenterY = bottomY;

    this.dpadBg.setPosition(this.dpadCenterX, this.dpadCenterY);

    const leftBtnX = this.dpadCenterX - 47;
    const rightBtnX = this.dpadCenterX + 47;

    this.btnLeftBg.setPosition(leftBtnX, this.dpadCenterY);
    this.btnLeftText.setPosition(leftBtnX, this.dpadCenterY);

    this.btnRightBg.setPosition(rightBtnX, this.dpadCenterY);
    this.btnRightText.setPosition(rightBtnX, this.dpadCenterY);

    // 2. Позиция Jump (справа снизу)
    const jumpCenterX = width - paddingX - 60;
    const jumpCenterY = bottomY;

    this.btnJumpRing.setPosition(jumpCenterX, jumpCenterY);
    this.btnJumpBg.setPosition(jumpCenterX, jumpCenterY);
    this.btnJumpIcon.setPosition(jumpCenterX, jumpCenterY - 10);
    this.btnJumpLabel.setPosition(jumpCenterX, jumpCenterY + 16);

    // Обновление прозрачности
    const opacity = SaveProvider.getInstance().getSettings().touchOpacity;
    this.dpadBg.setFillStyle(0x120e24, opacity * 0.7);
    this.resetDPadVisuals();
    this.btnJumpBg.setFillStyle(0x1e293b, opacity);
    this.btnJumpRing.setFillStyle(0x0284c7, opacity * 0.25);
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.resetInputOnRespawn();
    }
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
