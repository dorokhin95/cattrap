import Phaser from 'phaser';
import { CONSTANTS } from '../core/Constants';
import { OrientationMode } from '../types';

export class CameraSystem {
  private camera: Phaser.Cameras.Scene2D.Camera;
  private currentMode: OrientationMode = 'landscape';
  private targetLookAheadX = 0;
  private currentLookAheadX = 0;

  constructor(camera: Phaser.Cameras.Scene2D.Camera) {
    this.camera = camera;
    this.camera.setBackgroundColor(CONSTANTS.COLORS.BG_DARK);
  }

  public setLevelBounds(widthTiles: number, heightTiles: number): void {
    const widthPx = widthTiles * CONSTANTS.TILE_SIZE;
    const heightPx = heightTiles * CONSTANTS.TILE_SIZE;
    this.camera.setBounds(0, 0, widthPx, heightPx);
  }

  public updateViewport(mode: OrientationMode, viewportWidth: number, viewportHeight: number): void {
    this.currentMode = mode;
    const tileSize = CONSTANTS.TILE_SIZE;

    // Гарантируем, что камера сцены имеет точные габариты нового окна
    this.camera.setViewport(0, 0, viewportWidth, viewportHeight);
    this.camera.setSize(viewportWidth, viewportHeight);

    let visibleTilesX: number = CONSTANTS.LANDSCAPE_TILES_X; // 18
    if (mode === 'portrait') {
      visibleTilesX = CONSTANTS.PORTRAIT_TILES_X; // 10
    } else if (mode === 'compact') {
      visibleTilesX = 14;
    }

    const desiredWidthPx = visibleTilesX * tileSize;
    const zoom = viewportWidth / desiredWidthPx;

    this.camera.setZoom(zoom);
  }

  public update(catX: number, catY: number, catVelocityX: number, deltaMs: number): void {
    const tileSize = CONSTANTS.TILE_SIZE;
    const lookAheadTiles = CONSTANTS.CAMERA_LOOKAHEAD_TILES; // 1.8

    // В портретном режиме вычисляем look-ahead по направлению движения
    if (this.currentMode === 'portrait') {
      if (catVelocityX > 20) {
        this.targetLookAheadX = lookAheadTiles * tileSize;
      } else if (catVelocityX < -20) {
        this.targetLookAheadX = -lookAheadTiles * tileSize;
      }
    } else {
      // В ландшафтном режиме кот чуть смещен левее центра
      this.targetLookAheadX = (lookAheadTiles * 0.8) * tileSize;
    }

    // Плавный lerp для look-ahead смещения
    const lerpFactor = Math.min(1, (deltaMs / 1000) * 4);
    this.currentLookAheadX += (this.targetLookAheadX - this.currentLookAheadX) * lerpFactor;

    // Центрируем камеру с учетом смещения
    const targetCamX = catX + this.currentLookAheadX;
    const targetCamY = catY - 16; // Чуть выше кота для обзора прыжков

    this.camera.centerOn(targetCamX, targetCamY);
  }
}
