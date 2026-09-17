import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { CONSTANTS } from '../../core/Constants';
import { AudioManager } from '../../audio/AudioManager';

export class FakeFloor extends HazardBase {
  private initialX: number;
  private initialY: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'tile_fake');
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

    // 180 мс задержка -> легкое опускание
    this.scene.time.delayedCall(CONSTANTS.FAKE_FLOOR_DROP_DELAY_MS, () => {
      this.scene.tweens.add({
        targets: this,
        y: this.initialY + 6,
        duration: 100,
        ease: 'Linear'
      });
    });

    // 350 мс -> падение в бездну
    this.scene.time.delayedCall(CONSTANTS.FAKE_FLOOR_VANISH_MS, () => {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setImmovable(false);
      body.setAllowGravity(true);
      body.setVelocityY(320);

      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          body.enable = false;
        }
      });
    });
  }

  public reset(): void {
    this.isTriggered = false;
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
