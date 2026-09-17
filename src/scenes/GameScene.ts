import Phaser from 'phaser';
import { CONSTANTS } from '../core/Constants';
import { EVENTS } from '../core/Events';
import { LevelData } from '../game/levels/LevelData';
import { LevelRegistry } from '../game/levels/LevelRegistry';
import { Cat, CatInputState } from '../game/entities/Cat';
import { CameraSystem } from '../game/CameraSystem';
import { TriggerManager } from '../game/triggers/TriggerManager';
import { StaticSpike } from '../game/hazards/StaticSpike';
import { PopSpike } from '../game/hazards/PopSpike';
import { CrumbleBlock } from '../game/hazards/CrumbleBlock';
import { FallingBlock } from '../game/hazards/FallingBlock';
import { FakeFloor } from '../game/hazards/FakeFloor';
import { MovingPortal } from '../game/hazards/MovingPortal';
import { ModifierZone } from '../game/hazards/ModifierZone';
import { Checkpoint } from '../game/hazards/Checkpoint';
import { SaveProvider } from '../save/SaveProvider';
import { PlatformManager } from '../platform/PlatformManager';

export class GameScene extends Phaser.Scene {
  private levelId = 1;
  private levelData!: LevelData;

  private cat!: Cat;
  private cameraSystem!: CameraSystem;
  private triggerManager!: TriggerManager;

  // Группы физики
  private solidGroup!: Phaser.Physics.Arcade.StaticGroup;
  private staticSpikesGroup!: Phaser.Physics.Arcade.Group;
  private popSpikes: PopSpike[] = [];
  private crumbleBlocks: CrumbleBlock[] = [];
  private fallingBlocks: FallingBlock[] = [];
  private fakeFloors: FakeFloor[] = [];
  private modifierZones: ModifierZone[] = [];
  private portal!: MovingPortal;
  private checkpoint: Checkpoint | null = null;

  // Состояние попытки
  private currentRespawnPoint = { x: 0, y: 0 };
  private levelDeaths = 0;
  private attemptTimerSeconds = 0;
  private isTimerRunning = false;
  private isLevelFinished = false;
  private isPaused = false;

  // Клавиатурный ввод
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyR!: Phaser.Input.Keyboard.Key;
  private keyEsc!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'GameScene' });
  }

  public init(data: { level?: number }): void {
    this.levelId = data.level || 1;
    this.levelDeaths = 0;
    this.attemptTimerSeconds = 0;
    this.isTimerRunning = false;
    this.isLevelFinished = false;
    this.isPaused = false;
  }

  public create(): void {
    const data = LevelRegistry.getLevel(this.levelId);
    if (!data) {
      console.error(`Уровень ${this.levelId} не найден!`);
      this.scene.start('LevelSelectScene');
      return;
    }
    this.levelData = data;

    // Настраиваем физический мир с фиксированным шагом 60 Гц
    this.physics.world.gravity.y = CONSTANTS.GRAVITY;

    // Запуск UIScene параллельно поверх GameScene
    if (!this.scene.isActive('UIScene')) {
      this.scene.launch('UIScene', { levelId: this.levelId, levelName: this.levelData.name });
    } else {
      this.game.events.emit(EVENTS.LEVEL_START, {
        levelId: this.levelId,
        levelName: this.levelData.name
      });
    }

    // Инициализация систем
    this.cameraSystem = new CameraSystem(this.cameras.main);
    this.cameraSystem.setLevelBounds(this.levelData.width, this.levelData.height);
    this.triggerManager = new TriggerManager();

    // Создание объектов уровня
    this.buildLevel();

    // Создание котика
    this.currentRespawnPoint = {
      x: (this.levelData.spawn.x + 0.5) * CONSTANTS.TILE_SIZE,
      y: (this.levelData.spawn.y + 0.5) * CONSTANTS.TILE_SIZE
    };
    this.spawnCat();

    // Настройка коллизий
    this.setupCollisions();

    // Настройка ввода
    this.setupInput();

    // Настройка Telegram BackButton для вызова паузы
    PlatformManager.getInstance().getPlatform().showBackButton(() => {
      this.setPaused();
    });

    // Реакция на изменение ориентации и размера
    this.scale.on('resize', this.handleResize, this);
    this.handleResize();

    // Слушатели событий UI
    this.game.events.on(EVENTS.PAUSE_REQUEST, (forceState?: boolean) => this.setPaused(forceState), this);
    this.game.events.on(EVENTS.RETRY_LEVEL, this.instantRestart, this);
  }

  private buildLevel(): void {
    const T = CONSTANTS.TILE_SIZE;

    // 1. Твердые блоки
    this.solidGroup = this.physics.add.staticGroup();
    for (const t of this.levelData.solidTiles) {
      const tex = t.type === 'paw' ? 'tile_paw' : 'tile_solid';
      const tile = this.solidGroup.create((t.x + 0.5) * T, (t.y + 0.5) * T, tex);
      tile.refreshBody();
    }

    // 2. Статические шипы
    this.staticSpikesGroup = this.physics.add.group();
    if (this.levelData.staticSpikes) {
      for (const s of this.levelData.staticSpikes) {
        const spike = new StaticSpike(this, (s.x + 0.5) * T, (s.y + 0.5) * T, s.upsideDown);
        this.staticSpikesGroup.add(spike);
      }
    }

    // 3. Выдвижные шипы (Pop Spikes)
    this.popSpikes = [];
    if (this.levelData.popSpikes) {
      for (const ps of this.levelData.popSpikes) {
        const spike = new PopSpike(this, (ps.x + 0.5) * T, (ps.y + 0.5) * T);
        this.popSpikes.push(spike);
      }
    }

    // 4. Осыпающиеся блоки (Crumble)
    this.crumbleBlocks = [];
    if (this.levelData.crumbleBlocks) {
      for (const cb of this.levelData.crumbleBlocks) {
        const block = new CrumbleBlock(this, (cb.x + 0.5) * T, (cb.y + 0.5) * T);
        this.crumbleBlocks.push(block);
      }
    }

    // 5. Падающие потолочные блоки
    this.fallingBlocks = [];
    if (this.levelData.fallingBlocks) {
      for (const fb of this.levelData.fallingBlocks) {
        const block = new FallingBlock(
          this,
          (fb.x + 1) * T,
          (fb.y + 1) * T,
          (fb.landingY + 1) * T
        );
        this.fallingBlocks.push(block);
      }
    }

    // 6. Обманный пол (Fake Floor)
    this.fakeFloors = [];
    if (this.levelData.fakeFloors) {
      for (const ff of this.levelData.fakeFloors) {
        const floor = new FakeFloor(this, (ff.x + 0.5) * T, (ff.y + 0.5) * T);
        this.fakeFloors.push(floor);
      }
    }

    // 7. Зоны модификаторов (Размер / Гравитация)
    this.modifierZones = [];
    if (this.levelData.modifierZones) {
      for (const mz of this.levelData.modifierZones) {
        const zone = new ModifierZone(this, (mz.x + 0.5) * T, (mz.y + 1.0) * T, mz.type);
        this.modifierZones.push(zone);
      }
    }

    // 8. Чекпоинт
    if (this.levelData.checkpoint) {
      this.checkpoint = new Checkpoint(
        this,
        (this.levelData.checkpoint.x + 0.5) * T,
        (this.levelData.checkpoint.y + 0.5) * T
      );
    }

    // 9. Портал
    const pTargets = (this.levelData.portal.targets || []).map(pt => ({
      x: (pt.x + 0.5) * T,
      y: (pt.y + 0.5) * T
    }));
    this.portal = new MovingPortal(
      this,
      (this.levelData.portal.x + 0.5) * T,
      (this.levelData.portal.y + 0.5) * T,
      pTargets
    );

    // 10. Регистрация триггеров уровня
    this.registerTriggers();
  }

  private registerTriggers(): void {
    for (const trig of this.levelData.triggers) {
      this.triggerManager.addTrigger({
        id: trig.id,
        condition: {
          type: trig.conditionType,
          value: trig.conditionValue
        },
        action: () => {
          this.executeTriggerAction(trig.targetId, trig.action);
        },
        delayMs: trig.delayMs,
        once: trig.once !== false
      });
    }
  }

  private executeTriggerAction(targetId: string, action: string): void {
    if (action === 'pop') {
      const spike = this.popSpikes.find((_, i) => this.levelData.popSpikes?.[i]?.id === targetId);
      if (spike) spike.pop();
    } else if (action === 'drop') {
      const fb = this.fallingBlocks.find((_, i) => this.levelData.fallingBlocks?.[i]?.id === targetId);
      if (fb) fb.triggerDrop();
    } else if (action === 'collapse') {
      const ff = this.fakeFloors.find((_, i) => this.levelData.fakeFloors?.[i]?.id === targetId);
      if (ff) ff.triggerCollapse();
    } else if (action === 'move_portal') {
      this.portal.advanceToNextTarget();
    }
  }

  private spawnCat(): void {
    if (this.cat) {
      this.cat.destroy();
    }
    this.cat = new Cat(this, this.currentRespawnPoint.x, this.currentRespawnPoint.y);
    this.cat.setLevelDeaths(this.levelDeaths);
  }

  private setupCollisions(): void {
    // Кот <-> Твердые блоки
    this.physics.add.collider(this.cat, this.solidGroup);

    // Кот <-> Осыпающиеся блоки (при касании запускается процесс обрушения)
    for (const crumble of this.crumbleBlocks) {
      this.physics.add.collider(this.cat, crumble, () => {
        crumble.triggerCollapse();
      });
    }

    // Кот <-> Обманный пол (при касании начинает опускаться)
    for (const fake of this.fakeFloors) {
      this.physics.add.collider(this.cat, fake, () => {
        fake.triggerCollapse();
      });
    }

    // Кот <-> Падающий блок (если приземлился — становится платформой)
    for (const fb of this.fallingBlocks) {
      this.physics.add.collider(this.cat, fb, () => {
        // Если блок ещё падает и находится выше кота — летальный исход
        if (!fb.getIsLanded() && fb.y < this.cat.y - 10) {
          this.handlePlayerDeath();
        }
      });
    }

    // Кот <-> Статические шипы (летальный исход)
    this.physics.add.overlap(this.cat, this.staticSpikesGroup, () => {
      this.handlePlayerDeath();
    });

    // Кот <-> Выдвижные шипы
    for (const ps of this.popSpikes) {
      this.physics.add.overlap(this.cat, ps.getSpikeColliderSprite(), () => {
        this.handlePlayerDeath();
      });
    }

    // Кот <-> Зоны модификаторов (уменьшение / гравитация)
    for (const mz of this.modifierZones) {
      this.physics.add.overlap(this.cat, mz, () => {
        if (mz.modifierType === 'shrink') {
          this.cat.setSizeModifier('small');
        } else if (mz.modifierType === 'restore_size') {
          this.cat.setSizeModifier('normal');
        } else if (mz.modifierType === 'gravity_invert') {
          this.cat.setGravityModifier('inverted');
        } else if (mz.modifierType === 'gravity_normal') {
          this.cat.setGravityModifier('normal');
        }
      });
    }

    // Кот <-> Чекпоинт
    if (this.checkpoint) {
      this.physics.add.overlap(this.cat, this.checkpoint, () => {
        if (this.checkpoint!.activate()) {
          this.currentRespawnPoint = {
            x: this.checkpoint!.x,
            y: this.checkpoint!.y
          };
          this.game.events.emit(EVENTS.CHECKPOINT_REACHED);
        }
      });
    }

    // Кот <-> Портал (финиш уровня)
    this.physics.add.overlap(this.cat, this.portal, () => {
      this.handleLevelComplete();
    });
  }

  private setupInput(): void {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
      this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

      this.keyR.on('down', () => this.instantRestart());
      this.keyEsc.on('down', () => this.setPaused());
    }
  }

  public update(_time: number, delta: number): void {
    if (this.isPaused || this.isLevelFinished) return;

    // Считываем клавиатурный ввод
    const keyLeft = (this.cursors?.left?.isDown || this.keyA?.isDown) ?? false;
    const keyRight = (this.cursors?.right?.isDown || this.keyD?.isDown) ?? false;
    const keyJumpDown = (this.cursors?.up?.isDown || this.cursors?.space?.isDown || this.keyW?.isDown) ?? false;
    const keyJumpPressed = (
      Phaser.Input.Keyboard.JustDown(this.cursors?.up) ||
      Phaser.Input.Keyboard.JustDown(this.cursors?.space) ||
      Phaser.Input.Keyboard.JustDown(this.keyW)
    ) ?? false;
    const keyJumpReleased = (
      Phaser.Input.Keyboard.JustUp(this.cursors?.up) ||
      Phaser.Input.Keyboard.JustUp(this.cursors?.space) ||
      Phaser.Input.Keyboard.JustUp(this.keyW)
    ) ?? false;

    // Считываем сенсорный ввод из UIScene
    const uiScene = this.scene.get('UIScene') as unknown as {
      getTouchInput?: () => {
        left: boolean;
        right: boolean;
        jumpDown: boolean;
        jumpPressed: boolean;
        jumpReleased: boolean;
      };
    };
    const touchInput = uiScene?.getTouchInput ? uiScene.getTouchInput() : {
      left: false, right: false, jumpDown: false, jumpPressed: false, jumpReleased: false
    };

    const combinedInput: CatInputState = {
      left: keyLeft || touchInput.left,
      right: keyRight || touchInput.right,
      jumpDown: keyJumpDown || touchInput.jumpDown,
      jumpPressed: keyJumpPressed || touchInput.jumpPressed,
      jumpReleased: keyJumpReleased || touchInput.jumpReleased
    };

    // Старт таймера попытки с первого ввода игрока (ТЗ пункт 64)
    if (!this.isTimerRunning && (combinedInput.left || combinedInput.right || combinedInput.jumpPressed)) {
      this.isTimerRunning = true;
      this.game.events.emit(EVENTS.FIRST_INPUT);
    }

    if (this.isTimerRunning) {
      this.attemptTimerSeconds += delta / 1000;
      this.game.events.emit(EVENTS.UPDATE_TIMER, this.attemptTimerSeconds);
    }

    // Обновление котика
    this.cat.updateCat(delta, combinedInput);

    // Падение за пределы уровня (смерть в пропасти)
    const deadzoneY = (this.levelData.height + 2) * CONSTANTS.TILE_SIZE;
    if (this.cat.y > deadzoneY || this.cat.y < -64) {
      this.handlePlayerDeath();
    }

    // Проверка детерминированных триггеров
    const portalDist = Phaser.Math.Distance.Between(this.cat.x, this.cat.y, this.portal.x, this.portal.y);
    this.triggerManager.checkTriggers(this.cat.x, this.cat.y, portalDist);

    // Обновление камеры с адаптивным look-ahead
    const body = this.cat.body as Phaser.Physics.Arcade.Body;
    this.cameraSystem.update(this.cat.x, this.cat.y, body ? body.velocity.x : 0, delta);
  }

  private handlePlayerDeath(): void {
    if (this.isLevelFinished) return;
    this.levelDeaths++;
    SaveProvider.getInstance().recordDeath(this.levelId);
    PlatformManager.getInstance().getPlatform().haptic('medium');

    // Экранная тряска при смерти (1-2px / 80-120ms)
    if (SaveProvider.getInstance().getSettings().screenShake) {
      this.cameras.main.shake(100, 0.004);
    }

    this.game.events.emit(EVENTS.PLAYER_DEATH, this.levelDeaths);

    // Рестарт менее чем за 400 мс (ТЗ пункт 23)
    this.cat.die(() => {
      this.instantRestart();
    });
  }

  public instantRestart(): void {
    // Сброс таймера текущей попытки (ТЗ пункт 64)
    this.attemptTimerSeconds = 0;
    this.isTimerRunning = false;
    this.game.events.emit(EVENTS.UPDATE_TIMER, 0);

    // Сброс триггеров и интерактивных ловушек
    this.triggerManager.reset();
    for (const spike of this.popSpikes) spike.reset();
    for (const crumble of this.crumbleBlocks) crumble.reset();
    for (const fb of this.fallingBlocks) fb.reset();
    for (const fake of this.fakeFloors) fake.reset();
    this.portal.reset();

    // Сброс зажатых сенсорных кнопок (ТЗ раздел 24)
    this.game.events.emit(EVENTS.LEVEL_RESTART);

    // Пересоздание котика на текущей точке спауна (или активном чекпоинте)
    this.spawnCat();
    this.setupCollisions();
  }

  private handleLevelComplete(): void {
    if (this.isLevelFinished) return;
    this.isLevelFinished = true;

    // Если портал шуточный (уровень 9), запускаем троллинг-сжатие
    if (this.levelData.portal.isTrollPortal) {
      this.portal.triggerTrollSqueeze();
    }

    SaveProvider.getInstance().recordLevelCompletion(this.levelId, this.attemptTimerSeconds);
    PlatformManager.getInstance().getPlatform().haptic('success');

    this.cat.enterPortal(this.portal.x, this.portal.y, () => {
      if (this.levelId >= LevelRegistry.getTotalLevels()) {
        // Завершение Главы 1!
        this.game.events.emit(EVENTS.CHAPTER_COMPLETE, {
          totalDeaths: SaveProvider.getInstance().getData().totalDeaths,
          bestTimes: SaveProvider.getInstance().getData().bestTimes
        });
      } else {
        // Автоматический переход к следующему уровню за 400-600 мс (ТЗ пункт 29)
        this.scene.restart({ level: this.levelId + 1 });
      }
    });
  }

  private setPaused(forceState?: boolean): void {
    this.isPaused = forceState !== undefined ? forceState : !this.isPaused;
    if (this.isPaused) {
      this.physics.pause();
    } else {
      this.physics.resume();
    }
    this.game.events.emit(EVENTS.PAUSE_STATE_CHANGED, this.isPaused);
  }

  private handleResize(): void {
    const vp = PlatformManager.getInstance().getPlatform().getViewport();
    this.cameraSystem.updateViewport(vp.mode, vp.width, vp.height);
  }
}
