import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { CONSTANTS } from '../../core/Constants';
import { Cat } from '../entities/Cat';

export class ConveyorTile extends HazardBase {
  public id: string;
  public direction: 'left' | 'right';
  public speed: number;
  private initialX: number;
  private initialY: number;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string = '', direction: 'left' | 'right' = 'right', speed: number = CONSTANTS.CONVEYOR_SPEED) {
    const texture = direction === 'left' ? 'conveyor_left' : 'conveyor_right';
    super(scene, x, y, texture);
    this.id = id;
    this.direction = direction;
    this.speed = speed;
    this.initialX = x;
    this.initialY = y;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(32, 32);
  }

  public applyConveyorMotion(cat: Cat, deltaMs: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const catBody = cat.body as Phaser.Physics.Arcade.Body;

    // Проверяем, стоит ли котик на поверхности конвейера
    const isCatStandingOnTop = (catBody.touching.down || catBody.blocked.down) && 
      (cat.y <= this.y - 10) && 
      Math.abs(cat.x - this.x) < 22;

    if (isCatStandingOnTop) {
      const dirSign = this.direction === 'right' ? 1 : -1;
      const moveDelta = dirSign * this.speed * (deltaMs / 1000);
      cat.x += moveDelta;
    }
  }

  public reset(): void {
    this.cancelScheduledEvents();
    this.setPosition(this.initialX, this.initialY);
  }
}
