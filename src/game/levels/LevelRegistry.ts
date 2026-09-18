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
import { level21 } from './level21';
import { level22 } from './level22';
import { level23 } from './level23';
import { level24 } from './level24';
import { level25 } from './level25';
import { level26 } from './level26';
import { level27 } from './level27';
import { level28 } from './level28';
import { level29 } from './level29';
import { level30 } from './level30';

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
    [20, level20],
    [21, level21],
    [22, level22],
    [23, level23],
    [24, level24],
    [25, level25],
    [26, level26],
    [27, level27],
    [28, level28],
    [29, level29],
    [30, level30]
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
