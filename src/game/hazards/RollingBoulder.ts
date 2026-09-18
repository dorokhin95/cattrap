import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { Cat } from '../entities/Cat';

export class RollingBoulder extends HazardBase {
  public id: string;
  private startX: number;
  private startY: number;
  private speedX: number;
  private autoStart: boolean;
  private bounceFactor: number;
  private isRolling = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: string,
    speedX = 190,
    autoStart = false,
    bounceFactor = 0.2
  ) {
    super(scene, x, y, 'rolling_boulder');
    this.id = id;
    this.startX = x;
    this.startY = y;
    this.speedX = speedX;
    this.autoStart = autoStart;
    this.bounceFactor = bounceFactor;

    this.setDepth(15);
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      // Круглый честный хитбокс валуна (24px диаметр при спрайте 32px)
      body.setCircle(12, 4, 4);
      body.setBounce(this.bounceFactor);
      body.setCollideWorldBounds(false);
      body.setAllowGravity(false);
      body.setVelocity(0, 0);
    }

    if (this.autoStart) {
      this.release();
    } else {
      this.setVisible(false);
    }
  }

  public release(): void {
    if (this.isRolling) return;
    this.isRolling = true;
    this.setVisible(true);

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setAllowGravity(true);
      body.setVelocityX(this.speedX);
    }
  }

  public updateBoulder(deltaMs: number): void {
    if (!this.isRolling) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      // Вращение спрайта в зависимости от направления и скорости качения
      const rotationSpeed = (body.velocity.x / 16) * (deltaMs / 1000);
      this.rotation += rotationSpeed;

      // Если валун на полу, поддерживаем заданную горизонтальную скорость
      if (body.blocked.down || body.touching.down) {
        if (Math.abs(body.velocity.x) < Math.abs(this.speedX) * 0.8) {
          body.setVelocityX(this.speedX);
        }
      }

      // Отскок от стен: если врезался в стену, отскакивает в противоположную сторону
      if (body.blocked.left) {
        this.speedX = Math.abs(this.speedX);
        body.setVelocityX(this.speedX);
      } else if (body.blocked.right) {
        this.speedX = -Math.abs(this.speedX);
        body.setVelocityX(this.speedX);
      }
    }
  }

  public checkOverlap(cat: Cat): boolean {
    if (!this.isRolling || !this.visible) return false;

    const catBody = cat.body as Phaser.Physics.Arcade.Body;
    const boulderBody = this.body as Phaser.Physics.Arcade.Body;
    if (!catBody || !boulderBody) return false;

    // Честная круговая проверка расстояния между центрами
    const dist = Phaser.Math.Distance.Between(
      cat.x,
      cat.y,
      this.x,
      this.y
    );

    // Радиус валуна (12) + примерный радиус котика (8) = 20 px
    return dist < 21;
  }

  public reset(): void {
    this.cancelScheduledEvents();
    this.isRolling = false;
    this.setPosition(this.startX, this.startY);
    this.rotation = 0;

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setVelocity(0, 0);
      body.setAllowGravity(false);
    }

    if (this.autoStart) {
      this.release();
    } else {
      this.setVisible(false);
    }
  }
}
