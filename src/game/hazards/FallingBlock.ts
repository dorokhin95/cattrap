import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { CONSTANTS } from '../../core/Constants';
import { AudioManager } from '../../audio/AudioManager';
import { SaveProvider } from '../../save/SaveProvider';

export class FallingBlock extends HazardBase {
  private initialX: number;
  private initialY: number;
  private landingY: number;
  private isLanded = false;

  constructor(scene: Phaser.Scene, x: number, y: number, landingY: number) {
    super(scene, x, y, 'falling_block');
    this.initialX = x;
    this.initialY = y;
    this.landingY = landingY;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(60, 60);
    body.setOffset(2, 2);
  }

  public triggerDrop(): void {
    if (this.isTriggered) return;
    this.isTriggered = true;

    // 0 мс: микродрожь
    this.scene.tweens.add({
      targets: this,
      x: { from: this.initialX - 2, to: this.initialX + 2 },
      duration: 30,
      yoyo: true,
      repeat: 3
    });

    // 100 мс: летит пыль
    this.scene.time.delayedCall(CONSTANTS.FALLING_BLOCK_SHAKE_MS, () => {
      for (let i = 0; i < 5; i++) {
        const dust = this.scene.add.image(
          this.x + Phaser.Math.Between(-24, 24),
          this.y + 32,
          'particle_dust'
        );
        this.scene.tweens.add({
          targets: dust,
          y: dust.y + 20,
          alpha: 0,
          duration: 200,
          onComplete: () => dust.destroy()
        });
      }
    });

    // 220 мс: начало падения вниз
    this.scene.time.delayedCall(CONSTANTS.FALLING_BLOCK_DROP_MS, () => {
      this.scene.tweens.add({
        targets: this,
        y: this.landingY,
        duration: 260,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          this.isLanded = true;
          const body = this.body as Phaser.Physics.Arcade.Body;
          body.setImmovable(true);
          body.setVelocity(0, 0);

          AudioManager.getInstance().playSFX('blockFall');

          // Экранная тряска при падении (ТЗ пункт 25: 2-3px / 100-150ms)
          if (SaveProvider.getInstance().getSettings().screenShake) {
            this.scene.cameras.main.shake(120, 0.005);
          }

          // Клубы пыли при ударе о землю
          for (let i = 0; i < 8; i++) {
            const dust = this.scene.add.image(
              this.x + Phaser.Math.Between(-30, 30),
              this.landingY + 30,
              'particle_dust'
            );
            this.scene.tweens.add({
              targets: dust,
              x: dust.x + Phaser.Math.Between(-20, 20),
              y: dust.y - Phaser.Math.Between(5, 15),
              alpha: 0,
              duration: 250,
              onComplete: () => dust.destroy()
            });
          }
        }
      });
    });
  }

  public getIsLanded(): boolean {
    return this.isLanded;
  }

  public reset(): void {
    this.isTriggered = false;
    this.isLanded = false;
    this.scene.tweens.killTweensOf(this);
    this.setPosition(this.initialX, this.initialY);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.setAllowGravity(false);
    body.setImmovable(true);
  }
}
