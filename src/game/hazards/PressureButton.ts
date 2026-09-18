import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { AudioManager } from '../../audio/AudioManager';
import { ToggleBlock } from './ToggleBlock';
import { Cat } from '../entities/Cat';

export class PressureButton extends HazardBase {
  public id: string;
  public targets: string[];
  public singleUse: boolean;
  public isPressed = false;
  public isOverlapping = false;
  private wasOverlappingThisFrame = false;
  private initialX: number;
  private initialY: number;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string = '', targets: string[] = [], singleUse = false) {
    super(scene, x, y, 'pressure_button_up');
    this.id = id;
    this.targets = targets;
    this.singleUse = singleUse;
    this.initialX = x;
    this.initialY = y;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(26, 18);
    body.setOffset(3, 14);
  }

  public press(toggleBlocksMap: Map<string, ToggleBlock>, cat: Cat): boolean {
    this.wasOverlappingThisFrame = true;

    if (this.isPressed && this.singleUse) return false;
    if (this.isOverlapping) return false;

    this.isOverlapping = true;
    this.isPressed = true;
    this.setTexture('pressure_button_down');
    AudioManager.getInstance().playSFX('button');

    for (const targetId of this.targets) {
      const block = toggleBlocksMap.get(targetId);
      if (block) {
        block.toggle(cat);
      }
    }

    return true;
  }

  public endFrame(): void {
    if (!this.wasOverlappingThisFrame) {
      this.isOverlapping = false;
      if (!this.singleUse && this.isPressed) {
        this.isPressed = false;
        this.setTexture('pressure_button_up');
      }
    }
    this.wasOverlappingThisFrame = false;
  }

  public reset(): void {
    this.cancelScheduledEvents();
    this.isPressed = false;
    this.isOverlapping = false;
    this.wasOverlappingThisFrame = false;
    this.setTexture('pressure_button_up');
    this.setPosition(this.initialX, this.initialY);
  }
}
