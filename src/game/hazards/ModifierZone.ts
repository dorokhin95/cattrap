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
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.moves = false;
    this.setDepth(1);

    // Согласно правилу неожиданности ловушек зоны невидимы до пересечения котиком
    this.setVisible(false);
  }

  public applyModifier(cat: Cat): void {
    if (this.modifierType === 'shrink') {
      if (cat.getSizeState() !== 'small') {
        cat.setSizeModifier('small');
        this.showIndicator(cat.x, cat.y - 28, '↓ МИНИ-КОТ', '#38bdf8');
      }
    } else if (this.modifierType === 'restore_size') {
      if (cat.getSizeState() !== 'normal') {
        cat.setSizeModifier('normal');
        this.showIndicator(cat.x, cat.y - 28, '↑ ОБЫЧНЫЙ РАЗМЕР', '#22c55e');
      }
    } else if (this.modifierType === 'gravity_invert') {
      if (cat.getGravityState() !== 'inverted') {
        cat.setGravityModifier('inverted');
        this.showIndicator(cat.x, cat.y - 28, '⤾ ГРАВИТАЦИЯ НАОБОРОТ', '#a855f7');
      }
    } else if (this.modifierType === 'gravity_normal') {
      if (cat.getGravityState() !== 'normal') {
        cat.setGravityModifier('normal');
        this.showIndicator(cat.x, cat.y - 28, '⤿ ОБЫЧНАЯ ГРАВИТАЦИЯ', '#22c55e');
      }
    }
  }

  private showIndicator(x: number, y: number, text: string, color: string): void {
    const label = this.scene.add.text(x, y, text, {
      fontSize: '13px',
      fontStyle: 'bold',
      color: color,
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: label,
      y: y - 20,
      alpha: 0,
      duration: 700,
      onComplete: () => {
        label.destroy();
      }
    });
  }
}
