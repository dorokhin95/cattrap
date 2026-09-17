import { LevelData } from './LevelData';
import { level01 } from './level01';
import { level02 } from './level02';
import { level03 } from './level03';
import { level04 } from './level04';
import { level05 } from './level05';
import { level06 } from './level06';
import { level07 } from './level07';
import { level08 } from './level08';
import { level09 } from './level09';
import { level10 } from './level10';
import { level11 } from './level11';
import { level12 } from './level12';
import { level13 } from './level13';
import { level14 } from './level14';
import { level15 } from './level15';
import { level16 } from './level16';
import { level17 } from './level17';
import { level18 } from './level18';
import { level19 } from './level19';
import { level20 } from './level20';

export class LevelRegistry {
  private static levels: Map<number, LevelData> = new Map([
    [1, level01],
    [2, level02],
    [3, level03],
    [4, level04],
    [5, level05],
    [6, level06],
    [7, level07],
    [8, level08],
    [9, level09],
    [10, level10],
    [11, level11],
    [12, level12],
    [13, level13],
    [14, level14],
    [15, level15],
    [16, level16],
    [17, level17],
    [18, level18],
    [19, level19],
    [20, level20]
  ]);

  public static getLevel(id: number): LevelData | undefined {
    return this.levels.get(id);
  }

  public static getAllLevels(): LevelData[] {
    return Array.from(this.levels.values());
  }

  public static getTotalLevels(): number {
    return this.levels.size;
  }
}
