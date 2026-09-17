import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { CONSTANTS } from '../../core/Constants';
import { AudioManager } from '../../audio/AudioManager';

export class PopSpike extends HazardBase {
  private initialY: number;
  private spikeSprite: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // В скрытом состоянии основание выглядит как пол со щелью
    super(scene, x, y, 'pop_spike_floor');
    this.initialY = y;

    const baseBody = this.body as Phaser.Physics.Arcade.Body;
    baseBody.setAllowGravity(false);
    baseBody.setImmovable(true);

    // Дополнительный выезжающий шип
    this.spikeSprite = scene.physics.add.sprite(x, y, 'spike_static');
    this.spikeSprite.setVisible(false);
    const spikeBody = this.spikeSprite.body as Phaser.Physics.Arcade.Body;
    spikeBody.setAllowGravity(false);
    spikeBody.setImmovable(true);
    spikeBody.setSize(20, 14);
    spikeBody.setOffset(6, 16);
    spikeBody.enable = false;
  }

  public getSpikeColliderSprite(): Phaser.Physics.Arcade.Sprite {
    return this.spikeSprite;
  }

  public pop(): void {
    if (this.isTriggered) return;
    this.isTriggered = true;

    this.spikeSprite.setVisible(true);
    this.spikeSprite.setY(this.initialY + 16); // Начинает снизу

    AudioManager.getInstance().playSFX('spike');

    // Подъём за ~120 мс
    this.scene.tweens.add({
      targets: this.spikeSprite,
      y: this.initialY,
      duration: CONSTANTS.POP_SPIKE_RISE_TIME_MS,
      ease: 'Power2',
      onStart: () => {
        (this.spikeSprite.body as Phaser.Physics.Arcade.Body).enable = true;
      }
    });
  }

  public reset(): void {
    this.isTriggered = false;
    this.spikeSprite.setVisible(false);
    this.spikeSprite.setY(this.initialY);
    (this.spikeSprite.body as Phaser.Physics.Arcade.Body).enable = false;
  }
}
