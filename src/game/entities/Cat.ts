import Phaser from 'phaser';
import { CONSTANTS } from '../../core/Constants';
import { CatState, SizeState, GravityState, ControlModifier } from '../../types';
import { AudioManager } from '../../audio/AudioManager';

export interface CatInputState {
  left: boolean;
  right: boolean;
  jumpPressed: boolean; // Одиночное нажатие в этом кадре
  jumpDown: boolean;    // Удержание кнопки
  jumpReleased: boolean;// Отпускание кнопки в этом кадре
}

export class Cat extends Phaser.Physics.Arcade.Sprite {
  private catState: CatState = 'idle';
  private sizeState: SizeState = 'normal';
  private gravityState: GravityState = 'normal';
  private controlModifier: ControlModifier = 'normal';

  // Coyote time & Jump buffer таймеры (в мс)
  private timeSinceLeftGroundMs = 9999;
  private timeSinceJumpRequestedMs = 9999;

  // Таймер моргания в режиме покоя
  private idleBlinkTimerMs = 0;
  private nextBlinkIntervalMs = 3500;
  private isBlinking = false;

  // Флаг приземления (squash эффект)
  private isLanding = false;
  private landingTimerMs = 0;

  // Флаг смерти и блокировки ввода
  private isDead = false;
  private levelDeathsCount = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'cat', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.initPhysics();
    this.createAnimations();
  }

  private initPhysics(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(false);
    this.updateCollider();
    body.setMaxVelocity(CONSTANTS.MOVE_SPEED, 600);
  }

  private updateCollider(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (this.sizeState === 'normal') {
      this.setScale(1);
      body.setSize(CONSTANTS.CAT_COLLIDER_WIDTH, CONSTANTS.CAT_COLLIDER_HEIGHT);
      body.setOffset(CONSTANTS.CAT_COLLIDER_OFFSET_X, CONSTANTS.CAT_COLLIDER_OFFSET_Y);
    } else {
      this.setScale(CONSTANTS.CAT_SMALL_SCALE);
      body.setSize(CONSTANTS.CAT_SMALL_COLLIDER_WIDTH, CONSTANTS.CAT_SMALL_COLLIDER_HEIGHT);
      body.setOffset(CONSTANTS.CAT_SMALL_COLLIDER_OFFSET_X, CONSTANTS.CAT_SMALL_COLLIDER_OFFSET_Y);
    }
  }

  private createAnimations(): void {
    const anims = this.scene.anims;
    if (!anims.exists('cat_idle')) {
      anims.create({
        key: 'cat_idle',
        frames: anims.generateFrameNumbers('cat', { frames: [0, 1] }),
        frameRate: 3,
        repeat: -1
      });
      anims.create({
        key: 'cat_run',
        frames: anims.generateFrameNumbers('cat', { frames: [3, 4, 5, 6] }),
        frameRate: 11,
        repeat: -1
      });
      anims.create({
        key: 'cat_jump',
        frames: [{ key: 'cat', frame: 7 }],
        frameRate: 1
      });
      anims.create({
        key: 'cat_fall',
        frames: [{ key: 'cat', frame: 8 }],
        frameRate: 1
      });
      anims.create({
        key: 'cat_land',
        frames: [{ key: 'cat', frame: 9 }],
        frameRate: 10
      });
      anims.create({
        key: 'cat_death',
        frames: anims.generateFrameNumbers('cat', { frames: [10, 11] }),
        frameRate: 8,
        repeat: 0
      });
    }
  }

  public setLevelDeaths(count: number): void {
    this.levelDeathsCount = count;
    if (count >= 5) {
      // Сердитое покачивание при респауне (ТЗ пункт 7)
      this.scene.tweens.add({
        targets: this,
        angle: { from: -8, to: 8 },
        duration: 80,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          this.setAngle(0);
        }
      });
    }
  }

  public updateCat(deltaMs: number, input: CatInputState): void {
    if (this.isDead) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    const isGroundContact = this.gravityState === 'normal' 
      ? (body.blocked.down || body.touching.down)
      : (body.blocked.up || body.touching.up);

    // --- 1. ТАЙМЕРЫ COYOTE TIME & JUMP BUFFER ---
    if (isGroundContact) {
      this.timeSinceLeftGroundMs = 0;
    } else {
      this.timeSinceLeftGroundMs += deltaMs;
    }

    if (input.jumpPressed) {
      this.timeSinceJumpRequestedMs = 0;
    } else {
      this.timeSinceJumpRequestedMs += deltaMs;
    }

    // --- 2. ГОРИЗОНТАЛЬНОЕ ПЕРЕМЕЩЕНИЕ ---
    const controlMultiplier = isGroundContact ? 1 : CONSTANTS.AIR_CONTROL;
    const accel = CONSTANTS.ACCELERATION * controlMultiplier;

    let moveLeft = input.left;
    let moveRight = input.right;

    if (this.controlModifier === 'reverse') {
      moveLeft = input.right;
      moveRight = input.left;
    } else if (this.controlModifier === 'autorun_right') {
      moveLeft = false;
      moveRight = true;
    }

    if (moveLeft && !moveRight) {
      body.setAccelerationX(-accel);
      this.setFlipX(true);
    } else if (moveRight && !moveLeft) {
      body.setAccelerationX(accel);
      this.setFlipX(false);
    } else {
      body.setAccelerationX(0);
      // Торможение при отпускании кнопок
      if (Math.abs(body.velocity.x) > 10) {
        const decel = CONSTANTS.DECELERATION * (deltaMs / 1000);
        if (body.velocity.x > 0) {
          body.setVelocityX(Math.max(0, body.velocity.x - decel));
        } else {
          body.setVelocityX(Math.min(0, body.velocity.x + decel));
        }
      } else {
        body.setVelocityX(0);
      }
    }

    // --- 3. ПРЫЖОК (COYOTE TIME + JUMP BUFFER) ---
    const canCoyoteJump = this.timeSinceLeftGroundMs <= CONSTANTS.COYOTE_TIME_MS;
    const hasBufferedJump = this.timeSinceJumpRequestedMs <= CONSTANTS.JUMP_BUFFER_MS;

    if (canCoyoteJump && hasBufferedJump) {
      this.executeJump();
    }

    // Variable jump: срез вертикальной скорости при раннем отпускании кнопки прыжка
    if (input.jumpReleased) {
      if (this.gravityState === 'normal' && body.velocity.y < 0) {
        body.setVelocityY(body.velocity.y * CONSTANTS.VARIABLE_JUMP_CUTOFF);
      } else if (this.gravityState === 'inverted' && body.velocity.y > 0) {
        body.setVelocityY(body.velocity.y * CONSTANTS.VARIABLE_JUMP_CUTOFF);
      }
    }

    // --- 4. LANDING SQUASH ---
    if (isGroundContact && !this.isLanding && this.catState === 'fall') {
      this.isLanding = true;
      this.landingTimerMs = 80;
      AudioManager.getInstance().playSFX('land');
    }

    if (this.isLanding) {
      this.landingTimerMs -= deltaMs;
      if (this.landingTimerMs <= 0) {
        this.isLanding = false;
      }
    }

    // --- 5. ОБНОВЛЕНИЕ АНИМАЦИЙ И СОСТОЯНИЙ ---
    this.updateAnimationState(isGroundContact, body.velocity.x, body.velocity.y, deltaMs);
  }

  private executeJump(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const jumpDir = this.gravityState === 'normal' ? 1 : -1;
    body.setVelocityY(CONSTANTS.JUMP_VELOCITY * jumpDir);

    this.timeSinceLeftGroundMs = 9999;
    this.timeSinceJumpRequestedMs = 9999;
    this.isLanding = false;

    AudioManager.getInstance().playSFX('jump');
  }

  private updateAnimationState(isGround: boolean, vx: number, vy: number, deltaMs: number): void {
    if (!isGround) {
      const isMovingUp = this.gravityState === 'normal' ? vy < -20 : vy > 20;
      if (isMovingUp) {
        this.catState = 'jump';
        this.play('cat_jump', true);
      } else {
        this.catState = 'fall';
        this.play('cat_fall', true);
      }
      return;
    }

    if (this.isLanding) {
      this.catState = 'land';
      this.play('cat_land', true);
      return;
    }

    if (Math.abs(vx) > 15) {
      this.catState = 'run';
      this.play('cat_run', true);
    } else {
      this.catState = 'idle';

      // Логика периодического моргания
      this.idleBlinkTimerMs += deltaMs;
      if (!this.isBlinking && this.idleBlinkTimerMs >= this.nextBlinkIntervalMs) {
        this.isBlinking = true;
        this.setFrame(2); // Кадр моргания
        this.scene.time.delayedCall(150, () => {
          this.isBlinking = false;
          this.idleBlinkTimerMs = 0;
          this.nextBlinkIntervalMs = Phaser.Math.Between(3000, 5000);
        });
      } else if (!this.isBlinking) {
        this.play('cat_idle', true);
      }
    }
  }

  // Изменение размера котика (бирюзовая зона)
  public setSizeModifier(size: SizeState): void {
    if (this.sizeState === size) return;
    this.sizeState = size;
    this.updateCollider();
    AudioManager.getInstance().playSFX('size');

    // Эффект мини-вспышки
    this.scene.tweens.add({
      targets: this,
      alpha: { from: 0.4, to: 1 },
      duration: 150
    });
  }

  // Изменение гравитации (фиолетовая зона)
  public setGravityModifier(gravity: GravityState): void {
    if (this.gravityState === gravity) return;
    this.gravityState = gravity;

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (gravity === 'inverted') {
      body.setGravityY(-CONSTANTS.GRAVITY * 2);
      this.setFlipY(true);
    } else {
      body.setGravityY(0);
      this.setFlipY(false);
    }
    AudioManager.getInstance().playSFX('gravity');
  }

  public getGravityState(): GravityState {
    return this.gravityState;
  }

  public getSizeState(): SizeState {
    return this.sizeState;
  }

  public die(onComplete: () => void): void {
    if (this.isDead) return;
    this.isDead = true;
    this.catState = 'death';

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.setAcceleration(0, 0);
    body.setAllowGravity(false);

    // Hit-stop: короткая заморозка 60 мс
    this.scene.time.delayedCall(CONSTANTS.HITSTOP_DURATION_MS, () => {
      this.play('cat_death', true);
      AudioManager.getInstance().playSFX('death');

      // Создание дымка / облачка
      for (let i = 0; i < 6; i++) {
        const puff = this.scene.add.image(
          this.x + Phaser.Math.Between(-8, 8),
          this.y + Phaser.Math.Between(-8, 8),
          'particle_puff'
        );
        this.scene.tweens.add({
          targets: puff,
          x: puff.x + Phaser.Math.Between(-16, 16),
          y: puff.y + Phaser.Math.Between(-16, 16),
          alpha: 0,
          scale: { from: 1, to: 1.5 },
          duration: 250,
          onComplete: () => puff.destroy()
        });
      }

      // Исчезновение котика и вызов рестарта
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        scaleY: 0.2,
        duration: CONSTANTS.DEATH_ANIM_DURATION_MS,
        onComplete: () => {
          onComplete();
        }
      });
    });
  }

  public enterPortal(portalX: number, portalY: number, onComplete: () => void): void {
    this.isDead = true; // Блокируем дальнейший ввод
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.setAcceleration(0, 0);
    body.setAllowGravity(false);

    AudioManager.getInstance().playSFX('portal');

    // Кот вытягивается в воронку портала
    this.scene.tweens.add({
      targets: this,
      x: portalX,
      y: portalY,
      scaleX: 0.1,
      scaleY: 2.0,
      alpha: 0.3,
      angle: 360,
      duration: 350,
      onComplete: () => {
        this.setVisible(false);
        this.scene.time.delayedCall(150, onComplete);
      }
    });
  }

  public getControlModifier(): ControlModifier {
    return this.controlModifier;
  }

  public setControlModifier(modifier: ControlModifier): void {
    this.controlModifier = modifier;
  }

  public respawn(x: number, y: number, deathsCount?: number): void {
    this.scene.tweens.killTweensOf(this);
    this.isDead = false;
    this.catState = 'idle';
    this.sizeState = 'normal';
    this.gravityState = 'normal';
    this.controlModifier = 'normal';
    this.timeSinceLeftGroundMs = 9999;
    this.timeSinceJumpRequestedMs = 9999;
    this.idleBlinkTimerMs = 0;
    this.isBlinking = false;
    this.isLanding = false;
    this.landingTimerMs = 0;

    this.setPosition(x, y);
    this.setAlpha(1);
    this.setVisible(true);
    this.setAngle(0);
    this.setFlipX(false);
    this.setFlipY(false);

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.enable = true;
      body.setVelocity(0, 0);
      body.setAcceleration(0, 0);
      body.setGravityY(0);
      body.setAllowGravity(true);
    }
    this.updateCollider();
    this.play('cat_idle', true);

    if (deathsCount !== undefined) {
      this.setLevelDeaths(deathsCount);
    }
  }
}
