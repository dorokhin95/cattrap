import Phaser from 'phaser';
import { AudioManager } from '../../audio/AudioManager';
import { Cat } from '../entities/Cat';

interface CatHistoryPoint {
  x: number;
  y: number;
  flipX: boolean;
  timeMs: number;
}

export class EchoCat extends Phaser.GameObjects.Sprite {
  public id: string;
  public isActive = false;
  public isLethal = false;

  private delayMs: number;
  private autoStart: boolean;
  private history: CatHistoryPoint[] = [];
  private totalTimeMs = 0;
  private hasSpawned = false;
  private hasStartedMoving = false;

  constructor(scene: Phaser.Scene, id = 'echo_cat', delayMs = 700, autoStart = true) {
    super(scene, -999, -999, 'echo_cat');
    this.id = id;
    this.delayMs = delayMs;
    this.autoStart = autoStart;

    scene.add.existing(this);
    this.setDepth(12);
    this.setAlpha(0.75);
    this.setVisible(false);

    if (this.autoStart) {
      this.activate();
    }
  }

  public activate(): void {
    this.isActive = true;
  }

  public recordPlayer(cat: Cat, deltaMs: number): void {
    if (!this.isActive) return;

    // Пока игрок стоит на спавне и не начал движение, эхо-кот не начинает отсчёт
    if (!this.hasStartedMoving) {
      const body = cat.body as Phaser.Physics.Arcade.Body;
      const isMoving = body && (Math.abs(body.velocity.x) > 15 || Math.abs(body.velocity.y) > 15);
      if (!isMoving) {
        return;
      }
      this.hasStartedMoving = true;
    }

    this.totalTimeMs += deltaMs;
    this.history.push({
      x: cat.x,
      y: cat.y,
      flipX: cat.flipX,
      timeMs: this.totalTimeMs
    });

    // Ограничиваем буфер истории (не более 3 секунд для предотвращения расхода памяти)
    while (this.history.length > 0 && this.totalTimeMs - this.history[0].timeMs > 3000) {
      this.history.shift();
    }

    // Воспроизведение через delayMs
    if (this.totalTimeMs >= this.delayMs) {
      if (!this.hasSpawned) {
        this.hasSpawned = true;
        this.setVisible(true);
        this.isLethal = true;
        AudioManager.getInstance().playSFX('echoAlert');
      }

      const targetTime = this.totalTimeMs - this.delayMs;
      // Находим ближайшую точку истории
      const point = this.findHistoryPoint(targetTime);
      if (point) {
        this.setPosition(point.x, point.y);
        this.setFlipX(point.flipX);
      }
    }
  }

  private findHistoryPoint(targetTime: number): CatHistoryPoint | null {
    if (this.history.length === 0) return null;
    let closest = this.history[0];
    let minDiff = Math.abs(closest.timeMs - targetTime);

    for (let i = 1; i < this.history.length; i++) {
      const diff = Math.abs(this.history[i].timeMs - targetTime);
      if (diff < minDiff) {
        minDiff = diff;
        closest = this.history[i];
      }
    }
    return closest;
  }

  public checkOverlap(cat: Cat): boolean {
    if (!this.isLethal || !this.visible) return false;

    // Смертельный хитбокс призрака (13x15 px)
    const dx = Math.abs(cat.x - this.x);
    const dy = Math.abs(cat.y - this.y);
    return dx <= 13 && dy <= 16;
  }

  public reset(): void {
    this.history = [];
    this.totalTimeMs = 0;
    this.hasSpawned = false;
    this.hasStartedMoving = false;
    this.isLethal = false;
    this.setVisible(false);
    this.setPosition(-999, -999);

    this.isActive = this.autoStart;
  }
}
