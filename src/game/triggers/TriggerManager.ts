import { CONSTANTS } from '../../core/Constants';

export interface TriggerDefinition {
  id: string;
  condition: {
    type: 'player_x_greater' | 'player_x_less' | 'player_y_greater' | 'player_dist_portal' | 'custom';
    value: number;
    customCheck?: () => boolean;
  };
  action: () => void;
  delayMs?: number;
  once?: boolean;
  resetOnDeath?: boolean;
}

export class TriggerManager {
  private triggers: TriggerDefinition[] = [];
  private activatedTriggerIds = new Set<string>();
  private pendingTimeouts: number[] = [];

  public addTrigger(trigger: TriggerDefinition): void {
    this.triggers.push(trigger);
  }

  public checkTriggers(playerX: number, playerY: number, portalDistancePx?: number): void {
    const tileX = playerX / CONSTANTS.TILE_SIZE;
    const tileY = playerY / CONSTANTS.TILE_SIZE;

    for (const trigger of this.triggers) {
      if (trigger.once !== false && this.activatedTriggerIds.has(trigger.id)) {
        continue;
      }

      let conditionMet = false;
      switch (trigger.condition.type) {
        case 'player_x_greater':
          conditionMet = tileX >= trigger.condition.value;
          break;
        case 'player_x_less':
          conditionMet = tileX <= trigger.condition.value;
          break;
        case 'player_y_greater':
          conditionMet = tileY >= trigger.condition.value;
          break;
        case 'player_dist_portal':
          if (portalDistancePx !== undefined) {
            const distTiles = portalDistancePx / CONSTANTS.TILE_SIZE;
            conditionMet = distTiles <= trigger.condition.value;
          }
          break;
        case 'custom':
          conditionMet = trigger.condition.customCheck ? trigger.condition.customCheck() : false;
          break;
      }

      if (conditionMet) {
        this.activatedTriggerIds.add(trigger.id);

        if (trigger.delayMs && trigger.delayMs > 0) {
          const tid = window.setTimeout(() => {
            trigger.action();
          }, trigger.delayMs);
          this.pendingTimeouts.push(tid);
        } else {
          trigger.action();
        }
      }
    }
  }

  public reset(): void {
    // Очищаем запланированные задержки
    for (const tid of this.pendingTimeouts) {
      clearTimeout(tid);
    }
    this.pendingTimeouts = [];

    // Сбрасываем флаги триггеров
    for (const trigger of this.triggers) {
      if (trigger.resetOnDeath !== false) {
        this.activatedTriggerIds.delete(trigger.id);
      }
    }
  }

  public clear(): void {
    this.reset();
    this.triggers = [];
    this.activatedTriggerIds.clear();
  }
}
