import Phaser from 'phaser';
import { AudioManager } from '../../audio/AudioManager';

export class GlitchBlock extends Phaser.Physics.Arcade.Sprite {
  public id: string;
  public phaseGroup: 'A' | 'B';
  public isActive = true;

  private activeMs: number;
  private inactiveMs: number;
  private initialPhase: 'active' | 'inactive';
  private initialX: number;
  private initialY: number;
  private timerEvent: Phaser.Time.TimerEvent | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: string = '',
    phaseGroup: 'A' | 'B' = 'A',
    activeMs = 1200,
    inactiveMs = 1200,
    initialPhase: 'active' | 'inactive' = 'active'
  ) {
    const tex = phaseGroup === 'A' ? 'tile_glitch_a_active' : 'tile_glitch_b_active';

    super(scene, x, y, tex);
    this.id = id;
    this.phaseGroup = phaseGroup;
    this.activeMs = activeMs;
    this.inactiveMs = inactiveMs;
    this.initialPhase = initialPhase;
    this.isActive = initialPhase === 'active';
    this.initialX = x;
    this.initialY = y;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.moves = false;
    body.enable = this.isActive;

    // В неактивном состоянии блок 100% невидим - никаких пунктиров!
    this.setVisible(this.isActive);

    this.startPhaseCycle();
  }

  private startPhaseCycle(): void {
    const delay = this.isActive ? this.activeMs : this.inactiveMs;

    // Предупреждающая дрожь за 160 мс до исчезновения активного блока
    if (this.isActive && delay > 200 && this.scene) {
      this.scene.time.delayedCall(delay - 160, () => {
        if (this.isActive && this.scene) {
          this.scene.tweens.add({
            targets: this,
            x: this.initialX + 2,
            alpha: 0.55,
            duration: 40,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
              this.setAlpha(1);
              this.setX(this.initialX);
            }
          });
        }
      });
    }

    this.timerEvent = this.scene.time.delayedCall(delay, () => {
      this.togglePhase();
    });
  }

  public togglePhase(silent = false): void {
    this.isActive = !this.isActive;

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.enable = this.isActive;
    }

    this.setVisible(this.isActive);
    this.setAlpha(1);
    this.setX(this.initialX);

    if (!silent && this.phaseGroup === 'A') {
      AudioManager.getInstance().playSFX('glitchSwitch');
    }

    this.startPhaseCycle();
  }

  public reset(): void {
    if (this.timerEvent) {
      this.timerEvent.remove(false);
      this.timerEvent = null;
    }

    this.isActive = this.initialPhase === 'active';
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.enable = this.isActive;
    }

    this.setVisible(this.isActive);
    this.setAlpha(1);
    this.setX(this.initialX);
    this.setY(this.initialY);

    this.startPhaseCycle();
  }

  public destroy(fromScene?: boolean): void {
    if (this.timerEvent) {
      this.timerEvent.remove(false);
      this.timerEvent = null;
    }
    super.destroy(fromScene);
  }
}
