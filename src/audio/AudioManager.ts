import { SoundSynthesizer } from './SoundSynthesizer';
import { SaveProvider } from '../save/SaveProvider';

export class AudioManager {
  private static instance: AudioManager | null = null;
  private synth: SoundSynthesizer;
  private isMutedDueToBackground = false;
  private isUnlocked = false;

  private constructor() {
    this.synth = new SoundSynthesizer();
    this.setupVisibilityListeners();
    this.setupUserGestureUnlock();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private setupUserGestureUnlock(): void {
    if (typeof window === 'undefined') return;

    const unlockHandler = async () => {
      if (this.isUnlocked) return;
      const success = await this.synth.unlock();
      if (success) {
        this.isUnlocked = true;
        window.removeEventListener('pointerdown', unlockHandler);
        window.removeEventListener('keydown', unlockHandler);
        this.syncMusicState();
      }
    };

    window.addEventListener('pointerdown', unlockHandler);
    window.addEventListener('keydown', unlockHandler);
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

  public playSFX(sound: 'jump' | 'land' | 'spike' | 'death' | 'crumble' | 'blockFall' | 'size' | 'gravity' | 'portal' | 'checkpoint' | 'click' | 'bounce' | 'conveyor' | 'button' | 'toggleDissolve' | 'crusherWarning' | 'crusherSlam' | 'controlReverse' | 'autorunStart'): void {
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
      case 'bounce':
        this.synth.playBounce();
        break;
      case 'conveyor':
        this.synth.playConveyor();
        break;
      case 'button':
        this.synth.playButton();
        break;
      case 'toggleDissolve':
        this.synth.playToggleDissolve();
        break;
      case 'crusherWarning':
        this.synth.playCrusherWarning();
        break;
      case 'crusherSlam':
        this.synth.playCrusherSlam();
        break;
      case 'controlReverse':
        this.synth.playControlReverse();
        break;
      case 'autorunStart':
        this.synth.playAutorunStart();
        break;
    }
  }
}
