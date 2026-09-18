import Phaser from 'phaser';
import { HazardBase } from './HazardBase';
import { AudioManager } from '../../audio/AudioManager';
import { Cat } from '../entities/Cat';

export class LaserHazard extends HazardBase {
  public id: string;
  public direction: 'horizontal' | 'vertical';
  public lengthPx: number;
  public isLethal = false;

  private warningMs: number;
  private activeMs: number;
  private cooldownMs: number;
  private cycle: boolean;
  private autoStart: boolean;
  private tripwire: boolean;
  private isCycling = false;

  private graphics: Phaser.GameObjects.Graphics;
  private beamBounds: Phaser.Geom.Rectangle;

  constructor(
    scene: Phaser.Scene,
    startX: number, // Центр эмиттера (px)
    startY: number,
    lengthTiles: number,
    direction: 'horizontal' | 'vertical' = 'horizontal',
    id: string = '',
    warningMs = 350,
    activeMs = 450,
    cooldownMs = 1200,
    cycle = true,
    autoStart = true,
    tripwire = false
  ) {
    super(scene, startX, startY, 'laser_emitter');
    this.id = id;
    this.direction = direction;
    this.lengthPx = lengthTiles * 32;
    this.warningMs = warningMs;
    this.activeMs = activeMs;
    this.cooldownMs = cooldownMs;
    this.cycle = cycle;
    this.autoStart = autoStart;
    this.tripwire = tripwire;

    if (direction === 'vertical') {
      this.setAngle(90);
    }

    // Отключаем тело от Arcade Physics
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.enable = false;
    }

    this.graphics = scene.add.graphics();
    this.graphics.setDepth(15);

    // Расчёт прямоугольника луча
    if (direction === 'horizontal') {
      this.beamBounds = new Phaser.Geom.Rectangle(startX + 12, startY - 8, this.lengthPx, 16);
    } else {
      this.beamBounds = new Phaser.Geom.Rectangle(startX - 8, startY + 12, 16, this.lengthPx);
    }

    if (this.autoStart && this.cycle) {
      this.startCycle();
    }
  }

  public startCycle(): void {
    if (this.isCycling) return;
    this.isCycling = true;
    this.schedule(this.cooldownMs, () => this.startWarning());
  }

  public triggerLaser(): void {
    if (this.isCycling || this.isLethal) return;
    this.isCycling = true;
    this.startWarning();
  }

  private startWarning(): void {
    AudioManager.getInstance().playSFX('laserWarning');
    this.renderWarningBeam();

    this.schedule(this.warningMs, () => this.startFiring());
  }

  private startFiring(): void {
    this.isLethal = true;
    AudioManager.getInstance().playSFX('laserShoot');
    this.renderFiringBeam();

    this.schedule(this.activeMs, () => this.stopFiring());
  }

  private stopFiring(): void {
    this.isLethal = false;
    this.graphics.clear();

    if (this.cycle) {
      this.schedule(this.cooldownMs, () => this.startWarning());
    } else {
      this.isCycling = false;
    }
  }

  private renderWarningBeam(): void {
    this.graphics.clear();
    this.graphics.lineStyle(1, 0xf43f5e, 0.45);
    if (this.direction === 'horizontal') {
      this.graphics.strokeLineShape(new Phaser.Geom.Line(this.x + 12, this.y, this.x + 12 + this.lengthPx, this.y));
    } else {
      this.graphics.strokeLineShape(new Phaser.Geom.Line(this.x, this.y + 12, this.x, this.y + 12 + this.lengthPx));
    }
  }

  private renderFiringBeam(): void {
    this.graphics.clear();
    const isH = this.direction === 'horizontal';

    // Внешнее свечение
    this.graphics.lineStyle(10, 0xf43f5e, 0.35);
    if (isH) {
      this.graphics.strokeLineShape(new Phaser.Geom.Line(this.x + 12, this.y, this.x + 12 + this.lengthPx, this.y));
    } else {
      this.graphics.strokeLineShape(new Phaser.Geom.Line(this.x, this.y + 12, this.x, this.y + 12 + this.lengthPx));
    }

    // Основной луч
    this.graphics.lineStyle(4, 0xf43f5e, 0.95);
    if (isH) {
      this.graphics.strokeLineShape(new Phaser.Geom.Line(this.x + 12, this.y, this.x + 12 + this.lengthPx, this.y));
    } else {
      this.graphics.strokeLineShape(new Phaser.Geom.Line(this.x, this.y + 12, this.x, this.y + 12 + this.lengthPx));
    }

    // Белое ядро
    this.graphics.lineStyle(2, 0xffffff, 1.0);
    if (isH) {
      this.graphics.strokeLineShape(new Phaser.Geom.Line(this.x + 12, this.y, this.x + 12 + this.lengthPx, this.y));
    } else {
      this.graphics.strokeLineShape(new Phaser.Geom.Line(this.x, this.y + 12, this.x, this.y + 12 + this.lengthPx));
    }
  }

  public checkOverlap(cat: Cat): boolean {
    if (!this.isLethal) {
      // Если лазер — скрытая растяжка (tripwire), проверяем пересечение нити
      if (this.tripwire && !this.isCycling) {
        const catBox = new Phaser.Geom.Rectangle(cat.x - 7, cat.y - 9, 14, 19);
        if (Phaser.Geom.Intersects.RectangleToRectangle(catBox, this.beamBounds)) {
          this.triggerLaser();
        }
      }
      return false;
    }

    const catBox = new Phaser.Geom.Rectangle(cat.x - 7, cat.y - 9, 14, 19);
    return Phaser.Geom.Intersects.RectangleToRectangle(catBox, this.beamBounds);
  }

  public reset(): void {
    this.cancelScheduledEvents();
    this.isLethal = false;
    this.isCycling = false;
    this.graphics.clear();

    if (this.autoStart && this.cycle) {
      this.startCycle();
    }
  }

  public destroy(fromScene?: boolean): void {
    this.graphics.destroy();
    super.destroy(fromScene);
  }
}
