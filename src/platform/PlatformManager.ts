import { PlatformService } from './PlatformService';
import { BrowserPlatformService } from './BrowserPlatformService';
import { TelegramPlatformService } from './TelegramPlatformService';

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
}
