import Phaser from 'phaser';
import { AudioManager } from '../../audio/AudioManager';

export interface PortalTarget {
  x: number;
  y: number;
}

export class MovingPortal extends Phaser.Physics.Arcade.Sprite {
  private initialX: number;
  private initialY: number;
  private targets: PortalTarget[] = [];
  private currentTargetIndex = 0;
  private pulseTween: Phaser.Tweens.Tween | null = null;
  private isMoving = false;
  private isTrolling = false;

  constructor(scene: Phaser.Scene, x: number, y: number, targets: PortalTarget[] = []) {
    super(scene, x, y, 'portal');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.initialX = x;
    this.initialY = y;
    this.targets = targets;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(22, 38);
    body.setOffset(5, 5);

    this.startPulse();
  }

  private startPulse(): void {
    this.pulseTween = this.scene.tweens.add({
      targets: this,
      scaleX: { from: 0.95, to: 1.05 },
      scaleY: { from: 1.05, to: 0.95 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  public advanceToNextTarget(onComplete?: () => void): boolean {
    if (this.isMoving || this.currentTargetIndex >= this.targets.length) {
      return false;
    }

    this.isMoving = true;
    const target = this.targets[this.currentTargetIndex];
    this.currentTargetIndex++;

    AudioManager.getInstance().playSFX('portal');

    // Сжатие перед перемещением (ТЗ пункт 29)
    this.scene.tweens.add({
      targets: this,
      scaleX: 0.3,
      scaleY: 1.5,
      duration: 120,
      yoyo: true,
      onYoyo: () => {
        // Перемещение на новую позицию
        this.scene.tweens.add({
          targets: this,
          x: target.x,
          y: target.y,
          duration: 320,
          ease: 'Cubic.easeOut',
          onComplete: () => {
            this.isMoving = false;
            if (onComplete) onComplete();
          }
        });
      }
    });

    return true;
  }

  public triggerTrollSqueeze(): void {
    if (this.isTrolling) return;
    this.isTrolling = true;
    this.scene.tweens.add({
      targets: this,
      scaleX: 0.6,
      scaleY: 1.4,
      duration: 75,
      yoyo: true,
      onComplete: () => {
        this.isTrolling = false;
      }
    });
  }

  public reset(): void {
    this.scene.tweens.killTweensOf(this);
    this.setPosition(this.initialX, this.initialY);
    this.setScale(1);
    this.currentTargetIndex = 0;
    this.isMoving = false;
    this.isTrolling = false;
    this.startPulse();
  }
}
