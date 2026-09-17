import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { CONSTANTS } from '../../core/Constants';
import { AudioManager } from '../../audio/AudioManager';

export type CrusherOrientation = 'down' | 'left' | 'right';

export class Crusher extends HazardBase {
  public id: string;
  public orientation: CrusherOrientation;
  public isLethal = false;

  private startX: number;
  private startY: number;
  private targetX: number;
  private targetY: number;

  private warningMs: number;
  private slamMs: number;
  private holdMs: number;
  private retractMs: number;
  private cycle: boolean;
  private autoStart: boolean;
  private startDelayMs: number;
  private isCrushing = false;

  constructor(
    scene: Phaser.Scene,
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
    orientation: CrusherOrientation = 'down',
    id: string = '',
    warningMs: number = CONSTANTS.CRUSHER_WARNING_MS,
    slamMs: number = CONSTANTS.CRUSHER_SLAM_MS,
    holdMs: number = CONSTANTS.CRUSHER_HOLD_MS,
    retractMs: number = CONSTANTS.CRUSHER_RETRACT_MS,
    cycle: boolean = true,
    startDelayMs: number = 300,
    autoStart: boolean = true
  ) {
    super(scene, startX, startY, 'crusher');
    this.id = id;
    this.orientation = orientation;
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.targetY = targetY;

    this.warningMs = warningMs ?? CONSTANTS.CRUSHER_WARNING_MS;
    this.slamMs = slamMs ?? CONSTANTS.CRUSHER_SLAM_MS;
    this.holdMs = holdMs ?? CONSTANTS.CRUSHER_HOLD_MS;
    this.retractMs = retractMs ?? CONSTANTS.CRUSHER_RETRACT_MS;
    this.cycle = cycle ?? true;
    this.startDelayMs = startDelayMs ?? 300;
    this.autoStart = autoStart ?? true;

    if (orientation === 'left') {
      this.setAngle(90);
    } else if (orientation === 'right') {
      this.setAngle(-90);
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(30, 30);

    // Если autoStart отключен — ловушка скрыта до момента активации триггером
    if (!this.autoStart) {
      this.setVisible(false);
    } else if (this.cycle) {
      this.isCrushing = true;
      this.schedule(this.startDelayMs, () => this.startWarning());
    }
  }

  public triggerCrush(): void {
    if (this.isCrushing) return;
    this.isCrushing = true;
    this.setVisible(true);
    this.startWarning();
  }

  private startWarning(): void {
    this.isLethal = false;
    AudioManager.getInstance().playSFX('crusherWarning');

    // Тряска перед ударом
    const isHorizontal = this.orientation === 'left' || this.orientation === 'right';
    const shakeProp = isHorizontal ? 'y' : 'x';
    const originalVal = isHorizontal ? this.startY : this.startX;

    this.scene.tweens.add({
      targets: this,
      [shakeProp]: { from: originalVal - 2, to: originalVal + 2 },
      duration: 40,
      repeat: Math.floor(this.warningMs / 80),
      yoyo: true,
      onComplete: () => {
        this.setPosition(this.startX, this.startY);
      }
    });

    this.schedule(this.warningMs, () => this.startSlam());
  }

  private startSlam(): void {
    this.isLethal = true;
    AudioManager.getInstance().playSFX('crusherSlam');

    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      x: this.targetX,
      y: this.targetY,
      duration: this.slamMs,
      ease: 'Quad.easeIn',
      onComplete: () => {
        this.setPosition(this.targetX, this.targetY);
        this.startHold();
      }
    });
  }

  private startHold(): void {
    this.isLethal = true;
    this.schedule(this.holdMs, () => this.startRetract());
  }

  private startRetract(): void {
    this.isLethal = false;

    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      x: this.startX,
      y: this.startY,
      duration: this.retractMs,
      ease: 'Linear',
      onComplete: () => {
        this.setPosition(this.startX, this.startY);
        this.isCrushing = false;
        if (this.cycle) {
          this.isCrushing = true;
          this.schedule(450, () => this.startWarning());
        }
      }
    });
  }

  public reset(): void {
    this.cancelScheduledEvents();
    this.scene.tweens.killTweensOf(this);
    this.isLethal = false;
    this.isCrushing = false;
    this.setPosition(this.startX, this.startY);

    if (!this.autoStart) {
      this.setVisible(false);
    } else if (this.cycle) {
      this.setVisible(true);
      this.isCrushing = true;
      this.schedule(this.startDelayMs, () => this.startWarning());
    }
  }
}
