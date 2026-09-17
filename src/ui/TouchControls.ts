import Phaser from 'phaser';
import { OrientationMode } from '../types';
import { SaveProvider } from '../save/SaveProvider';

export class TouchControls {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;

  private btnLeftBg!: Phaser.GameObjects.Arc;
  private btnLeftText!: Phaser.GameObjects.Text;
  private btnRightBg!: Phaser.GameObjects.Arc;
  private btnRightText!: Phaser.GameObjects.Text;
  private btnJumpBg!: Phaser.GameObjects.Arc;
  private btnJumpText!: Phaser.GameObjects.Text;

  private isLeftHeld = false;
  private isRightHeld = false;
  private isJumpHeld = false;
  private isJumpJustPressed = false;
  private isJumpJustReleased = false;

  private activeLeftPointerId: number | null = null;
  private activeRightPointerId: number | null = null;
  private activeJumpPointerId: number | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.createButtons();
    this.setupInteractions();
  }

  private createButtons(): void {
    const radius = 38; // Диаметр 76px (в диапазоне 72-84px по ТЗ)
    const settings = SaveProvider.getInstance().getSettings();
    const opacity = settings.touchOpacity;

    // Кнопка влево
    this.btnLeftBg = this.scene.add.circle(0, 0, radius, 0x000000, opacity);
    this.btnLeftBg.setStrokeStyle(2, 0xffffff, opacity * 0.8);
    this.btnLeftText = this.scene.add.text(0, 0, '◀', {
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Кнопка вправо
    this.btnRightBg = this.scene.add.circle(0, 0, radius, 0x000000, opacity);
    this.btnRightBg.setStrokeStyle(2, 0xffffff, opacity * 0.8);
    this.btnRightText = this.scene.add.text(0, 0, '▶', {
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Кнопка прыжка
    this.btnJumpBg = this.scene.add.circle(0, 0, radius + 4, 0x000000, opacity);
    this.btnJumpBg.setStrokeStyle(2, 0x38bdf8, opacity * 0.8);
    this.btnJumpText = this.scene.add.text(0, 0, 'JUMP', {
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#38bdf8'
    }).setOrigin(0.5);

    this.container.add([
      this.btnLeftBg, this.btnLeftText,
      this.btnRightBg, this.btnRightText,
      this.btnJumpBg, this.btnJumpText
    ]);
  }

  private setupInteractions(): void {
    // Включение интерактивности с увеличенной touch-зоной
    const hitRadius = 46;

    this.btnLeftBg.setInteractive(
      new Phaser.Geom.Circle(0, 0, hitRadius),
      Phaser.Geom.Circle.Contains
    );
    this.btnRightBg.setInteractive(
      new Phaser.Geom.Circle(0, 0, hitRadius),
      Phaser.Geom.Circle.Contains
    );
    this.btnJumpBg.setInteractive(
      new Phaser.Geom.Circle(0, 0, hitRadius + 4),
      Phaser.Geom.Circle.Contains
    );

    // Левая стрелка
    this.btnLeftBg.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.isLeftHeld = true;
      this.activeLeftPointerId = pointer.id;
      this.btnLeftBg.setScale(0.92);
    });

    // Правая стрелка
    this.btnRightBg.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.isRightHeld = true;
      this.activeRightPointerId = pointer.id;
      this.btnRightBg.setScale(0.92);
    });

    // Прыжок
    this.btnJumpBg.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.isJumpHeld = true;
      this.isJumpJustPressed = true;
      this.activeJumpPointerId = pointer.id;
      this.btnJumpBg.setScale(0.92);
    });

    // Глобальные отпускания указателей
    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (pointer.id === this.activeLeftPointerId) {
        this.isLeftHeld = false;
        this.activeLeftPointerId = null;
        this.btnLeftBg.setScale(1);
      }
      if (pointer.id === this.activeRightPointerId) {
        this.isRightHeld = false;
        this.activeRightPointerId = null;
        this.btnRightBg.setScale(1);
      }
      if (pointer.id === this.activeJumpPointerId) {
        this.isJumpHeld = false;
        this.isJumpJustReleased = true;
        this.activeJumpPointerId = null;
        this.btnJumpBg.setScale(1);
      }
    });
  }

  public updateLayout(mode: OrientationMode, width: number, height: number, safeBottom = 0): void {
    const padding = 24;
    const btnRadius = 38;
    const bottomY = height - btnRadius - padding - safeBottom;

    if (mode === 'portrait') {
      // Портретное расположение: низ экрана, стрелки слева, прыжок справа
      const leftX1 = padding + btnRadius;
      const leftX2 = leftX1 + btnRadius * 2 + 16;
      const jumpX = width - padding - btnRadius;

      this.btnLeftBg.setPosition(leftX1, bottomY);
      this.btnLeftText.setPosition(leftX1, bottomY);

      this.btnRightBg.setPosition(leftX2, bottomY);
      this.btnRightText.setPosition(leftX2, bottomY);

      this.btnJumpBg.setPosition(jumpX, bottomY);
      this.btnJumpText.setPosition(jumpX, bottomY);
    } else {
      // Ландшафтное расположение: углы экрана
      const leftX1 = padding + btnRadius + 12;
      const leftX2 = leftX1 + btnRadius * 2 + 18;
      const jumpX = width - padding - btnRadius - 12;

      this.btnLeftBg.setPosition(leftX1, bottomY);
      this.btnLeftText.setPosition(leftX1, bottomY);

      this.btnRightBg.setPosition(leftX2, bottomY);
      this.btnRightText.setPosition(leftX2, bottomY);

      this.btnJumpBg.setPosition(jumpX, bottomY);
      this.btnJumpText.setPosition(jumpX, bottomY);
    }

    // Обновляем прозрачность из настроек
    const opacity = SaveProvider.getInstance().getSettings().touchOpacity;
    this.btnLeftBg.setFillStyle(0x000000, opacity);
    this.btnRightBg.setFillStyle(0x000000, opacity);
    this.btnJumpBg.setFillStyle(0x000000, opacity);
  }

  // Сброс зажатых кнопок при респауне котика (ТЗ раздел 24)
  public resetInputOnRespawn(): void {
    this.isLeftHeld = false;
    this.isRightHeld = false;
    this.isJumpHeld = false;
    this.isJumpJustPressed = false;
    this.isJumpJustReleased = false;
    this.activeLeftPointerId = null;
    this.activeRightPointerId = null;
    this.activeJumpPointerId = null;
    this.btnLeftBg.setScale(1);
    this.btnRightBg.setScale(1);
    this.btnJumpBg.setScale(1);
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
