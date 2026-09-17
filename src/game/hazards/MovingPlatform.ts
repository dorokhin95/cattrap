import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { CONSTANTS } from '../../core/Constants';
import { Cat } from '../entities/Cat';

export class MovingPlatform extends HazardBase {
  public id: string;
  private startX: number;
  private startY: number;
  private targetX: number;
  private targetY: number;
  private speed: number;
  private pingPong: boolean;

  private progress = 0;
  private isForward = true;
  private deltaX = 0;
  private deltaY = 0;

  constructor(
    scene: Phaser.Scene,
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
    id: string = '',
    speed: number = CONSTANTS.MOVING_PLATFORM_SPEED,
    pingPong: boolean = true
  ) {
    super(scene, startX, startY, 'moving_platform');
    this.id = id;
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = speed;
    this.pingPong = pingPong;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(64, 16);
  }

  public updatePlatform(deltaMs: number, cat: Cat): void {
    const totalDist = Phaser.Math.Distance.Between(this.startX, this.startY, this.targetX, this.targetY);
    if (totalDist <= 0.1) return;

    const step = (this.speed * (deltaMs / 1000)) / totalDist;

    if (this.isForward) {
      this.progress += step;
      if (this.progress >= 1) {
        this.progress = 1;
        if (this.pingPong) {
          this.isForward = false;
        }
      }
    } else {
      this.progress -= step;
      if (this.progress <= 0) {
        this.progress = 0;
        this.isForward = true;
      }
    }

    const nextX = Phaser.Math.Linear(this.startX, this.targetX, this.progress);
    const nextY = Phaser.Math.Linear(this.startY, this.targetY, this.progress);

    this.deltaX = nextX - this.x;
    this.deltaY = nextY - this.y;

    this.setPosition(nextX, nextY);

    // Проверка сцепки с котиком (перемещение вместе с платформой)
    const catBody = cat.body as Phaser.Physics.Arcade.Body;
    const isCatRiding = (catBody.touching.down || catBody.blocked.down) &&
      (cat.y <= this.y - 6) &&
      Math.abs(cat.x - this.x) <= 34;

    if (isCatRiding) {
      cat.x += this.deltaX;
      // Если платформа движется вниз, котик должен плавно следовать за ней без отставания
      if (this.deltaY > 0) {
        cat.y += this.deltaY;
      }
    }
  }

  public reset(): void {
    this.cancelScheduledEvents();
    this.progress = 0;
    this.isForward = true;
    this.deltaX = 0;
    this.deltaY = 0;
    this.setPosition(this.startX, this.startY);
  }
}
