import Phaser from 'phaser';
import { Cat } from '../entities/Cat';

export class TimeZone extends Phaser.GameObjects.Sprite {
  public id: string;
  public timeScale: number;
  public bounds: Phaser.Geom.Rectangle;

  private zoneWidth: number;
  private zoneHeight: number;
  private initialX: number;
  private initialY: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    timeScale = 0.45,
    id: string = ''
  ) {
    super(scene, x, y, 'time_zone_slow');
    this.id = id;
    this.timeScale = timeScale;
    this.zoneWidth = width;
    this.zoneHeight = height;
    this.initialX = x;
    this.initialY = y;

    this.setDisplaySize(width, height);
    this.setDepth(2);
    this.setAlpha(0.35);

    scene.add.existing(this);

    this.bounds = new Phaser.Geom.Rectangle(
      x - width / 2,
      y - height / 2,
      width,
      height
    );

    // Мягкая анимация хроно-поля
    scene.tweens.add({
      targets: this,
      alpha: { from: 0.2, to: 0.4 },
      duration: 1500,
      yoyo: true,
      repeat: -1
    });
  }

  public checkOverlap(cat: Cat): boolean {
    return this.bounds.contains(cat.x, cat.y);
  }

  public reset(): void {
    this.setPosition(this.initialX, this.initialY);
  }
}
