import { SoundSynthesizer } from './SoundSynthesizer';
import { SaveProvider } from '../save/SaveProvider';

export class AudioManager {
  private static instance: AudioManager | null = null;
  private synth: SoundSynthesizer;
  private isMutedDueToBackground = false;

  private constructor() {
    this.synth = new SoundSynthesizer();
    this.setupVisibilityListeners();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private setupVisibilityListeners(): void {
    if (typeof document === 'undefined') return;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isMutedDueToBackground = true;
        this.synth.stopBGM();
      } else {
        this.isMutedDueToBackground = false;
        this.synth.resumeContext();
        this.syncMusicState();
      }
    });

    window.addEventListener('blur', () => {
      this.isMutedDueToBackground = true;
      this.synth.stopBGM();
    });

    window.addEventListener('focus', () => {
      this.isMutedDueToBackground = false;
      this.synth.resumeContext();
      this.syncMusicState();
    });
  }

  public syncMusicState(): void {
    const settings = SaveProvider.getInstance().getSettings();
    if (settings.music && !this.isMutedDueToBackground) {
      this.synth.startBGM();
    } else {
      this.synth.stopBGM();
    }
  }

  public playSFX(sound: 'jump' | 'land' | 'spike' | 'death' | 'crumble' | 'blockFall' | 'size' | 'gravity' | 'portal' | 'checkpoint' | 'click'): void {
    const settings = SaveProvider.getInstance().getSettings();
    if (!settings.sfx || this.isMutedDueToBackground) return;

    this.synth.resumeContext();
    switch (sound) {
      case 'jump':
        this.synth.playJump();
        break;
      case 'land':
        this.synth.playLand();
        break;
      case 'spike':
        this.synth.playSpike();
        break;
      case 'death':
        this.synth.playDeath();
        break;
      case 'crumble':
        this.synth.playCrumble();
        break;
      case 'blockFall':
        this.synth.playBlockFall();
        break;
      case 'size':
        this.synth.playSizeChange();
        break;
      case 'gravity':
        this.synth.playGravityChange();
        break;
      case 'portal':
        this.synth.playPortal();
        break;
      case 'checkpoint':
        this.synth.playCheckpoint();
        break;
      case 'click':
        this.synth.playUIButton();
        break;
    }
  }
}
