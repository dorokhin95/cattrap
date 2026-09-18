import Phaser from 'phaser';
import { Cat } from '../entities/Cat';

export class ModifierZone extends Phaser.Physics.Arcade.Sprite {
  public readonly modifierType: 'shrink' | 'restore_size' | 'gravity_invert' | 'gravity_normal';

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    modifierType: 'shrink' | 'restore_size' | 'gravity_invert' | 'gravity_normal'
  ) {
    const texture = modifierType.includes('shrink') || modifierType.includes('size') 
      ? 'zone_shrink' 
      : 'zone_gravity';
    super(scene, x, y, texture);
    this.modifierType = modifierType;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.enable = false; // Отключаем от Arcade Physics, чтобы GetOverlapY не выставлял touching.down котику
    }
    this.setDepth(1);

    // Согласно правилу неожиданности ловушек зоны невидимы до пересечения котиком
    this.setVisible(false);
  }

  public checkOverlap(cat: Cat): boolean {
    // Зона 32x32 тайла
    return Math.abs(cat.x - this.x) <= 20 && Math.abs(cat.y - this.y) <= 24;
  }

  public applyModifier(cat: Cat): void {
    if (this.modifierType === 'shrink') {
      if (cat.getSizeState() !== 'small') {
        cat.setSizeModifier('small');
      }
    } else if (this.modifierType === 'restore_size') {
      if (cat.getSizeState() !== 'normal') {
        cat.setSizeModifier('normal');
      }
    } else if (this.modifierType === 'gravity_invert') {
      if (cat.getGravityState() !== 'inverted') {
        cat.setGravityModifier('inverted');
      }
    } else if (this.modifierType === 'gravity_normal') {
      if (cat.getGravityState() !== 'normal') {
        cat.setGravityModifier('normal');
      }
    }
  }
}
