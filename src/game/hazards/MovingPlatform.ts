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

  public hasRiderContact = false;

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

  public setRiderContact(contact: boolean): void {
    this.hasRiderContact = contact;
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

    // Проверка физического контакта с платформой
    const catBody = cat.body as Phaser.Physics.Arcade.Body;
    const body = this.body as Phaser.Physics.Arcade.Body;

    const isWithinX = catBody.right > body.left + 2 && catBody.left < body.right - 2;
    const isVerticallyAligned = catBody.bottom >= body.top - 3 && catBody.bottom <= body.top + 6;
    const isGrounded = catBody.touching.down || catBody.blocked.down;

    const isCatRiding = (this.hasRiderContact || (isVerticallyAligned && isGrounded)) && isWithinX;

    if (isCatRiding) {
      cat.x += this.deltaX;
      cat.y += this.deltaY;
    }

    this.hasRiderContact = false;
  }

  public reset(): void {
    this.cancelScheduledEvents();
    this.progress = 0;
    this.isForward = true;
    this.deltaX = 0;
    this.deltaY = 0;
    this.hasRiderContact = false;
    this.setPosition(this.startX, this.startY);
  }
}
