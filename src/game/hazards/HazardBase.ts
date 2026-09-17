import Phaser from 'phaser';

export abstract class HazardBase extends Phaser.Physics.Arcade.Sprite {
  protected isTriggered = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  public abstract reset(): void;
}
