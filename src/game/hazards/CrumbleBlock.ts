import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { CONSTANTS } from '../../core/Constants';
import { AudioManager } from '../../audio/AudioManager';

export class CrumbleBlock extends HazardBase {
  private initialX: number;
  private initialY: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'tile_crumble');
    this.initialX = x;
    this.initialY = y;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
  }

  public triggerCollapse(): void {
    if (this.isTriggered) return;
    this.isTriggered = true;

    AudioManager.getInstance().playSFX('crumble');

    // 0-150 мс: появление видимости трещины
    // 150-450 мс: дрожание
    this.schedule(CONSTANTS.CRUMBLE_SHAKE_DELAY_MS, () => {
      this.scene.tweens.add({
        targets: this,
        x: { from: this.initialX - 2, to: this.initialX + 2 },
        duration: 40,
        yoyo: true,
        repeat: 6
      });
    });

    // 450 мс: падение плиты
    this.schedule(CONSTANTS.CRUMBLE_FALL_DELAY_MS, () => {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setImmovable(false);
      body.setAllowGravity(true);
      body.setVelocityY(280);

      // Плавное растворение в падении
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 400,
        onComplete: () => {
          body.enable = false;
        }
      });
    });
  }

  public reset(): void {
    this.isTriggered = false;
    this.cancelScheduledEvents();
    this.scene.tweens.killTweensOf(this);
    this.setPosition(this.initialX, this.initialY);
    this.setAlpha(1);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.enable = true;
  }
}
