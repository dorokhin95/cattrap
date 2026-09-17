export interface TileCoord {
  x: number;
  y: number;
  type?: 'solid' | 'paw' | 'tunnel_bar';
}

export interface SpikeCoord {
  x: number;
  y: number;
  upsideDown?: boolean;
}

export interface PopSpikeData {
  id: string;
  x: number;
  y: number;
}

export interface CrumbleData {
  id: string;
  x: number;
  y: number;
}

export interface FallingBlockData {
  id: string;
  x: number;
  y: number;
  landingY: number; // В тайлах
}

export interface FakeFloorData {
  id: string;
  x: number;
  y: number;
}

export interface ModifierZoneData {
  x: number;
  y: number;
  type: 'shrink' | 'restore_size' | 'gravity_invert' | 'gravity_normal';
}

export interface PortalData {
  x: number;
  y: number;
  targets?: Array<{ x: number; y: number }>;
  isTrollPortal?: boolean;
}

export interface LevelTriggerData {
  id: string;
  conditionType: 'player_x_greater' | 'player_x_less' | 'player_dist_portal';
  conditionValue: number;
  targetId: string;
  action: 'pop' | 'drop' | 'collapse' | 'move_portal' | 'chain_pop';
  delayMs?: number;
  once?: boolean;
  resetOnDeath?: boolean;
}

export interface LevelData {
  id: number;
  name: string;
  width: number;  // В тайлах
  height: number; // В тайлах
  spawn: { x: number; y: number }; // В тайлах
  solidTiles: TileCoord[];
  portal: PortalData;
  staticSpikes?: SpikeCoord[];
  popSpikes?: PopSpikeData[];
  crumbleBlocks?: CrumbleData[];
  fallingBlocks?: FallingBlockData[];
  fakeFloors?: FakeFloorData[];
  modifierZones?: ModifierZoneData[];
  checkpoint?: { x: number; y: number };
  triggers: LevelTriggerData[];
}
