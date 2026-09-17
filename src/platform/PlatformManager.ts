import { PlatformService, HapticType } from './PlatformService';
import { BrowserPlatformService } from './BrowserPlatformService';
import { TelegramPlatformService } from './TelegramPlatformService';
import { SaveProvider } from '../save/SaveProvider';
import { ViewportInfo } from '../types';

export class PlatformManager {
  private static instance: PlatformManager | null = null;
  private service: PlatformService;

  private constructor() {
    if (typeof window !== 'undefined' && (window.Telegram?.WebApp as any)?.initData !== undefined) {
      this.service = new TelegramPlatformService();
    } else {
      this.service = new BrowserPlatformService();
    }
  }

  public static getInstance(): PlatformManager {
    if (!PlatformManager.instance) {
      PlatformManager.instance = new PlatformManager();
    }
    return PlatformManager.instance;
  }

  public async init(): Promise<void> {
    await this.service.init();
  }

  public getPlatform(): PlatformService {
    return this.service;
  }

  public haptic(type: HapticType): void {
    if (!SaveProvider.getInstance().getSettings().vibration) return;
    this.service.haptic(type);
  }

  public getViewport(width?: number, height?: number): ViewportInfo {
    return this.service.getViewport(width, height);
  }

  public showBackButton(onClick: () => void): void {
    this.service.showBackButton(onClick);
  }

  public hideBackButton(): void {
    this.service.hideBackButton();
  }
}
