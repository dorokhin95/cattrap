import { PlatformService, HapticType } from './PlatformService';
import { ViewportInfo, OrientationMode } from '../types';

interface TelegramWebApp {
  ready(): void;
  expand(): void;
  close(): void;
  disableVerticalSwipes?(): void;
  enableVerticalSwipes?(): void;
  isExpanded?: boolean;
  initData?: string;
  viewportHeight?: number;
  viewportStableHeight?: number;
  safeAreaInset?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  contentSafeAreaInset?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  BackButton: {
    isVisible: boolean;
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
  };
  onEvent?(eventType: string, eventHandler: () => void): void;
  offEvent?(eventType: string, eventHandler: () => void): void;
  requestFullscreen?(): Promise<void>;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export class TelegramPlatformService implements PlatformService {
  public readonly id = 'telegram' as const;
  private tg: TelegramWebApp | null = null;
  private currentBackHandler: (() => void) | null = null;

  public async init(): Promise<void> {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.tg = window.Telegram.WebApp;
      try {
        this.tg.ready();
        this.tg.expand();

        if (typeof this.tg.disableVerticalSwipes === 'function') {
          this.tg.disableVerticalSwipes();
        }

        if (typeof this.tg.onEvent === 'function') {
          this.tg.onEvent('viewportChanged', () => {
            window.dispatchEvent(new Event('resize'));
          });
        }
      } catch (e) {
        console.warn('[TelegramPlatformService] Ошибка при вызове Telegram API:', e);
      }
    }
  }

  public ready(): void {
    try {
      this.tg?.ready();
      this.tg?.expand();
    } catch (e) {
      // Игнорируем
    }
  }

  public getViewport(customWidth?: number, customHeight?: number): ViewportInfo {
    const width = typeof customWidth === 'number' && customWidth > 0
      ? customWidth
      : (typeof window !== 'undefined' ? window.innerWidth : 800);
    const height = typeof customHeight === 'number' && customHeight > 0
      ? customHeight
      : (this.tg?.viewportStableHeight || this.tg?.viewportHeight || (typeof window !== 'undefined' ? window.innerHeight : 600));
    const aspectRatio = width / (height || 1);

    let mode: OrientationMode = 'landscape';
    if (aspectRatio < 0.85) {
      mode = 'portrait';
    } else if (aspectRatio <= 1.15) {
      mode = 'compact';
    }

    const rootStyle = typeof document !== 'undefined' ? getComputedStyle(document.documentElement) : null;
    const cssTop = rootStyle ? parseFloat(rootStyle.getPropertyValue('--sat')) || 0 : 0;
    const cssBottom = rootStyle ? parseFloat(rootStyle.getPropertyValue('--sab')) || 0 : 0;
    const cssLeft = rootStyle ? parseFloat(rootStyle.getPropertyValue('--sal')) || 0 : 0;
    const cssRight = rootStyle ? parseFloat(rootStyle.getPropertyValue('--sar')) || 0 : 0;

    const tgTop = this.tg?.contentSafeAreaInset?.top ?? this.tg?.safeAreaInset?.top ?? 0;
    const tgBottom = this.tg?.contentSafeAreaInset?.bottom ?? this.tg?.safeAreaInset?.bottom ?? 0;
    const tgLeft = this.tg?.contentSafeAreaInset?.left ?? this.tg?.safeAreaInset?.left ?? 0;
    const tgRight = this.tg?.contentSafeAreaInset?.right ?? this.tg?.safeAreaInset?.right ?? 0;

    const safeArea = {
      top: Math.max(cssTop, tgTop),
      bottom: Math.max(cssBottom, tgBottom),
      left: Math.max(cssLeft, tgLeft),
      right: Math.max(cssRight, tgRight)
    };

    return {
      width,
      height,
      aspectRatio,
      mode,
      safeArea
    };
  }

  public haptic(type: HapticType): void {
    if (!this.tg?.HapticFeedback) return;
    try {
      switch (type) {
        case 'light':
          this.tg.HapticFeedback.impactOccurred('light');
          break;
        case 'medium':
          this.tg.HapticFeedback.impactOccurred('medium');
          break;
        case 'heavy':
          this.tg.HapticFeedback.impactOccurred('heavy');
          break;
        case 'success':
          this.tg.HapticFeedback.notificationOccurred('success');
          break;
        case 'warning':
          this.tg.HapticFeedback.notificationOccurred('warning');
          break;
        case 'error':
          this.tg.HapticFeedback.notificationOccurred('error');
          break;
      }
    } catch (e) {
      // Игнорируем ошибки тактильного отклика
    }
  }

  public showBackButton(onClick: () => void): void {
    if (!this.tg?.BackButton) return;
    if (this.currentBackHandler) {
      this.tg.BackButton.offClick(this.currentBackHandler);
    }
    this.currentBackHandler = onClick;
    this.tg.BackButton.onClick(onClick);
    this.tg.BackButton.show();
  }

  public hideBackButton(): void {
    if (!this.tg?.BackButton) return;
    if (this.currentBackHandler) {
      this.tg.BackButton.offClick(this.currentBackHandler);
      this.currentBackHandler = null;
    }
    this.tg.BackButton.hide();
  }

  public async requestFullscreen(): Promise<void> {
    if (this.tg?.requestFullscreen) {
      try {
        await this.tg.requestFullscreen();
      } catch (e) {
        console.warn('[TelegramPlatformService] requestFullscreen не поддерживается:', e);
      }
    }
  }

  public isTelegram(): boolean {
    return !!(typeof window !== 'undefined' && window.Telegram?.WebApp?.initData);
  }
}
