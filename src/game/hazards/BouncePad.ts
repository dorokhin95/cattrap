import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { CONSTANTS } from '../../core/Constants';
import { AudioManager } from '../../audio/AudioManager';
import { Cat } from '../entities/Cat';

export class BouncePad extends HazardBase {
  public id: string;
  private power: number;
  private cooldownMs = 0;
  private initialX: number;
  private initialY: number;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string = '', power: number = CONSTANTS.BOUNCE_IMPULSE) {
    super(scene, x, y, 'bounce_pad');
    this.id = id;
    this.power = power;
    this.initialX = x;
    this.initialY = y;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(28, 12);
    body.setOffset(2, 4);
  }

  public triggerBounce(cat: Cat): boolean {
    if (this.cooldownMs > 0) return false;

    const catBody = cat.body as Phaser.Physics.Arcade.Body;
    const padBody = this.body as Phaser.Physics.Arcade.Body;
    const isCatInverted = cat.getGravityState && cat.getGravityState() === 'inverted';

    if (!isCatInverted) {
      // Обычная гравитация: отскок разрешён только при приземлении сверху
      if (catBody.velocity.y < -20) return false;
      if (catBody.bottom > padBody.bottom + 4) return false;
    } else {
      // Инвертированная гравитация: отскок разрешён только при приземлении снизу вверх
      if (catBody.velocity.y > 20) return false;
      if (catBody.top < padBody.top - 4) return false;
    }

    const impulse = isCatInverted ? -this.power : this.power;

    catBody.setVelocityY(impulse);
    this.cooldownMs = CONSTANTS.BOUNCE_COOLDOWN_MS;

    AudioManager.getInstance().playSFX('bounce');

    // Эффект сжатия пружины (squash & stretch)
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      scaleY: 0.55,
      scaleX: 1.25,
      duration: 65,
      yoyo: true,
      onComplete: () => {
        this.setScale(1, 1);
      }
    });

    return true;
  }

  public updatePad(deltaMs: number): void {
    if (this.cooldownMs > 0) {
      this.cooldownMs = Math.max(0, this.cooldownMs - deltaMs);
    }
  }

  public reset(): void {
    this.cancelScheduledEvents();
    this.scene.tweens.killTweensOf(this);
    this.setScale(1, 1);
    this.cooldownMs = 0;
    this.setPosition(this.initialX, this.initialY);
  }
}
