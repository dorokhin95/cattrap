import Phaser from 'phaser';
import { CONSTANTS } from '../core/Constants';
import { LevelTheme } from '../types';

export class BackgroundRenderer {
  private scene: Phaser.Scene;
  private bgObjects: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene, levelWidthTiles: number, levelHeightTiles: number, theme?: LevelTheme, levelId?: number) {
    this.scene = scene;
    this.createBackground(levelWidthTiles, levelHeightTiles, theme, levelId || 1);
  }

  private createBackground(widthTiles: number, heightTiles: number, theme?: LevelTheme, levelId: number = 1): void {
    const isChapter3 = theme === 'chapter3' || levelId >= 21;
    const isChapter2 = !isChapter3 && (theme === 'chapter2' || levelId >= 11);
    const worldW = widthTiles * CONSTANTS.TILE_SIZE;
    const worldH = heightTiles * CONSTANTS.TILE_SIZE;

    // Расширяем область фона с запасом для свободного перемещения камеры
    const bgW = Math.max(worldW * 1.5, 1200);
    const bgH = Math.max(worldH * 1.5, 800);

    if (isChapter3) {
      // Глава 3: Матрица и Кибер-Глитч
      const baseRect = this.scene.add.rectangle(bgW / 2, bgH / 2, bgW, bgH, 0x070a14)
        .setScrollFactor(0)
        .setDepth(-100);
      this.bgObjects.push(baseRect);

      if (this.scene.textures.exists('bg_ch3_far')) {
        const farTile = this.scene.add.tileSprite(0, 0, bgW, bgH, 'bg_ch3_far')
          .setOrigin(0, 0)
          .setScrollFactor(0.10)
          .setDepth(-80)
          .setAlpha(0.85);
        this.bgObjects.push(farTile);
      }

      if (this.scene.textures.exists('bg_ch3_mid')) {
        const midTile = this.scene.add.tileSprite(0, 0, bgW, bgH, 'bg_ch3_mid')
          .setOrigin(0, 0)
          .setScrollFactor(0.25)
          .setDepth(-60)
          .setAlpha(0.8);
        this.bgObjects.push(midTile);
      }
    } else if (isChapter2) {
      // Глава 2: Подземный технический сектор
      const isLateSector = levelId >= 18;
      const baseBgColor = isLateSector ? 0x090e15 : 0x101923;

      // 0. Базовый сплошной цвет
      const baseRect = this.scene.add.rectangle(bgW / 2, bgH / 2, bgW, bgH, baseBgColor)
        .setScrollFactor(0)
        .setDepth(-100);
      this.bgObjects.push(baseRect);

      // 1. Far parallax layer (scrollFactor 0.12)
      if (this.scene.textures.exists('bg_sector_far')) {
        const farTile = this.scene.add.tileSprite(0, 0, bgW, bgH, 'bg_sector_far')
          .setOrigin(0, 0)
          .setScrollFactor(0.12)
          .setDepth(-80)
          .setAlpha(isLateSector ? 0.65 : 0.85);
        this.bgObjects.push(farTile);
      }

      // 2. Middle parallax layer (scrollFactor 0.30)
      if (this.scene.textures.exists('bg_sector_mid')) {
        const midTile = this.scene.add.tileSprite(0, 0, bgW, bgH, 'bg_sector_mid')
          .setOrigin(0, 0)
          .setScrollFactor(0.30)
          .setDepth(-60)
          .setAlpha(isLateSector ? 0.9 : 0.75);
        this.bgObjects.push(midTile);
      }
    } else {
      // Глава 1: Классический тёмно-фиолетовый фон
      const bg = this.scene.add.rectangle(worldW / 2, worldH / 2, worldW * 1.5, worldH * 1.5, 0x181622)
        .setScrollFactor(0.05)
        .setDepth(-100);
      this.bgObjects.push(bg);
    }
  }

  public destroy(): void {
    for (const obj of this.bgObjects) {
      if (obj && obj.destroy) {
        obj.destroy();
      }
    }
    this.bgObjects = [];
  }
}
