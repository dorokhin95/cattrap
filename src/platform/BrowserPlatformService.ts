import { PlatformService, HapticType } from './PlatformService';
import { ViewportInfo, OrientationMode } from '../types';

export class BrowserPlatformService implements PlatformService {
  public readonly id = 'browser' as const;

  public async init(): Promise<void> {
    // В стандартном браузере инициализация мгновенна
  }

  public ready(): void {
    // No-op в веб
  }

  /** Вычисляет ViewportInfo по явно переданным w/h (не читает window.innerWidth) */
  public static computeViewport(width: number, height: number): ViewportInfo {
    const aspectRatio = width / (height || 1);

    let mode: OrientationMode = 'landscape';
    if (aspectRatio < 0.85) {
      mode = 'portrait';
    } else if (aspectRatio <= 1.15) {
      mode = 'compact';
    }

    // Чтение safe-area из вычисленных стилей root
    const rootStyle = getComputedStyle(document.documentElement);
    const top = parseFloat(rootStyle.getPropertyValue('--sat')) || 0;
    const bottom = parseFloat(rootStyle.getPropertyValue('--sab')) || 0;
    const left = parseFloat(rootStyle.getPropertyValue('--sal')) || 0;
    const right = parseFloat(rootStyle.getPropertyValue('--sar')) || 0;

    return {
      width,
      height,
      aspectRatio,
      mode,
      safeArea: { top, bottom, left, right }
    };
  }

  public getViewport(width?: number, height?: number): ViewportInfo {
    const w = typeof width === 'number' && width > 0 ? width : (typeof window !== 'undefined' ? window.innerWidth : 800);
    const h = typeof height === 'number' && height > 0 ? height : (typeof window !== 'undefined' ? window.innerHeight : 600);
    return BrowserPlatformService.computeViewport(w, h);
  }

  public haptic(type: HapticType): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        switch (type) {
          case 'light':
            navigator.vibrate(15);
            break;
          case 'medium':
            navigator.vibrate(35);
            break;
          case 'heavy':
            navigator.vibrate(60);
            break;
          case 'success':
            navigator.vibrate([20, 40, 20]);
            break;
          case 'error':
            navigator.vibrate([40, 40, 40]);
            break;
        }
      } catch (e) {
        // Вибрация может быть заблокирована политиками браузера
      }
    }
  }

  public showBackButton(_onClick: () => void): void {
    // В стандартном браузере нативной кнопки Back нет
  }

  public hideBackButton(): void {
    // No-op
  }

  public async requestFullscreen(): Promise<void> {
    if (document.fullscreenElement) return;
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.warn('[BrowserPlatformService] Не удалось включить fullscreen:', e);
    }
  }

  public isTelegram(): boolean {
    return false;
  }
}
