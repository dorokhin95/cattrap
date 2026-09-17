import { ViewportInfo } from '../types';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export interface PlatformService {
  readonly id: 'browser' | 'telegram';
  init(): Promise<void>;
  ready(): void;
  getViewport(width?: number, height?: number): ViewportInfo;
  haptic(type: HapticType): void;
  showBackButton(onClick: () => void): void;
  hideBackButton(): void;
  requestFullscreen(): Promise<void>;
  isTelegram(): boolean;
}
