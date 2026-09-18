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
    if (body) {
      body.enable = false; // Отключаем от Arcade Physics, чтобы GetOverlapY не выставлял touching.down котику
    }

    // Согласно глобальному правилу дизайна зоны управления невидимы до пересечения котиком
    this.setVisible(false);
  }

  public checkOverlap(cat: Cat): boolean {
    const halfW = this.zoneWidth / 2;
    const halfH = this.zoneHeight / 2;
    return cat.x >= (this.initialX - halfW) &&
           cat.x <= (this.initialX + halfW) &&
           cat.y >= (this.initialY - halfH) &&
           cat.y <= (this.initialY + halfH);
  }

  public applyModifier(cat: Cat): void {
    if (cat.getControlModifier() === this.zoneType) return;

    cat.setControlModifier(this.zoneType);

    if (this.zoneType === 'reverse') {
      AudioManager.getInstance().playSFX('controlReverse');
    } else if (this.zoneType === 'autorun_right') {
      AudioManager.getInstance().playSFX('autorunStart');
    }
  }

  public reset(): void {
    this.cancelScheduledEvents();
    this.setPosition(this.initialX, this.initialY);
  }
}
