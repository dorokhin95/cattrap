import Phaser from 'phaser';
import { AudioManager } from '../../audio/AudioManager';

export class Checkpoint extends Phaser.Physics.Arcade.Sprite {
  private isActivated = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'checkpoint_box');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(28, 24);
    body.setOffset(2, 8);
  }

  public activate(): boolean {
    if (this.isActivated) return false;
    this.isActivated = true;

    AudioManager.getInstance().playSFX('checkpoint');

    // Анимация подпрыгивания коробки
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.2,
      scaleY: 0.8,
      duration: 100,
      yoyo: true,
      repeat: 1
    });

    // Вылет звездочек
    for (let i = 0; i < 6; i++) {
      const star = this.scene.add.image(this.x, this.y - 10, 'particle_star');
      const angle = (i / 6) * Math.PI * 2;
      const speed = 40;
      this.scene.tweens.add({
        targets: star,
        x: star.x + Math.cos(angle) * speed,
        y: star.y + Math.sin(angle) * speed,
        alpha: 0,
        scale: { from: 1, to: 1.4 },
        duration: 400,
        onComplete: () => star.destroy()
      });
    }

    return true;
  }

  public getIsActivated(): boolean {
    return this.isActivated;
  }

  public reset(): void {
    // Чекпоинт сохраняет активацию до перезагрузки уровня
  }
}
