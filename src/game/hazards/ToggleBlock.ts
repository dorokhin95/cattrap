import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { AudioManager } from '../../audio/AudioManager';
import { Cat } from '../entities/Cat';

export class ToggleBlock extends HazardBase {
  public id: string;
  private initiallyActive: boolean;
  public isActiveState: boolean;
  private initialX: number;
  private initialY: number;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string = '', initiallyActive = true) {
    const texture = initiallyActive ? 'toggle_block' : 'toggle_block_inactive';
    super(scene, x, y, texture);
    this.id = id;
    this.initiallyActive = initiallyActive;
    this.isActiveState = initiallyActive;
    this.initialX = x;
    this.initialY = y;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(32, 32);

    if (!initiallyActive) {
      body.enable = false;
      this.setAlpha(0.35);
    }
  }

  public setBlockActive(active: boolean, cat?: Cat): void {
    if (this.isActiveState === active) return;

    if (active) {
      // Безопасная проверка материализации: если котик пересекает блок, ждём пока выйдет
      if (cat && cat.body) {
        const catBody = cat.body as Phaser.Physics.Arcade.Body;
        const catRect = new Phaser.Geom.Rectangle(catBody.x - 2, catBody.y - 2, catBody.width + 4, catBody.height + 4);
        const blockRect = new Phaser.Geom.Rectangle(this.x - 16, this.y - 16, 32, 32);

        if (Phaser.Geom.Intersects.RectangleToRectangle(catRect, blockRect)) {
          // Откладываем появление на 100 мс
          this.schedule(100, () => this.setBlockActive(true, cat));
          return;
        }
      }

      this.isActiveState = true;
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.enable = true;
      this.setTexture('toggle_block');
      this.setAlpha(1);

      this.scene.tweens.killTweensOf(this);
      this.setScale(0.8, 0.8);
      this.scene.tweens.add({
        targets: this,
        scaleX: 1,
        scaleY: 1,
        duration: 120
      });
    } else {
      this.isActiveState = false;
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.enable = false;

      AudioManager.getInstance().playSFX('toggleDissolve');

      // Анимация растворения
      this.scene.tweens.killTweensOf(this);
      this.scene.tweens.add({
        targets: this,
        alpha: 0.35,
        duration: 140,
        onComplete: () => {
          this.setTexture('toggle_block_inactive');
        }
      });
    }
  }

  public toggle(cat?: Cat): void {
    this.setBlockActive(!this.isActiveState, cat);
  }

  public reset(): void {
    this.cancelScheduledEvents();
    this.scene.tweens.killTweensOf(this);
    this.isActiveState = this.initiallyActive;
    this.setPosition(this.initialX, this.initialY);
    this.setScale(1, 1);

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (this.initiallyActive) {
      body.enable = true;
      this.setTexture('toggle_block');
      this.setAlpha(1);
    } else {
      body.enable = false;
      this.setTexture('toggle_block_inactive');
      this.setAlpha(0.35);
    }
  }
}
