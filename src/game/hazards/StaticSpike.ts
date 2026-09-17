import Phaser from 'phaser';
import { HazardBase } from './HazardBase';

export class StaticSpike extends HazardBase {
  private isUpsideDown: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, isUpsideDown = false) {
    super(scene, x, y, isUpsideDown ? 'spike_upside' : 'spike_static');
    this.isUpsideDown = isUpsideDown;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);

    // Честный lethal collider: 65-70% от визуального размера
    if (this.isUpsideDown) {
      body.setSize(20, 14);
      body.setOffset(6, 2);
    } else {
      body.setSize(20, 14);
      body.setOffset(6, 16);
    }
  }

  public reset(): void {
    // Статический шип неизменен
  }
}
