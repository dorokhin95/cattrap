import Phaser from 'phaser';
import { AudioManager } from '../../audio/AudioManager';
import { Cat } from '../entities/Cat';

export class WarpGate {
  public id: string;
  public entryX: number;
  public entryY: number;
  public exitX: number;
  public exitY: number;

  private entrySprite: Phaser.GameObjects.Sprite;
  private exitSprite: Phaser.GameObjects.Sprite;
  private exitImpulseX: number;
  private exitImpulseY: number;
  private cooldownTimerMs = 0;

  constructor(
    scene: Phaser.Scene,
    entryX: number,
    entryY: number,
    exitX: number,
    exitY: number,
    id: string = '',
    exitImpulseX = 0,
    exitImpulseY = 0
  ) {
    this.id = id;
    this.entryX = entryX;
    this.entryY = entryY;
    this.exitX = exitX;
    this.exitY = exitY;
    this.exitImpulseX = exitImpulseX;
    this.exitImpulseY = exitImpulseY;

    this.entrySprite = scene.add.sprite(entryX, entryY, 'warp_gate_in').setDepth(5);
    this.exitSprite = scene.add.sprite(exitX, exitY, 'warp_gate_out').setDepth(5);

    // Вращение колец червоточин
    scene.tweens.add({
      targets: this.entrySprite,
      angle: 360,
      duration: 3000,
      repeat: -1
    });

    scene.tweens.add({
      targets: this.exitSprite,
      angle: -360,
      duration: 3000,
      repeat: -1
    });
  }

  public updateGate(deltaMs: number): void {
    if (this.cooldownTimerMs > 0) {
      this.cooldownTimerMs = Math.max(0, this.cooldownTimerMs - deltaMs);
    }
  }

  public checkOverlap(cat: Cat): boolean {
    if (this.cooldownTimerMs > 0) return false;

    // Дистанция входа в портал ~18px
    const dx = Math.abs(cat.x - this.entryX);
    const dy = Math.abs(cat.y - this.entryY);
    if (dx <= 18 && dy <= 22) {
      this.teleportCat(cat);
      return true;
    }
    return false;
  }

  private teleportCat(cat: Cat): void {
    this.cooldownTimerMs = 400; // Кулдаун для предотвращения зацикливания
    AudioManager.getInstance().playSFX('warpGate');

    // Перенос котика на точку выхода
    cat.setPosition(this.exitX, this.exitY);

    const body = cat.body as Phaser.Physics.Arcade.Body;
    if (body) {
      if (this.exitImpulseX !== 0) {
        body.setVelocityX(this.exitImpulseX);
      }
      if (this.exitImpulseY !== 0) {
        body.setVelocityY(this.exitImpulseY);
      }
    }

    // Эффект вспышки на выходе
    const scene = this.exitSprite.scene;
    const flash = scene.add.circle(this.exitX, this.exitY, 20, 0xec4899, 0.7).setDepth(15);
    scene.tweens.add({
      targets: flash,
      scale: 1.8,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy()
    });
  }

  public reset(): void {
    this.cooldownTimerMs = 0;
  }

  public destroy(): void {
    this.entrySprite.destroy();
    this.exitSprite.destroy();
  }
}
