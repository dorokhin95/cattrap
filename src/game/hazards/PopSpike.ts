import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { CONSTANTS } from '../../core/Constants';
import { AudioManager } from '../../audio/AudioManager';

export class PopSpike extends HazardBase {
  private initialY: number;
  private spikeSprite: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // В скрытом состоянии основание выглядит как монолитная плита пола со щелью
    super(scene, x, y, 'pop_spike_floor');
    this.initialY = y;
    this.setDepth(2); // Плита пола находится поверх выезжающего шипа, пока он внутри

    const baseBody = this.body as Phaser.Physics.Arcade.Body;
    baseBody.setAllowGravity(false);
    baseBody.setImmovable(true);

    // Дополнительный выезжающий шип
    this.spikeSprite = scene.physics.add.sprite(x, y, 'spike_static');
    this.spikeSprite.setDepth(1); // Шип скрыт под плитой, пока не выйдет наружу
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
    this.spikeSprite.setY(this.initialY); // Начинает внутри плиты пола

    AudioManager.getInstance().playSFX('spike');

    // Подъём НАВЕРХ из пола за ~120 мс (выходит наружу на клетку выше пола)
    const targetY = this.initialY - CONSTANTS.TILE_SIZE;
    this.scene.tweens.add({
      targets: this.spikeSprite,
      y: targetY,
      duration: CONSTANTS.POP_SPIKE_RISE_TIME_MS,
      ease: 'Power2',
      onStart: () => {
        (this.spikeSprite.body as Phaser.Physics.Arcade.Body).enable = true;
      }
    });
  }

  public reset(): void {
    this.isTriggered = false;
    this.scene.tweens.killTweensOf(this.spikeSprite);
    this.spikeSprite.setVisible(false);
    this.spikeSprite.setY(this.initialY);
    (this.spikeSprite.body as Phaser.Physics.Arcade.Body).enable = false;
  }
}
