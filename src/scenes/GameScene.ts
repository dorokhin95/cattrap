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
import { BouncePad } from '../game/hazards/BouncePad';
import { ConveyorTile } from '../game/hazards/ConveyorTile';
import { MovingPlatform } from '../game/hazards/MovingPlatform';
import { PressureButton } from '../game/hazards/PressureButton';
import { ToggleBlock } from '../game/hazards/ToggleBlock';
import { Crusher } from '../game/hazards/Crusher';
import { ControlZone } from '../game/hazards/ControlZone';
import { BackgroundRenderer } from '../game/BackgroundRenderer';
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
  private backgroundRenderer!: BackgroundRenderer;

  // Сущности Главы 2
  private bouncePads: BouncePad[] = [];
  private conveyors: ConveyorTile[] = [];
  private movingPlatforms: MovingPlatform[] = [];
  private buttons: PressureButton[] = [];
  private toggleBlocks: ToggleBlock[] = [];
  private toggleBlocksMap: Map<string, ToggleBlock> = new Map();
  private crushers: Crusher[] = [];
  private controlZones: ControlZone[] = [];
  private chainPopTimers: Phaser.Time.TimerEvent[] = [];

  // Состояние попытки
  private currentRespawnPoint = { x: 0, y: 0 };
  private levelDeaths = 0;
  private attemptTimerSeconds = 0;
  private totalLevelRunTimeSeconds = 0;
  private isTimerRunning = false;
  private isLevelFinished = false;
  private isPaused = false;
  private isDying = false;

  // Отслеживание перехода состояния прыжка
  private prevCombinedJumpDown = false;

  // Именованные обработчики для безопасной отписки на SHUTDOWN
  private boundHandleResize = (gameSize?: Phaser.Structs.Size) => this.handleResize(gameSize);
  private boundPauseRequest = (forceState?: boolean) => this.setPaused(forceState);
  private boundRetryLevel = () => this.instantRestart();

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
    this.totalLevelRunTimeSeconds = 0;
    this.prevCombinedJumpDown = false;
    this.isTimerRunning = false;
    this.isLevelFinished = false;
    this.isPaused = false;
    this.isDying = false;
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
    this.triggerManager = new TriggerManager(this);

    // Создание объектов уровня
    this.buildLevel();

    // Создание котика
    this.currentRespawnPoint = {
      x: (this.levelData.spawn.x + 0.5) * CONSTANTS.TILE_SIZE,
      y: (this.levelData.spawn.y + 0.5) * CONSTANTS.TILE_SIZE
    };
    this.spawnCat();

    // Настройка коллизий (выполняется строго ОДИН раз за уровень)
    this.setupCollisions();

    // Настройка ввода
    this.setupInput();

    // Настройка Telegram BackButton для вызова паузы
    PlatformManager.getInstance().showBackButton(() => {
      this.setPaused();
    });

    // Реакция на изменение ориентации и размера
    this.scale.on('resize', this.boundHandleResize);
    this.handleResize();

    // Слушатели событий UI с именованными ссылками
    this.game.events.on(EVENTS.PAUSE_REQUEST, this.boundPauseRequest);
    this.game.events.on(EVENTS.RETRY_LEVEL, this.boundRetryLevel);

    // Очистка при завершении/перезапуске сцены
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  public shutdown(): void {
    this.scale.off('resize', this.boundHandleResize);
    this.game.events.off(EVENTS.PAUSE_REQUEST, this.boundPauseRequest);
    this.game.events.off(EVENTS.RETRY_LEVEL, this.boundRetryLevel);

    if (this.keyR) this.keyR.removeAllListeners();
    if (this.keyEsc) this.keyEsc.removeAllListeners();

    PlatformManager.getInstance().hideBackButton();

    if (this.triggerManager) {
      this.triggerManager.clear();
    }

    for (const t of this.chainPopTimers) {
      t.remove(false);
    }
    this.chainPopTimers = [];

    if (this.backgroundRenderer) {
      this.backgroundRenderer.destroy();
    }
  }

  private buildLevel(): void {
    const T = CONSTANTS.TILE_SIZE;

    // 0. Фоновый рендерер (Глава 1 или Глава 2 с параллаксом)
    this.backgroundRenderer = new BackgroundRenderer(
      this,
      this.levelData.width,
      this.levelData.height,
      this.levelData.theme,
      this.levelId
    );

    // 1. Твердые блоки
    this.solidGroup = this.physics.add.staticGroup();
    for (const t of this.levelData.solidTiles) {
      if (t.type === 'tunnel_bar') {
        // Низкая каменная балка свода лаза (32x16 px)
        // Занимает верхние 16 px клетки t.y, оставляя снизу 16 px свободного просвета
        const bar = this.solidGroup.create((t.x + 0.5) * T, t.y * T + 8, 'tile_tunnel_bar');
        bar.setSize(32, 16);
        bar.refreshBody();
      } else {
        const tex = t.type === 'paw' ? 'tile_paw' : 'tile_solid';
        const tile = this.solidGroup.create((t.x + 0.5) * T, (t.y + 0.5) * T, tex);
        tile.refreshBody();
      }
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
        const zone = new ModifierZone(this, (mz.x + 0.5) * T, mz.y * T, mz.type);
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

    // 10. Батуты (BouncePad)
    this.bouncePads = [];
    if (this.levelData.bouncePads) {
      for (const bp of this.levelData.bouncePads) {
        const pad = new BouncePad(this, (bp.x + 0.5) * T, (bp.y + 0.5) * T, bp.id, bp.power);
        this.bouncePads.push(pad);
      }
    }

    // 11. Конвейеры (ConveyorTile)
    this.conveyors = [];
    if (this.levelData.conveyors) {
      for (const conv of this.levelData.conveyors) {
        const c = new ConveyorTile(this, (conv.x + 0.5) * T, (conv.y + 0.5) * T, conv.id, conv.direction, conv.speed);
        this.conveyors.push(c);
      }
    }

    // 12. Движущиеся платформы (MovingPlatform)
    this.movingPlatforms = [];
    if (this.levelData.movingPlatforms) {
      for (const mp of this.levelData.movingPlatforms) {
        const p = new MovingPlatform(
          this,
          (mp.x + 0.5) * T,
          (mp.y + 0.5) * T,
          (mp.targetX + 0.5) * T,
          (mp.targetY + 0.5) * T,
          mp.id,
          mp.speed,
          mp.pingPong !== false
        );
        this.movingPlatforms.push(p);
      }
    }

    // 13. Переключаемые блоки (ToggleBlock)
    this.toggleBlocks = [];
    this.toggleBlocksMap.clear();
    if (this.levelData.toggleBlocks) {
      for (const tb of this.levelData.toggleBlocks) {
        const block = new ToggleBlock(this, (tb.x + 0.5) * T, (tb.y + 0.5) * T, tb.id, tb.initiallyActive !== false);
        this.toggleBlocks.push(block);
        if (tb.id) {
          this.toggleBlocksMap.set(tb.id, block);
        }
      }
    }

    // 14. Нажимные кнопки (PressureButton)
    this.buttons = [];
    if (this.levelData.buttons) {
      for (const btn of this.levelData.buttons) {
        const b = new PressureButton(this, (btn.x + 0.5) * T, (btn.y + 0.5) * T, btn.id, btn.targets, btn.once);
        this.buttons.push(b);
      }
    }

    // 15. Прессы (Crusher)
    this.crushers = [];
    if (this.levelData.crushers) {
      for (const cr of this.levelData.crushers) {
        const targetX = cr.targetX !== undefined ? (cr.targetX + 0.5) * T : (cr.x + 0.5) * T;
        const targetY = cr.targetY !== undefined ? (cr.targetY + 0.5) * T : (cr.y + 2.5) * T;
        const c = new Crusher(
          this,
          (cr.x + 0.5) * T,
          (cr.y + 0.5) * T,
          targetX,
          targetY,
          cr.orientation,
          cr.id,
          cr.warningMs,
          cr.slamMs,
          cr.holdMs,
          cr.retractMs,
          cr.cycle !== false,
          cr.startDelayMs
        );
        this.crushers.push(c);
      }
    }

    // 16. Зоны модификатора управления (ControlZone)
    this.controlZones = [];
    if (this.levelData.controlZones) {
      for (const cz of this.levelData.controlZones) {
        const heightTiles = cz.height || 2;
        const zone = new ControlZone(
          this,
          (cz.x + cz.width / 2) * T,
          (cz.y + heightTiles / 2) * T,
          cz.width * T,
          heightTiles * T,
          cz.type,
          cz.id
        );
        this.controlZones.push(zone);
      }
    }

    // 17. Регистрация триггеров уровня
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
        once: trig.once !== false,
        resetOnDeath: trig.resetOnDeath !== false
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
    } else if (action === 'chain_pop') {
      const matchingSpikes: PopSpike[] = [];
      (this.levelData.popSpikes || []).forEach((ps, idx) => {
        if (ps.id === targetId || ps.id.startsWith(targetId)) {
          matchingSpikes.push(this.popSpikes[idx]);
        }
      });
      matchingSpikes.forEach((spike, idx) => {
        const timer = this.time.delayedCall(idx * 120, () => {
          spike?.pop();
        });
        this.chainPopTimers.push(timer);
      });
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

    // Кот <-> Выдвижные шипы (основание твердое, а шип смертельный)
    for (const ps of this.popSpikes) {
      this.physics.add.collider(this.cat, ps);
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

    // --- Коллизии Главы 2 ---

    // Кот <-> Батуты (BouncePad)
    for (const bp of this.bouncePads) {
      this.physics.add.collider(this.cat, bp, () => {
        bp.triggerBounce(this.cat);
      });
    }

    // Кот <-> Конвейеры (ConveyorTile)
    for (const conv of this.conveyors) {
      this.physics.add.collider(this.cat, conv);
    }

    // Кот <-> Движущиеся платформы (MovingPlatform)
    for (const mp of this.movingPlatforms) {
      this.physics.add.collider(this.cat, mp, () => {
        const catBody = this.cat.body as Phaser.Physics.Arcade.Body;
        const mpBody = mp.body as Phaser.Physics.Arcade.Body;
        if (catBody && mpBody && catBody.touching.down && mpBody.touching.up) {
          mp.setRiderContact(true);
        }
      });
    }

    // Кот <-> Переключаемые блоки (ToggleBlock)
    for (const tb of this.toggleBlocks) {
      this.physics.add.collider(this.cat, tb);
    }

    // Кот <-> Нажимные кнопки (PressureButton)
    for (const btn of this.buttons) {
      this.physics.add.overlap(this.cat, btn, () => {
        btn.press(this.toggleBlocksMap, this.cat);
      });
    }

    // Кот <-> Прессы (Crusher)
    for (const crusher of this.crushers) {
      this.physics.add.overlap(this.cat, crusher, () => {
        if (crusher.isLethal) {
          this.handlePlayerDeath();
        }
      });
    }

    // Кот <-> Зоны управления (ControlZone)
    for (const cz of this.controlZones) {
      this.physics.add.overlap(this.cat, cz, () => {
        cz.applyModifier(this.cat);
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
    if (this.isPaused || this.isLevelFinished || this.isDying) return;

    // Считываем клавиатурный ввод
    const keyLeft = (this.cursors?.left?.isDown || this.keyA?.isDown) ?? false;
    const keyRight = (this.cursors?.right?.isDown || this.keyD?.isDown) ?? false;
    const keyJumpDown = (this.cursors?.up?.isDown || this.cursors?.space?.isDown || this.keyW?.isDown) ?? false;

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

    // Честный расчёт переходов нажатия/отпускания из объединенного состояния
    const currentJumpDown = keyJumpDown || touchInput.jumpDown;
    const jumpPressed = !this.prevCombinedJumpDown && currentJumpDown;
    const jumpReleased = this.prevCombinedJumpDown && !currentJumpDown;
    this.prevCombinedJumpDown = currentJumpDown;

    const combinedInput: CatInputState = {
      left: keyLeft || touchInput.left,
      right: keyRight || touchInput.right,
      jumpDown: currentJumpDown,
      jumpPressed: jumpPressed,
      jumpReleased: jumpReleased
    };

    // Старт таймера попытки с первого ввода игрока (ТЗ пункт 64)
    if (!this.isTimerRunning && (combinedInput.left || combinedInput.right || combinedInput.jumpPressed)) {
      this.isTimerRunning = true;
      this.game.events.emit(EVENTS.FIRST_INPUT);
    }

    if (this.isTimerRunning) {
      this.attemptTimerSeconds += delta / 1000;
      this.totalLevelRunTimeSeconds += delta / 1000;
      this.game.events.emit(EVENTS.UPDATE_TIMER, this.attemptTimerSeconds);
    }

    // Обновление батутов
    for (const bp of this.bouncePads) {
      bp.updatePad(delta);
    }

    // Обновление конвейеров: находим ближайший конвейер непосредственно под ногами котика
    let activeConv: ConveyorTile | null = null;
    let minConvDist = 9999;
    for (const conv of this.conveyors) {
      if (conv.isCatStandingOn(this.cat)) {
        const dist = Math.abs(this.cat.x - conv.x);
        if (dist < minConvDist) {
          minConvDist = dist;
          activeConv = conv;
        }
      }
    }
    if (activeConv) {
      activeConv.applyConveyorMotion(this.cat, delta);
    }

    // Обновление движущихся платформ
    for (const mp of this.movingPlatforms) {
      mp.updatePlatform(delta, this.cat);
    }

    // Обновление котика
    this.cat.updateCat(delta, combinedInput);

    // Завершение кадра для кнопок (сброс флагов текущего контакта enter-edge)
    for (const btn of this.buttons) {
      btn.endFrame();
    }

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
    if (this.isLevelFinished || this.isDying) return;
    this.isDying = true;

    this.levelDeaths++;
    SaveProvider.getInstance().recordDeath(this.levelId);
    PlatformManager.getInstance().haptic('medium');

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
    this.isDying = false;

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
    for (const bp of this.bouncePads) bp.reset();
    for (const conv of this.conveyors) conv.reset();
    for (const mp of this.movingPlatforms) mp.reset();
    for (const btn of this.buttons) btn.reset();
    for (const tb of this.toggleBlocks) tb.reset();
    for (const cr of this.crushers) cr.reset();
    for (const cz of this.controlZones) cz.reset();
    this.portal.reset();

    for (const t of this.chainPopTimers) {
      t.remove(false);
    }
    this.chainPopTimers = [];

    // Сброс зажатых сенсорных кнопок (ТЗ раздел 24)
    this.game.events.emit(EVENTS.LEVEL_RESTART);

    // Переиспользование котика на текущей точке спауна (или активном чекпоинте)
    // без повторного добавления коллайдеров в физический мир
    this.cat.respawn(this.currentRespawnPoint.x, this.currentRespawnPoint.y, this.levelDeaths);
  }

  private handleLevelComplete(): void {
    if (this.isLevelFinished) return;
    this.isLevelFinished = true;

    // Если портал шуточный (уровень 9), запускаем троллинг-сжатие
    if (this.levelData.portal.isTrollPortal) {
      this.portal.triggerTrollSqueeze();
    }

    // Для сохранения рекорда уровня используем честное суммарное время забега
    const finalRunTime = this.totalLevelRunTimeSeconds > 0 ? this.totalLevelRunTimeSeconds : this.attemptTimerSeconds;
    SaveProvider.getInstance().recordLevelCompletion(this.levelId, finalRunTime);
    PlatformManager.getInstance().haptic('success');

    this.cat.enterPortal(this.portal.x, this.portal.y, () => {
      if (this.levelData.isChapterEnd || this.levelId >= LevelRegistry.getTotalLevels()) {
        // Завершение Главы!
        this.game.events.emit(EVENTS.CHAPTER_COMPLETE, {
          chapter: this.levelData.chapter || 1,
          isFinalChapter: this.levelId >= LevelRegistry.getTotalLevels(),
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
      this.time.paused = true;
      this.tweens.pauseAll();
      this.anims.pauseAll();
    } else {
      this.physics.resume();
      this.time.paused = false;
      this.tweens.resumeAll();
      this.anims.resumeAll();
    }
    this.game.events.emit(EVENTS.PAUSE_STATE_CHANGED, this.isPaused);
  }

  private handleResize(gameSize?: Phaser.Structs.Size): void {
    const width = gameSize ? gameSize.width : this.scale.gameSize.width;
    const height = gameSize ? gameSize.height : this.scale.gameSize.height;

    this.cameras.main.setViewport(0, 0, width, height);
    this.cameras.main.setSize(width, height);

    // Вычисляем mode прямо из известных w/h — НЕ из window.innerWidth (может быть устаревшим)
    const aspect = width / (height || 1);
    const mode = aspect < 0.85 ? 'portrait' : aspect <= 1.15 ? 'compact' : 'landscape';

    this.cameraSystem.updateViewport(mode, width, height);
  }
}
