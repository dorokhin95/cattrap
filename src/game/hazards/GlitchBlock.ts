import Phaser from 'phaser';
import { AudioManager } from '../../audio/AudioManager';

export class GlitchBlock extends Phaser.Physics.Arcade.Sprite {
  public id: string;
  public phaseGroup: 'A' | 'B';
  public isActive = true;

  private activeMs: number;
  private inactiveMs: number;
  private initialPhase: 'active' | 'inactive';
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
    const tex = phaseGroup === 'A' 
      ? (initialPhase === 'active' ? 'tile_glitch_a_active' : 'tile_glitch_a_inactive')
      : (initialPhase === 'active' ? 'tile_glitch_b_active' : 'tile_glitch_b_inactive');

    super(scene, x, y, tex);
    this.id = id;
    this.phaseGroup = phaseGroup;
    this.activeMs = activeMs;
    this.inactiveMs = inactiveMs;
    this.initialPhase = initialPhase;
    this.isActive = initialPhase === 'active';

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.moves = false;
    body.enable = this.isActive;

    this.startPhaseCycle();
  }

  private startPhaseCycle(): void {
    const delay = this.isActive ? this.activeMs : this.inactiveMs;
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

    const tex = this.phaseGroup === 'A'
      ? (this.isActive ? 'tile_glitch_a_active' : 'tile_glitch_a_inactive')
      : (this.isActive ? 'tile_glitch_b_active' : 'tile_glitch_b_inactive');
    this.setTexture(tex);

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

    const tex = this.phaseGroup === 'A'
      ? (this.isActive ? 'tile_glitch_a_active' : 'tile_glitch_a_inactive')
      : (this.isActive ? 'tile_glitch_b_active' : 'tile_glitch_b_inactive');
    this.setTexture(tex);

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
