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

  /**
   * Проверяет, стоит ли котик непосредственно на верхней поверхности данного тайла конвейера.
   */
  public isCatStandingOn(cat: Cat): boolean {
    const catBody = cat.body as Phaser.Physics.Arcade.Body;
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!catBody || !body) return false;

    const isGround = catBody.touching.down || catBody.blocked.down;
    if (!isGround) return false;

    // Подошва котика на уровне верхней границы конвейера
    const isAboveTop = catBody.bottom >= body.top - 3 && catBody.bottom <= body.top + 6;
    // Горизонтальный охват тайла
    const isWithinX = catBody.right > body.left + 2 && catBody.left < body.right - 2;

    return isAboveTop && isWithinX;
  }

  public getConveyorVelocity(): number {
    return (this.direction === 'right' ? 1 : -1) * this.speed;
  }

  /**
   * Интеграция скорости конвейера в физику котика без телепортации cat.x +=
   */
  public applyConveyorMotion(cat: Cat, _deltaMs: number): void {
    if (this.isCatStandingOn(cat)) {
      cat.setSurfaceVelocityX(this.getConveyorVelocity());
    }
  }

  public reset(): void {
    this.cancelScheduledEvents();
    this.setPosition(this.initialX, this.initialY);
  }
}
