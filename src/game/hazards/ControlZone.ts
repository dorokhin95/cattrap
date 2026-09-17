import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { ControlModifier } from '../../types';
import { AudioManager } from '../../audio/AudioManager';
import { Cat } from '../entities/Cat';

export class ControlZone extends HazardBase {
  public id: string;
  public zoneType: ControlModifier;
  private zoneWidth: number;
  private zoneHeight: number;
  private initialX: number;
  private initialY: number;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height = 64, type: ControlModifier = 'reverse', id: string = '') {
    const texture = type === 'reverse' ? 'control_zone_reverse' : type === 'autorun_right' ? 'control_zone_autorun' : 'zone_size';
    super(scene, x, y, texture);
    this.id = id;
    this.zoneType = type;
    this.zoneWidth = width;
    this.zoneHeight = height;
    this.initialX = x;
    this.initialY = y;

    this.setDisplaySize(width, height);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(width, height);

    if (type === 'normal') {
      this.setVisible(false);
    }
  }

  public applyModifier(cat: Cat): void {
    if (cat.getControlModifier() === this.zoneType) return;

    cat.setControlModifier(this.zoneType);

    if (this.zoneType === 'reverse') {
      AudioManager.getInstance().playSFX('controlReverse');
      this.showIndicator(cat.x, cat.y - 28, '↔ УПРАВЛЕНИЕ НАОБОРОТ', '#f43f5e');
    } else if (this.zoneType === 'autorun_right') {
      AudioManager.getInstance().playSFX('autorunStart');
      this.showIndicator(cat.x, cat.y - 28, '>> ТОЛЬКО ВПЕРЁД', '#f59e0b');
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

  public reset(): void {
    this.cancelScheduledEvents();
    this.setPosition(this.initialX, this.initialY);
  }
}
