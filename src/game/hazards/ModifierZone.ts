import Phaser from 'phaser';

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
    body.setImmovable(false);
    body.moves = false;
    this.setDepth(1); // Легкое энергетическое поле

    // Пульсация свечения зоны
    scene.tweens.add({
      targets: this,
      alpha: { from: 0.5, to: 0.95 },
      duration: 600,
      yoyo: true,
      repeat: -1
    });
  }
}
