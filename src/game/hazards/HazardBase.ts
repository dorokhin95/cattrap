import Phaser from 'phaser';

export abstract class HazardBase extends Phaser.Physics.Arcade.Sprite {
  protected isTriggered = false;
  protected timerEvents: Phaser.Time.TimerEvent[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  protected schedule(delay: number, callback: () => void): Phaser.Time.TimerEvent {
    const timer = this.scene.time.delayedCall(delay, callback);
    this.timerEvents.push(timer);
    return timer;
  }

  protected cancelScheduledEvents(): void {
    for (const timer of this.timerEvents) {
      timer.remove(false);
    }
    this.timerEvents = [];
  }

  public abstract reset(): void;
}
