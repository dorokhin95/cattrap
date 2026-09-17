import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { AudioManager } from '../../audio/AudioManager';

export class StaticSpike extends HazardBase {
  private initialX: number;
  private initialY: number;
  private isUpsideDown: boolean;
  public isActivated = false;

  constructor(scene: Phaser.Scene, x: number, y: number, isUpsideDown = false) {
    super(scene, x, y, isUpsideDown ? 'spike_upside' : 'spike_static');
    this.initialX = x;
    this.initialY = y;
    this.isUpsideDown = isUpsideDown;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setVelocity(0, 0);
    body.moves = false;

    // Честный lethal collider: 65-70% от визуального размера
    if (this.isUpsideDown) {
      body.setSize(20, 14);
      body.setOffset(6, 2);
    } else {
      body.setSize(20, 14);
      body.setOffset(6, 16);
    }

    // Согласно глобальному правилу дизайна CatTrap шипы скрыты до момента их активации
    this.setVisible(false);
    this.setScale(1, 0);
    this.isActivated = false;
  }

  public checkProximity(catX: number, catY: number): void {
    if (this.isActivated) return;

    // Дистанция активации: ~1.75 тайла по горизонтали (56px) и ~2.25 тайла по вертикали (72px)
    const dx = Math.abs(catX - this.x);
    const dy = Math.abs(catY - this.y);

    if (dx <= 56 && dy <= 72) {
      this.activate();
    }
  }

  public activate(): void {
    if (this.isActivated) return;
    this.isActivated = true;
    this.setVisible(true);
    AudioManager.getInstance().playSFX('spike');

    // Эффект резкого выскакивания шипа из плиты/потолка
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      scaleY: 1,
      duration: 80,
      ease: 'Back.easeOut'
    });
  }

  public reset(): void {
    this.scene.tweens.killTweensOf(this);
    this.isActivated = false;
    this.setVisible(false);
    this.setScale(1, 0);
    this.setPosition(this.initialX, this.initialY);

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.reset(this.initialX, this.initialY);
      body.setAllowGravity(false);
      body.setImmovable(true);
      body.setVelocity(0, 0);
      body.moves = false;
    }
  }
}
