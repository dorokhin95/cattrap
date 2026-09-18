import { ControlModifier, LevelTheme } from '../../types';

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
  action: 'pop' | 'drop' | 'collapse' | 'move_portal' | 'chain_pop' | 'crush' | 'fire_laser' | 'spawn_echo' | 'trigger_glitch';
  delayMs?: number;
  once?: boolean;
  resetOnDeath?: boolean;
}

// --- Новые типы механик Главы 2 ---

export interface BouncePadData {
  id: string;
  x: number;
  y: number;
  power?: number;
}

export interface ConveyorData {
  id: string;
  x: number;
  y: number;
  direction: 'left' | 'right';
  speed?: number;
}

export interface MovingPlatformData {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed?: number;
  pingPong?: boolean;
  autoStart?: boolean;
}

export interface ButtonData {
  id: string;
  x: number;
  y: number;
  targets: string[];
  once?: boolean;
}

export interface ToggleBlockData {
  id: string;
  x: number;
  y: number;
  initiallyActive?: boolean;
}

export interface CrusherData {
  id: string;
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  orientation: 'down' | 'left' | 'right';
  warningMs?: number;
  slamMs?: number;
  holdMs?: number;
  retractMs?: number;
  cycle?: boolean;
  autoStart?: boolean;
  startDelayMs?: number;
}

export interface ControlZoneData {
  id: string;
  x: number;
  y: number;
  width: number;
  height?: number;
  type: ControlModifier;
}

// Механики Главы 3
export interface LaserHazardData {
  id: string;
  x: number;
  y: number;
  length: number; // Длина в тайлах
  direction: 'horizontal' | 'vertical';
  warningMs?: number;
  activeMs?: number;
  cooldownMs?: number;
  cycle?: boolean;
  autoStart?: boolean;
  tripwire?: boolean;
}

export interface GlitchBlockData {
  id: string;
  x: number;
  y: number;
  phaseGroup?: 'A' | 'B';
  activeMs?: number;
  inactiveMs?: number;
  initialPhase?: 'active' | 'inactive';
  autoStart?: boolean;
}

export interface WarpGateData {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  exitImpulseX?: number;
  exitImpulseY?: number;
}

export interface EchoCatData {
  id: string;
  delayMs?: number;
  autoStart?: boolean;
}

export interface TimeZoneData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  timeScale: number; // Например 0.4 для Slow-Mo
}

export interface LevelData {
  id: number;
  chapter: number;
  name: string;
  width: number;  // В тайлах
  height: number; // В тайлах
  spawn: { x: number; y: number }; // В тайлах
  theme?: LevelTheme;
  isChapterEnd?: boolean;
  solidTiles: TileCoord[];
  portal: PortalData;

  // Механики Главы 1
  staticSpikes?: SpikeCoord[];
  popSpikes?: PopSpikeData[];
  crumbleBlocks?: CrumbleData[];
  fallingBlocks?: FallingBlockData[];
  fakeFloors?: FakeFloorData[];
  modifierZones?: ModifierZoneData[];
  checkpoint?: { x: number; y: number };
  triggers: LevelTriggerData[];

  // Механики Главы 2
  bouncePads?: BouncePadData[];
  conveyors?: ConveyorData[];
  movingPlatforms?: MovingPlatformData[];
  buttons?: ButtonData[];
  toggleBlocks?: ToggleBlockData[];
  crushers?: CrusherData[];
  controlZones?: ControlZoneData[];

  // Механики Главы 3
  lasers?: LaserHazardData[];
  glitchBlocks?: GlitchBlockData[];
  warpGates?: WarpGateData[];
  echoCat?: EchoCatData;
  timeZones?: TimeZoneData[];
}
