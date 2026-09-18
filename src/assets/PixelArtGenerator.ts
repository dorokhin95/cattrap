import Phaser from 'phaser';
import { CONSTANTS } from '../core/Constants';

export class PixelArtGenerator {
  public static generateAll(scene: Phaser.Scene): void {
    PixelArtGenerator.generateCatSpritesheet(scene);
    PixelArtGenerator.generateTiles(scene);
    PixelArtGenerator.generateHazards(scene);
    PixelArtGenerator.generateObjects(scene);
    PixelArtGenerator.generateParticles(scene);
    PixelArtGenerator.generateChapter2(scene);
    PixelArtGenerator.generateChapter3(scene);
    PixelArtGenerator.generateChapter4(scene);
  }

  // --- КОТИК: Спрайтшит 24x24 px ---
  private static generateCatSpritesheet(scene: Phaser.Scene): void {
    const frameW = CONSTANTS.CAT_SPRITE_SIZE; // 24
    const frameH = CONSTANTS.CAT_SPRITE_SIZE; // 24
    const totalFrames = 12; // 0-1: idle, 2: blink, 3-6: run, 7: jump, 8: fall, 9: land, 10: death1, 11: death2

    const canvas = document.createElement('canvas');
    canvas.width = frameW * totalFrames;
    canvas.height = frameH;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    for (let f = 0; f < totalFrames; f++) {
      const ox = f * frameW;
      PixelArtGenerator.drawCatFrame(ctx, ox, 0, f);
    }

    if (scene.textures.exists('cat')) {
      scene.textures.remove('cat');
    }
    scene.textures.addSpriteSheet('cat', canvas as unknown as HTMLImageElement, {
      frameWidth: frameW,
      frameHeight: frameH
    });
  }

  private static drawCatFrame(ctx: CanvasRenderingContext2D, ox: number, oy: number, frame: number): void {
    const C = CONSTANTS.COLORS;

    // Смещение по высоте для разных анимаций
    let bobY = 0;
    if (frame === 1) bobY = 1; // Idle дышит
    if (frame === 4 || frame === 6) bobY = -1; // Run подпрыгивает
    if (frame === 9) bobY = 2; // Landing squash

    // 1. Хвост-вопросительный знак (сзади котика, слева при взгляде направо)
    ctx.fillStyle = C.CAT_DARK; // Контур хвоста
    ctx.fillRect(ox + 2, oy + 12 + bobY, 4, 2);
    ctx.fillRect(ox + 2, oy + 13 + bobY, 2, 5);
    ctx.fillRect(ox + 3, oy + 17 + bobY, 4, 2);
    // Кончик хвоста тёмный
    ctx.fillStyle = '#1e1b24';
    ctx.fillRect(ox + 5, oy + 12 + bobY, 2, 2);

    // Заливка хвоста
    ctx.fillStyle = C.CAT_BODY;
    ctx.fillRect(ox + 3, oy + 13 + bobY, 2, 4);

    // 2. Ушки с выемкой на левом
    ctx.fillStyle = C.CAT_DARK;
    // Левое ухо с выемкой
    ctx.fillRect(ox + 6, oy + 2 + bobY, 3, 5);
    ctx.fillRect(ox + 7, oy + 1 + bobY, 2, 2);
    // Выемка
    ctx.clearRect(ox + 6, oy + 3 + bobY, 1, 1);

    // Правое ухо
    ctx.fillRect(ox + 15, oy + 2 + bobY, 3, 5);
    ctx.fillRect(ox + 15, oy + 1 + bobY, 2, 2);

    // Розовая внутренняя часть ушек
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(ox + 7, oy + 3 + bobY, 1, 2);
    ctx.fillRect(ox + 16, oy + 3 + bobY, 1, 2);

    // 3. Голова (крупная, узнаваемая)
    ctx.fillStyle = C.CAT_DARK; // Контур головы
    ctx.fillRect(ox + 5, oy + 5 + bobY, 14, 8);
    ctx.fillRect(ox + 6, oy + 4 + bobY, 12, 10);

    ctx.fillStyle = C.CAT_BODY; // Основной тёплый рыжий цвет
    ctx.fillRect(ox + 6, oy + 5 + bobY, 12, 8);
    ctx.fillStyle = C.CAT_LIGHT; // Светлый блик на макушке
    ctx.fillRect(ox + 8, oy + 5 + bobY, 8, 2);

    // 4. Глаза
    if (frame === 2) {
      // Моргание (закрытые глазки-чёрточки)
      ctx.fillStyle = C.CAT_EYE;
      ctx.fillRect(ox + 7, oy + 9 + bobY, 3, 1);
      ctx.fillRect(ox + 14, oy + 9 + bobY, 3, 1);
    } else if (frame === 10 || frame === 11) {
      // Испуганные круглые глаза при гибели
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ox + 6, oy + 7 + bobY, 5, 5);
      ctx.fillRect(ox + 13, oy + 7 + bobY, 5, 5);
      ctx.fillStyle = C.CAT_EYE;
      ctx.fillRect(ox + 8, oy + 8 + bobY, 2, 3);
      ctx.fillRect(ox + 14, oy + 8 + bobY, 2, 3);
    } else {
      // Большие тёмные выразительные глаза
      ctx.fillStyle = C.CAT_EYE;
      ctx.fillRect(ox + 7, oy + 8 + bobY, 3, 3);
      ctx.fillRect(ox + 14, oy + 8 + bobY, 3, 3);
      // Белый блик
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ox + 7, oy + 8 + bobY, 1, 1);
      ctx.fillRect(ox + 14, oy + 8 + bobY, 1, 1);
    }

    // 5. Мордочка
    ctx.fillStyle = C.CAT_MUZZLE;
    ctx.fillRect(ox + 10, oy + 10 + bobY, 4, 3);
    // Носик
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(ox + 11, oy + 10 + bobY, 2, 1);

    // 6. Ошейник
    ctx.fillStyle = C.CAT_COLLAR;
    ctx.fillRect(ox + 7, oy + 13 + bobY, 10, 2);
    // Бубенчик/медальончик
    ctx.fillStyle = '#facc15';
    ctx.fillRect(ox + 11, oy + 14 + bobY, 2, 2);

    // 7. Туловище
    ctx.fillStyle = C.CAT_DARK;
    ctx.fillRect(ox + 7, oy + 15 + bobY, 10, 5);
    ctx.fillStyle = C.CAT_BODY;
    ctx.fillRect(ox + 8, oy + 15 + bobY, 8, 4);
    // Белая грудка
    ctx.fillStyle = C.CAT_MUZZLE;
    ctx.fillRect(ox + 10, oy + 15 + bobY, 4, 3);

    // 8. Лапки (в зависимости от кадра бега)
    ctx.fillStyle = C.CAT_DARK;
    if (frame >= 3 && frame <= 6) {
      // Бег: лапки перебирают
      const runStep = frame - 3;
      if (runStep === 0) {
        ctx.fillRect(ox + 7, oy + 19, 2, 3);
        ctx.fillRect(ox + 15, oy + 18, 2, 3);
      } else if (runStep === 1) {
        ctx.fillRect(ox + 9, oy + 18, 2, 3);
        ctx.fillRect(ox + 13, oy + 19, 2, 3);
      } else if (runStep === 2) {
        ctx.fillRect(ox + 11, oy + 19, 2, 3);
        ctx.fillRect(ox + 15, oy + 19, 2, 3);
      } else {
        ctx.fillRect(ox + 7, oy + 18, 2, 3);
        ctx.fillRect(ox + 13, oy + 18, 2, 3);
      }
    } else if (frame === 7) {
      // Jump: лапки подобраны
      ctx.fillRect(ox + 8, oy + 18, 2, 2);
      ctx.fillRect(ox + 14, oy + 18, 2, 2);
    } else if (frame === 8) {
      // Fall: лапки расставлены в стороны
      ctx.fillRect(ox + 6, oy + 19, 3, 2);
      ctx.fillRect(ox + 15, oy + 19, 3, 2);
    } else if (frame === 9) {
      // Landing: сплюснутые лапки
      ctx.fillRect(ox + 6, oy + 20, 4, 2);
      ctx.fillRect(ox + 14, oy + 20, 4, 2);
    } else {
      // Idle: стоячие лапки
      ctx.fillRect(ox + 8, oy + 19 + bobY, 2, 3);
      ctx.fillRect(ox + 14, oy + 19 + bobY, 2, 3);
    }
  }

  // --- ТАЙЛЫ ОКРУЖЕНИЯ: 32x32 px ---
  private static generateTiles(scene: Phaser.Scene): void {
    const size = CONSTANTS.TILE_SIZE;
    const C = CONSTANTS.COLORS;

    // 1. Твердая безопасная платформа (solid_block)
    const solidCanvas = document.createElement('canvas');
    solidCanvas.width = size;
    solidCanvas.height = size;
    const sctx = solidCanvas.getContext('2d')!;
    sctx.fillStyle = C.PLATFORM_OUTLINE;
    sctx.fillRect(0, 0, size, size);
    sctx.fillStyle = C.PLATFORM_DARK;
    sctx.fillRect(1, 1, size - 2, size - 2);
    // Светлая верхняя грань платформы для четкой читаемости пола
    sctx.fillStyle = C.PLATFORM_LIGHT;
    sctx.fillRect(1, 1, size - 2, 3);
    // Текстурный микропаттерн плитки
    sctx.fillStyle = C.PLATFORM_OUTLINE;
    sctx.fillRect(0, size - 1, size, 1);
    sctx.fillRect(size - 1, 0, 1, size);
    scene.textures.addCanvas('tile_solid', solidCanvas);

    // 2. Осыпающийся блок (crumble_block) — идентичный базовый фон с трещиной
    const crumbleCanvas = document.createElement('canvas');
    crumbleCanvas.width = size;
    crumbleCanvas.height = size;
    const cctx = crumbleCanvas.getContext('2d')!;
    cctx.fillStyle = C.PLATFORM_OUTLINE;
    cctx.fillRect(0, 0, size, size);
    cctx.fillStyle = C.PLATFORM_DARK;
    cctx.fillRect(1, 1, size - 2, size - 2);
    cctx.fillStyle = C.PLATFORM_LIGHT;
    cctx.fillRect(1, 1, size - 2, 3);
    cctx.fillStyle = C.PLATFORM_OUTLINE;
    cctx.fillRect(0, size - 1, size, 1);
    cctx.fillRect(size - 1, 0, 1, size);
    // Характерная трещина, появляющаяся только после касания
    cctx.fillStyle = C.CRUMBLE_CRACK;
    cctx.fillRect(10, 3, 1, 4);
    cctx.fillRect(11, 7, 2, 1);
    cctx.fillRect(13, 8, 1, 5);
    cctx.fillRect(14, 13, 2, 1);
    cctx.fillRect(16, 14, 1, 6);
    scene.textures.addCanvas('tile_crumble', crumbleCanvas);

    // 3. Обманный пол (fake_floor) — 100% визуально идентичен безопасной платформе
    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.width = size;
    fakeCanvas.height = size;
    const fctx = fakeCanvas.getContext('2d')!;
    fctx.fillStyle = C.PLATFORM_OUTLINE;
    fctx.fillRect(0, 0, size, size);
    fctx.fillStyle = C.PLATFORM_DARK;
    fctx.fillRect(1, 1, size - 2, size - 2);
    fctx.fillStyle = C.PLATFORM_LIGHT;
    fctx.fillRect(1, 1, size - 2, 3);
    fctx.fillStyle = C.PLATFORM_OUTLINE;
    fctx.fillRect(0, size - 1, size, 1);
    fctx.fillRect(size - 1, 0, 1, size);
    scene.textures.addCanvas('tile_fake', fakeCanvas);

    // 4. Декоративная плитка со следами лапок (сохранена в реестре)
    const pawCanvas = document.createElement('canvas');
    pawCanvas.width = size;
    pawCanvas.height = size;
    const pctx = pawCanvas.getContext('2d')!;
    pctx.fillStyle = C.PLATFORM_OUTLINE;
    pctx.fillRect(0, 0, size, size);
    pctx.fillStyle = C.PLATFORM_DARK;
    pctx.fillRect(1, 1, size - 2, size - 2);
    pctx.fillStyle = C.PLATFORM_LIGHT;
    pctx.fillRect(1, 1, size - 2, 3);
    // Отпечаток кошачьей лапки на поверхности
    pctx.fillStyle = '#64748b';
    pctx.fillRect(12, 12, 6, 5); // Подушечка
    pctx.fillRect(10, 8, 2, 3);  // Пальчики
    pctx.fillRect(13, 7, 2, 3);
    pctx.fillRect(16, 7, 2, 3);
    pctx.fillRect(19, 8, 2, 3);
    scene.textures.addCanvas('tile_paw', pawCanvas);

    // 5. Падающий потолочный блок 2x2 тайла (64x64 px) — 100% монолитный блок
    const fallBlockCanvas = document.createElement('canvas');
    fallBlockCanvas.width = size * 2;
    fallBlockCanvas.height = size * 2;
    const fbctx = fallBlockCanvas.getContext('2d')!;
    fbctx.fillStyle = C.PLATFORM_OUTLINE;
    fbctx.fillRect(0, 0, size * 2, size * 2);
    fbctx.fillStyle = C.PLATFORM_DARK;
    fbctx.fillRect(2, 2, size * 2 - 4, size * 2 - 4);
    fbctx.fillStyle = C.PLATFORM_LIGHT;
    fbctx.fillRect(2, 2, size * 2 - 4, 4);
    scene.textures.addCanvas('falling_block', fallBlockCanvas);

    // 6. Каменная балка низкого свода лаза (32x16 px)
    const barCanvas = document.createElement('canvas');
    barCanvas.width = size;
    barCanvas.height = 16;
    const barctx = barCanvas.getContext('2d')!;
    barctx.fillStyle = C.PLATFORM_OUTLINE;
    barctx.fillRect(0, 0, size, 16);
    barctx.fillStyle = C.PLATFORM_DARK;
    barctx.fillRect(1, 1, size - 2, 14);
    barctx.fillStyle = C.PLATFORM_LIGHT;
    barctx.fillRect(1, 1, size - 2, 2);
    // Декоративная фаска на нижней грани свода
    barctx.fillStyle = '#1e1a2b';
    barctx.fillRect(1, 14, size - 2, 1);
    scene.textures.addCanvas('tile_tunnel_bar', barCanvas);
  }

  // --- ЛОВУШКИ: ШИПЫ И ВЫДВИЖНЫЕ ЭЛЕМЕНТЫ ---
  private static generateHazards(scene: Phaser.Scene): void {
    const size = CONSTANTS.TILE_SIZE;
    const C = CONSTANTS.COLORS;

    // 1. Статический шип (32x32 px)
    const spikeCanvas = document.createElement('canvas');
    spikeCanvas.width = size;
    spikeCanvas.height = size;
    const spctx = spikeCanvas.getContext('2d')!;
    // Отрисовка двух острых пирамидальных шипов
    for (const offset of [0, 16]) {
      spctx.fillStyle = C.SPIKE;
      spctx.beginPath();
      spctx.moveTo(offset + 1, size);
      spctx.lineTo(offset + 8, size - 20);
      spctx.lineTo(offset + 15, size);
      spctx.closePath();
      spctx.fill();

      // Светлый блик на грани
      spctx.fillStyle = C.SPIKE_LIGHT;
      spctx.beginPath();
      spctx.moveTo(offset + 8, size - 20);
      spctx.lineTo(offset + 12, size);
      spctx.lineTo(offset + 8, size);
      spctx.closePath();
      spctx.fill();
    }
    scene.textures.addCanvas('spike_static', spikeCanvas);

    // 2. Перевёрнутый статический шип (для потолка в Level 8)
    const spikeUpCanvas = document.createElement('canvas');
    spikeUpCanvas.width = size;
    spikeUpCanvas.height = size;
    const supctx = spikeUpCanvas.getContext('2d')!;
    for (const offset of [0, 16]) {
      supctx.fillStyle = C.SPIKE;
      supctx.beginPath();
      supctx.moveTo(offset + 1, 0);
      supctx.lineTo(offset + 8, 20);
      supctx.lineTo(offset + 15, 0);
      supctx.closePath();
      supctx.fill();

      supctx.fillStyle = C.SPIKE_LIGHT;
      supctx.beginPath();
      supctx.moveTo(offset + 8, 20);
      supctx.lineTo(offset + 12, 0);
      supctx.lineTo(offset + 8, 0);
      supctx.closePath();
      supctx.fill();
    }
    scene.textures.addCanvas('spike_upside', spikeUpCanvas);

    // 3. Скрытая плита Pop Spike в закрытом состоянии (100% идентична tile_solid)
    const popHiddenCanvas = document.createElement('canvas');
    popHiddenCanvas.width = size;
    popHiddenCanvas.height = size;
    const phctx = popHiddenCanvas.getContext('2d')!;
    phctx.fillStyle = C.PLATFORM_OUTLINE;
    phctx.fillRect(0, 0, size, size);
    phctx.fillStyle = C.PLATFORM_DARK;
    phctx.fillRect(1, 1, size - 2, size - 2);
    phctx.fillStyle = C.PLATFORM_LIGHT;
    phctx.fillRect(1, 1, size - 2, 3);
    phctx.fillStyle = C.PLATFORM_OUTLINE;
    phctx.fillRect(0, size - 1, size, 1);
    phctx.fillRect(size - 1, 0, 1, size);
    scene.textures.addCanvas('pop_spike_floor', popHiddenCanvas);
  }

  // --- ИНТЕРАКТИВНЫЕ ОБЪЕКТЫ (ПОРТАЛ, ЗОНЫ, ЧЕКПОИНТ) ---
  private static generateObjects(scene: Phaser.Scene): void {
    const size = CONSTANTS.TILE_SIZE;
    const C = CONSTANTS.COLORS;

    // 1. Портал (32x48 px)
    const portalCanvas = document.createElement('canvas');
    portalCanvas.width = 32;
    portalCanvas.height = 48;
    const pctx = portalCanvas.getContext('2d')!;
    // Внешнее пульсирующее свечение
    pctx.fillStyle = C.PORTAL_PURPLE;
    pctx.beginPath();
    pctx.ellipse(16, 24, 14, 22, 0, 0, Math.PI * 2);
    pctx.fill();

    // Ядро портала
    pctx.fillStyle = C.PORTAL_CORE;
    pctx.beginPath();
    pctx.ellipse(16, 24, 9, 16, 0, 0, Math.PI * 2);
    pctx.fill();

    // Белый центр
    pctx.fillStyle = '#ffffff';
    pctx.beginPath();
    pctx.ellipse(16, 24, 4, 8, 0, 0, Math.PI * 2);
    pctx.fill();
    scene.textures.addCanvas('portal', portalCanvas);

    // 2. Чекпоинт: коробка с подушечкой 📦 (32x32 px)
    const boxCanvas = document.createElement('canvas');
    boxCanvas.width = size;
    boxCanvas.height = size;
    const bctx = boxCanvas.getContext('2d')!;
    // Картонная коробка
    bctx.fillStyle = '#92400e';
    bctx.fillRect(3, 10, 26, 20);
    bctx.fillStyle = C.CHECKPOINT_BOX;
    bctx.fillRect(5, 12, 22, 16);
    // Клапаны коробки
    bctx.fillStyle = '#b45309';
    bctx.fillRect(1, 8, 8, 4);
    bctx.fillRect(23, 8, 8, 4);
    // Мягкая подушечка внутри
    bctx.fillStyle = '#f472b6';
    bctx.fillRect(7, 14, 18, 6);
    // Значок котика на коробке
    bctx.fillStyle = '#78350f';
    bctx.fillRect(13, 22, 6, 4);
    scene.textures.addCanvas('checkpoint_box', boxCanvas);

    // 3. Зона уменьшения (бирюзовая световая арка, 32x64 px)
    const sizeZoneCanvas = document.createElement('canvas');
    sizeZoneCanvas.width = size;
    sizeZoneCanvas.height = size * 2;
    const szctx = sizeZoneCanvas.getContext('2d')!;
    // Мягкое полупрозрачное силовое поле
    szctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
    szctx.fillRect(0, 0, size, size * 2);
    // Внутреннее вертикальное свечение
    szctx.fillStyle = 'rgba(6, 182, 212, 0.22)';
    szctx.fillRect(6, 4, 20, size * 2 - 8);
    // Боковые светящиеся энергетические пилоны
    szctx.fillStyle = C.SIZE_CYAN_LIGHT;
    szctx.fillRect(1, 2, 2, size * 2 - 4);
    szctx.fillRect(size - 3, 2, 2, size * 2 - 4);
    // Верхняя и нижняя перемычки арки
    szctx.fillRect(1, 1, size - 2, 2);
    szctx.fillRect(1, size * 2 - 3, size - 2, 2);
    // Стрелочки уменьшения, сходящиеся к центру
    szctx.fillStyle = '#ffffff';
    // Верхняя стрелка (указывает вниз)
    szctx.fillRect(15, 12, 2, 8);
    szctx.fillRect(13, 18, 6, 2);
    szctx.fillRect(14, 20, 4, 2);
    szctx.fillRect(15, 22, 2, 2);
    // Нижняя стрелка (указывает вверх)
    szctx.fillRect(15, 44, 2, 8);
    szctx.fillRect(13, 44, 6, 2);
    szctx.fillRect(14, 42, 4, 2);
    szctx.fillRect(15, 40, 2, 2);
    // Мини-ядро в центре
    szctx.fillStyle = C.SIZE_CYAN_LIGHT;
    szctx.fillRect(14, 30, 4, 4);
    scene.textures.addCanvas('zone_shrink', sizeZoneCanvas);

    // 4. Зона гравитации (фиолетовая световая арка, 32x64 px)
    const gravZoneCanvas = document.createElement('canvas');
    gravZoneCanvas.width = size;
    gravZoneCanvas.height = size * 2;
    const gzctx = gravZoneCanvas.getContext('2d')!;
    // Мягкое силовое поле
    gzctx.fillStyle = 'rgba(147, 51, 234, 0.12)';
    gzctx.fillRect(0, 0, size, size * 2);
    gzctx.fillStyle = 'rgba(147, 51, 234, 0.22)';
    gzctx.fillRect(6, 4, 20, size * 2 - 8);
    // Боковые энергетические пилоны
    gzctx.fillStyle = C.GRAVITY_PURPLE_LIGHT;
    gzctx.fillRect(1, 2, 2, size * 2 - 4);
    gzctx.fillRect(size - 3, 2, 2, size * 2 - 4);
    // Верхняя и нижняя перемычки
    gzctx.fillRect(1, 1, size - 2, 2);
    gzctx.fillRect(1, size * 2 - 3, size - 2, 2);
    // Стрелки гравитации вверх
    gzctx.fillStyle = '#ffffff';
    gzctx.fillRect(15, 18, 2, 28);
    gzctx.fillRect(13, 22, 6, 2);
    gzctx.fillRect(14, 20, 4, 2);
    gzctx.fillRect(15, 18, 2, 2);
    gzctx.fillStyle = C.GRAVITY_PURPLE_LIGHT;
    gzctx.fillRect(13, 36, 6, 2);
    gzctx.fillRect(14, 34, 4, 2);
    gzctx.fillRect(15, 32, 2, 2);
    scene.textures.addCanvas('zone_gravity', gravZoneCanvas);
  }

  // --- ЧАСТИЦЫ (ПЫЛЬ, ОБЛАЧКО ДЫМА ПРИ ГИБЕЛИ) ---
  private static generateParticles(scene: Phaser.Scene): void {
    // 1. Частица пыли
    const dustCanvas = document.createElement('canvas');
    dustCanvas.width = 4;
    dustCanvas.height = 4;
    const dctx = dustCanvas.getContext('2d')!;
    dctx.fillStyle = '#94a3b8';
    dctx.fillRect(0, 0, 4, 4);
    scene.textures.addCanvas('particle_dust', dustCanvas);

    // 2. Частица смерти / облачко
    const puffCanvas = document.createElement('canvas');
    puffCanvas.width = 8;
    puffCanvas.height = 8;
    const pfctx = puffCanvas.getContext('2d')!;
    pfctx.fillStyle = '#cbd5e1';
    pfctx.beginPath();
    pfctx.arc(4, 4, 3, 0, Math.PI * 2);
    pfctx.fill();
    scene.textures.addCanvas('particle_puff', puffCanvas);

    // 3. Золотая звёздочка чекпоинта
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 8;
    starCanvas.height = 8;
    const sctx = starCanvas.getContext('2d')!;
    sctx.fillStyle = '#facc15';
    sctx.fillRect(3, 1, 2, 6);
    sctx.fillRect(1, 3, 6, 2);
    scene.textures.addCanvas('particle_star', starCanvas);
  }

  // --- МЕХАНИКИ И ВИЗУАЛ ГЛАВЫ 2 ---
  private static generateChapter2(scene: Phaser.Scene): void {
    const C = CONSTANTS.COLORS;

    // 1. BouncePad (32x32)
    const bpCanvas = document.createElement('canvas');
    bpCanvas.width = 32;
    bpCanvas.height = 32;
    const bpctx = bpCanvas.getContext('2d')!;
    bpctx.imageSmoothingEnabled = false;
    // Металлическое основание, прилегающее к полу (y=26..31)
    bpctx.fillStyle = '#0f172a';
    bpctx.fillRect(1, 26, 30, 6);
    bpctx.fillStyle = '#334155';
    bpctx.fillRect(3, 27, 26, 4);
    // Болты крепления к полу
    bpctx.fillStyle = '#64748b';
    bpctx.fillRect(4, 29, 2, 2);
    bpctx.fillRect(26, 29, 2, 2);
    // Пружины (y=17..26)
    bpctx.fillStyle = '#f59e0b';
    bpctx.fillRect(7, 17, 4, 9);
    bpctx.fillRect(21, 17, 4, 9);
    bpctx.fillStyle = '#fbbf24';
    bpctx.fillRect(8, 18, 2, 8);
    bpctx.fillRect(22, 18, 2, 8);
    // Верхняя упругая площадка (y=12..17)
    bpctx.fillStyle = '#b45309';
    bpctx.fillRect(2, 12, 28, 6);
    bpctx.fillStyle = '#facc15';
    bpctx.fillRect(3, 13, 26, 4);
    bpctx.fillStyle = '#fef08a';
    bpctx.fillRect(5, 13, 22, 2);
    scene.textures.addCanvas('bounce_pad', bpCanvas);

    // 2. Conveyor Left (32x32)
    const clCanvas = document.createElement('canvas');
    clCanvas.width = 32;
    clCanvas.height = 32;
    const clctx = clCanvas.getContext('2d')!;
    clctx.imageSmoothingEnabled = false;
    // Корпус
    clctx.fillStyle = '#0f172a';
    clctx.fillRect(0, 0, 32, 32);
    clctx.fillStyle = '#1e293b';
    clctx.fillRect(1, 1, 30, 30);
    // Верхняя резиновая лента
    clctx.fillStyle = '#334155';
    clctx.fillRect(1, 1, 30, 8);
    // Стрелки влево <<<
    clctx.fillStyle = '#38bdf8';
    for (let ox of [4, 14, 24]) {
      clctx.fillRect(ox + 3, 3, 2, 4);
      clctx.fillRect(ox + 1, 4, 2, 2);
      clctx.fillRect(ox, 5, 2, 1);
    }
    // Ролики снизу
    clctx.fillStyle = '#475569';
    clctx.fillRect(4, 18, 6, 6);
    clctx.fillRect(13, 18, 6, 6);
    clctx.fillRect(22, 18, 6, 6);
    scene.textures.addCanvas('conveyor_left', clCanvas);

    // 3. Conveyor Right (32x32)
    const crCanvas = document.createElement('canvas');
    crCanvas.width = 32;
    crCanvas.height = 32;
    const crctx = crCanvas.getContext('2d')!;
    crctx.imageSmoothingEnabled = false;
    // Корпус
    crctx.fillStyle = '#0f172a';
    crctx.fillRect(0, 0, 32, 32);
    crctx.fillStyle = '#1e293b';
    crctx.fillRect(1, 1, 30, 30);
    // Верхняя лента
    crctx.fillStyle = '#334155';
    crctx.fillRect(1, 1, 30, 8);
    // Стрелки вправо >>>
    crctx.fillStyle = '#38bdf8';
    for (let ox of [4, 14, 24]) {
      crctx.fillRect(ox, 3, 2, 4);
      crctx.fillRect(ox + 2, 4, 2, 2);
      crctx.fillRect(ox + 3, 5, 2, 1);
    }
    // Ролики снизу
    crctx.fillStyle = '#475569';
    crctx.fillRect(4, 18, 6, 6);
    crctx.fillRect(13, 18, 6, 6);
    crctx.fillRect(22, 18, 6, 6);
    scene.textures.addCanvas('conveyor_right', crCanvas);

    // 4. Moving Platform (64x16)
    const mpCanvas = document.createElement('canvas');
    mpCanvas.width = 64;
    mpCanvas.height = 16;
    const mpctx = mpCanvas.getContext('2d')!;
    mpctx.imageSmoothingEnabled = false;
    mpctx.fillStyle = '#0f172a';
    mpctx.fillRect(0, 0, 64, 16);
    mpctx.fillStyle = '#1e293b';
    mpctx.fillRect(1, 1, 62, 14);
    mpctx.fillStyle = '#334155';
    mpctx.fillRect(2, 2, 60, 4);
    // Неоновые направляющие по бокам и центру
    mpctx.fillStyle = C.ACCENT_TEAL;
    mpctx.fillRect(4, 9, 8, 3);
    mpctx.fillRect(28, 9, 8, 3);
    mpctx.fillRect(52, 9, 8, 3);
    scene.textures.addCanvas('moving_platform', mpCanvas);

    // 5. Pressure Button Up (32x32)
    const pbuCanvas = document.createElement('canvas');
    pbuCanvas.width = 32;
    pbuCanvas.height = 32;
    const pbuctx = pbuCanvas.getContext('2d')!;
    pbuctx.imageSmoothingEnabled = false;
    // Металлическое основание, прилегающее к полу (y=26..31)
    pbuctx.fillStyle = '#0f172a';
    pbuctx.fillRect(1, 26, 30, 6);
    pbuctx.fillStyle = '#334155';
    pbuctx.fillRect(3, 27, 26, 4);
    // Болты крепления к полу
    pbuctx.fillStyle = '#64748b';
    pbuctx.fillRect(4, 29, 2, 2);
    pbuctx.fillRect(26, 29, 2, 2);
    // Стальной фланец направляющей (y=22..26)
    pbuctx.fillStyle = '#1e293b';
    pbuctx.fillRect(6, 22, 20, 5);
    pbuctx.fillStyle = '#475569';
    pbuctx.fillRect(8, 22, 16, 4);
    // Кнопка поднята (красная, y=14..22)
    pbuctx.fillStyle = '#9f1239';
    pbuctx.fillRect(7, 14, 18, 8);
    pbuctx.fillStyle = '#e11d48';
    pbuctx.fillRect(8, 15, 16, 6);
    pbuctx.fillStyle = '#fb7185';
    pbuctx.fillRect(9, 15, 14, 2);
    // Неоновый индикатор в центре
    pbuctx.fillStyle = '#ffffff';
    pbuctx.fillRect(14, 17, 4, 2);
    scene.textures.addCanvas('pressure_button_up', pbuCanvas);

    // 6. Pressure Button Down (32x32)
    const pbdCanvas = document.createElement('canvas');
    pbdCanvas.width = 32;
    pbdCanvas.height = 32;
    const pbdctx = pbdCanvas.getContext('2d')!;
    pbdctx.imageSmoothingEnabled = false;
    // Металлическое основание, прилегающее к полу (y=26..31)
    pbdctx.fillStyle = '#0f172a';
    pbdctx.fillRect(1, 26, 30, 6);
    pbdctx.fillStyle = '#334155';
    pbdctx.fillRect(3, 27, 26, 4);
    // Болты крепления к полу
    pbdctx.fillStyle = '#64748b';
    pbdctx.fillRect(4, 29, 2, 2);
    pbdctx.fillRect(26, 29, 2, 2);
    // Стальной фланец направляющей (y=22..26)
    pbdctx.fillStyle = '#1e293b';
    pbdctx.fillRect(6, 22, 20, 5);
    // Кнопка утоплена (зелёная, y=21..25)
    pbdctx.fillStyle = '#065f46';
    pbdctx.fillRect(7, 21, 18, 5);
    pbdctx.fillStyle = '#10b981';
    pbdctx.fillRect(8, 22, 16, 3);
    pbdctx.fillStyle = '#a7f3d0';
    pbdctx.fillRect(9, 22, 14, 1);
    scene.textures.addCanvas('pressure_button_down', pbdCanvas);

    // 7. Toggle Block Active (32x32) — визуально 100% монолитная стена окружения
    const tbCanvas = document.createElement('canvas');
    tbCanvas.width = 32;
    tbCanvas.height = 32;
    const tbctx = tbCanvas.getContext('2d')!;
    tbctx.imageSmoothingEnabled = false;
    tbctx.fillStyle = C.PLATFORM_OUTLINE;
    tbctx.fillRect(0, 0, 32, 32);
    tbctx.fillStyle = C.PLATFORM_DARK;
    tbctx.fillRect(1, 1, 30, 30);
    tbctx.fillStyle = C.PLATFORM_LIGHT;
    tbctx.fillRect(1, 1, 30, 3);
    tbctx.fillStyle = C.PLATFORM_OUTLINE;
    tbctx.fillRect(0, 31, 32, 1);
    tbctx.fillRect(31, 0, 1, 32);
    scene.textures.addCanvas('toggle_block', tbCanvas);

    // 8. Toggle Block Inactive (32x32) — полностью скрытый (пустой) холст
    const tbiCanvas = document.createElement('canvas');
    tbiCanvas.width = 32;
    tbiCanvas.height = 32;
    const tbictx = tbiCanvas.getContext('2d')!;
    tbictx.imageSmoothingEnabled = false;
    tbictx.clearRect(0, 0, 32, 32);
    scene.textures.addCanvas('toggle_block_inactive', tbiCanvas);

    // 9. Crusher (32x32)
    const crushCanvas = document.createElement('canvas');
    crushCanvas.width = 32;
    crushCanvas.height = 32;
    const cctx = crushCanvas.getContext('2d')!;
    cctx.imageSmoothingEnabled = false;
    // Тяжёлый стальной корпус
    cctx.fillStyle = '#0f172a';
    cctx.fillRect(0, 0, 32, 32);
    cctx.fillStyle = '#334155';
    cctx.fillRect(2, 2, 28, 28);
    // Полосы предупреждения (жёлто-чёрные)
    cctx.fillStyle = '#facc15';
    cctx.fillRect(4, 8, 24, 6);
    cctx.fillStyle = '#0f172a';
    cctx.fillRect(8, 8, 4, 6);
    cctx.fillRect(18, 8, 4, 6);
    // Заклёпки
    cctx.fillStyle = '#94a3b8';
    cctx.fillRect(4, 4, 2, 2);
    cctx.fillRect(26, 4, 2, 2);
    cctx.fillRect(4, 18, 2, 2);
    cctx.fillRect(26, 18, 2, 2);
    // Зубья/шипы на ударной кромке
    cctx.fillStyle = '#cbd5e1';
    for (let ox of [2, 10, 18, 26]) {
      cctx.fillRect(ox + 1, 24, 4, 2);
      cctx.fillRect(ox + 2, 26, 2, 4);
    }
    scene.textures.addCanvas('crusher', crushCanvas);

    // 10. Control Zone Reverse (32x64)
    const czrCanvas = document.createElement('canvas');
    czrCanvas.width = 32;
    czrCanvas.height = 64;
    const czrctx = czrCanvas.getContext('2d')!;
    czrctx.imageSmoothingEnabled = false;
    czrctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
    czrctx.fillRect(0, 0, 32, 64);
    czrctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
    czrctx.fillRect(4, 4, 24, 56);
    // Боковые рамки
    czrctx.fillStyle = '#38bdf8';
    czrctx.fillRect(1, 1, 2, 62);
    czrctx.fillRect(29, 1, 2, 62);
    // Символ ↔
    czrctx.fillStyle = '#ffffff';
    czrctx.fillRect(8, 30, 16, 4);
    czrctx.fillRect(8, 27, 3, 10);
    czrctx.fillRect(21, 27, 3, 10);
    scene.textures.addCanvas('control_zone_reverse', czrCanvas);

    // 11. Control Zone Autorun (32x64)
    const czaCanvas = document.createElement('canvas');
    czaCanvas.width = 32;
    czaCanvas.height = 64;
    const czactx = czaCanvas.getContext('2d')!;
    czactx.imageSmoothingEnabled = false;
    czactx.fillStyle = 'rgba(245, 158, 11, 0.18)';
    czactx.fillRect(0, 0, 32, 64);
    czactx.fillStyle = 'rgba(251, 191, 36, 0.25)';
    czactx.fillRect(4, 4, 24, 56);
    // Боковые рамки
    czactx.fillStyle = '#f59e0b';
    czactx.fillRect(1, 1, 2, 62);
    czactx.fillRect(29, 1, 2, 62);
    // Символ >>
    czactx.fillStyle = '#ffffff';
    czactx.fillRect(9, 26, 3, 12);
    czactx.fillRect(12, 28, 3, 8);
    czactx.fillRect(15, 30, 3, 4);
    czactx.fillRect(18, 26, 3, 12);
    czactx.fillRect(21, 28, 3, 8);
    czactx.fillRect(24, 30, 3, 4);
    scene.textures.addCanvas('control_zone_autorun', czaCanvas);

    // 12. BG Sector Far (64x64)
    const bgfCanvas = document.createElement('canvas');
    bgfCanvas.width = 64;
    bgfCanvas.height = 64;
    const bgfctx = bgfCanvas.getContext('2d')!;
    bgfctx.imageSmoothingEnabled = false;
    bgfctx.fillStyle = C.BG_BASE_CH2;
    bgfctx.fillRect(0, 0, 64, 64);
    bgfctx.fillStyle = C.BG_SECONDARY_CH2;
    bgfctx.fillRect(4, 4, 56, 56);
    // Вентиляционные решётки
    bgfctx.fillStyle = '#0b1017';
    for (let y = 14; y <= 50; y += 8) {
      bgfctx.fillRect(12, y, 40, 3);
    }
    scene.textures.addCanvas('bg_sector_far', bgfCanvas);

    // 13. BG Sector Mid (64x64)
    const bgmCanvas = document.createElement('canvas');
    bgmCanvas.width = 64;
    bgmCanvas.height = 64;
    const bgmctx = bgmCanvas.getContext('2d')!;
    bgmctx.imageSmoothingEnabled = false;
    bgmctx.clearRect(0, 0, 64, 64);
    // Балки и кабели
    bgmctx.fillStyle = C.BG_OBJECT_CH2;
    bgmctx.fillRect(0, 20, 64, 8);
    bgmctx.fillRect(28, 0, 8, 64);
    // Неоновые полосы
    bgmctx.fillStyle = 'rgba(34, 211, 197, 0.4)';
    bgmctx.fillRect(0, 27, 64, 2);
    scene.textures.addCanvas('bg_sector_mid', bgmCanvas);
  }

  // --- ГЛАВА 3: МАТРИЦА И ИГРЫ СО ВРЕМЕНЕМ ---
  private static generateChapter3(scene: Phaser.Scene): void {
    const C = CONSTANTS.COLORS;

    // 1. Твердый блок Главы 3 (32x32) - Неоновый кибер-камень с циановым контуром
    const solidCanvas = document.createElement('canvas');
    solidCanvas.width = 32;
    solidCanvas.height = 32;
    const sctx = solidCanvas.getContext('2d')!;
    sctx.imageSmoothingEnabled = false;
    sctx.fillStyle = C.PLATFORM_CH3;
    sctx.fillRect(0, 0, 32, 32);
    sctx.fillStyle = C.PLATFORM_CH3_LIGHT;
    sctx.fillRect(2, 2, 28, 28);
    // Внутренняя микросхема
    sctx.fillStyle = '#181b2e';
    sctx.fillRect(6, 6, 20, 20);
    // Неоновый акцентный кант
    sctx.fillStyle = C.NEON_CYAN;
    sctx.fillRect(0, 0, 32, 2);
    sctx.fillRect(0, 0, 2, 32);
    sctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
    sctx.fillRect(30, 0, 2, 32);
    sctx.fillRect(0, 30, 32, 2);
    // Точечные неоновые узлы
    sctx.fillStyle = '#ffffff';
    sctx.fillRect(2, 2, 2, 2);
    sctx.fillRect(28, 2, 2, 2);
    scene.textures.addCanvas('tile_solid_c3', solidCanvas);

    // 2. Фазовый блок A (Активный - 100% идентичен обычной платформе tile_solid_c3)
    const gbaCanvas = document.createElement('canvas');
    gbaCanvas.width = 32;
    gbaCanvas.height = 32;
    const gbactx = gbaCanvas.getContext('2d')!;
    gbactx.drawImage(solidCanvas, 0, 0);
    scene.textures.addCanvas('tile_glitch_a_active', gbaCanvas);

    // 3. Фазовый блок A (Неактивный - Пустое пространство без подсказок!) 32x32
    const gbiaCanvas = document.createElement('canvas');
    gbiaCanvas.width = 32;
    gbiaCanvas.height = 32;
    // Чистый прозрачный холст: в CatTrap нет пунктирных подсказок
    scene.textures.addCanvas('tile_glitch_a_inactive', gbiaCanvas);

    // 4. Фазовый блок B (Активный - 100% идентичен обычной платформе tile_solid_c3)
    const gbbCanvas = document.createElement('canvas');
    gbbCanvas.width = 32;
    gbbCanvas.height = 32;
    const gbbctx = gbbCanvas.getContext('2d')!;
    gbbctx.drawImage(solidCanvas, 0, 0);
    scene.textures.addCanvas('tile_glitch_b_active', gbbCanvas);

    // 5. Фазовый блок B (Неактивный - Пустое пространство без подсказок!) 32x32
    const gbibCanvas = document.createElement('canvas');
    gbibCanvas.width = 32;
    gbibCanvas.height = 32;
    // Чистый прозрачный холст: в CatTrap нет пунктирных подсказок
    scene.textures.addCanvas('tile_glitch_b_inactive', gbibCanvas);

    // 6. Лазерный эмиттер (Скрытый) 32x32 - прозрачный холст
    const leCanvas = document.createElement('canvas');
    leCanvas.width = 32;
    leCanvas.height = 32;
    scene.textures.addCanvas('laser_emitter', leCanvas);

    // 7. Варп-портал Вход (Кибернетическая пространственная червоточина) 32x32
    const wpiCanvas = document.createElement('canvas');
    wpiCanvas.width = 32;
    wpiCanvas.height = 32;
    const wpictx = wpiCanvas.getContext('2d')!;
    wpictx.imageSmoothingEnabled = false;
    // Тёмный гравитационный вихрь
    wpictx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    wpictx.beginPath();
    wpictx.arc(16, 16, 14, 0, Math.PI * 2);
    wpictx.fill();
    wpictx.strokeStyle = C.NEON_CYAN;
    wpictx.lineWidth = 2;
    wpictx.stroke();
    // Внутренние спиральные точки
    wpictx.fillStyle = '#38bdf8';
    wpictx.fillRect(10, 8, 3, 3);
    wpictx.fillRect(20, 9, 3, 3);
    wpictx.fillRect(22, 18, 3, 3);
    wpictx.fillRect(9, 21, 3, 3);
    // Ядро сингулярности
    wpictx.fillStyle = '#ffffff';
    wpictx.fillRect(14, 14, 4, 4);
    scene.textures.addCanvas('warp_gate_in', wpiCanvas);

    // 8. Варп-портал Выход (Скрытая точка выхода, без подсказок!) 32x32
    const wpoCanvas = document.createElement('canvas');
    wpoCanvas.width = 32;
    wpoCanvas.height = 32;
    // Чистый прозрачный холст: точка выхода не должна выдавать себя заранее
    scene.textures.addCanvas('warp_gate_out', wpoCanvas);

    // 9. Эхо-кот (24x24) - полупрозрачный голографический силуэт
    const ecCanvas = document.createElement('canvas');
    ecCanvas.width = 24;
    ecCanvas.height = 24;
    const ecctx = ecCanvas.getContext('2d')!;
    ecctx.imageSmoothingEnabled = false;
    ecctx.fillStyle = 'rgba(168, 85, 247, 0.7)';
    ecctx.fillRect(4, 6, 16, 14); // Тело
    ecctx.fillRect(5, 2, 4, 4);   // Левое ухо
    ecctx.fillRect(15, 2, 4, 4);  // Правое ухо
    ecctx.fillStyle = '#ffffff';
    ecctx.fillRect(8, 8, 2, 3);   // Светящийся глаз
    ecctx.fillRect(14, 8, 2, 3);
    ecctx.fillStyle = C.NEON_CYAN;
    ecctx.fillRect(10, 14, 4, 2);  // Глитч-полоска
    scene.textures.addCanvas('echo_cat', ecCanvas);

    // 10. Time Zone Slow (32x32 бесшовный хроно-туман)
    const tzCanvas = document.createElement('canvas');
    tzCanvas.width = 32;
    tzCanvas.height = 32;
    const tzctx = tzCanvas.getContext('2d')!;
    tzctx.imageSmoothingEnabled = false;
    tzctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
    tzctx.fillRect(0, 0, 32, 32);
    // Тонкие цифровые скан-линии
    tzctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    tzctx.fillRect(0, 8, 32, 1);
    tzctx.fillRect(0, 24, 32, 1);
    // Частицы хроно-пыли
    tzctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    tzctx.fillRect(6, 4, 1, 1);
    tzctx.fillRect(22, 14, 1, 1);
    tzctx.fillRect(14, 28, 1, 1);
    scene.textures.addCanvas('time_zone_slow', tzCanvas);

    // 11. Фон Главы 3: Дальний план (64x64) - Цифровая бездна
    const bgfCanvas = document.createElement('canvas');
    bgfCanvas.width = 64;
    bgfCanvas.height = 64;
    const bgfctx = bgfCanvas.getContext('2d')!;
    bgfctx.imageSmoothingEnabled = false;
    bgfctx.fillStyle = C.BG_BASE_CH3;
    bgfctx.fillRect(0, 0, 64, 64);
    bgfctx.fillStyle = C.BG_SECONDARY_CH3;
    bgfctx.fillRect(4, 4, 56, 56);
    // Цифровой шум / узлы сети
    bgfctx.fillStyle = '#1e1b4b';
    bgfctx.fillRect(16, 16, 4, 4);
    bgfctx.fillRect(44, 40, 4, 4);
    scene.textures.addCanvas('bg_ch3_far', bgfCanvas);

    // 12. Фон Главы 3: Средний план (64x64) - Вертикальные шины данных
    const bgmCanvas = document.createElement('canvas');
    bgmCanvas.width = 64;
    bgmCanvas.height = 64;
    const bgmctx = bgmCanvas.getContext('2d')!;
    bgmctx.imageSmoothingEnabled = false;
    bgmctx.clearRect(0, 0, 64, 64);
    // Вертикальные линии шин данных
    bgmctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    bgmctx.fillRect(16, 0, 2, 64);
    bgmctx.fillRect(48, 0, 2, 64);
    // Горизонтальный световод
    bgmctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
    bgmctx.fillRect(0, 32, 64, 2);
    scene.textures.addCanvas('bg_ch3_mid', bgmCanvas);
  }

  // --- ГЛАВА 4: Катакомбы и Камнепад ---
  private static generateChapter4(scene: Phaser.Scene): void {
    const C = CONSTANTS.COLORS;

    // 1. Монолитная каменная плита Главы 4 (32x32) - tile_solid_c4
    // 100% Zero-Hint: темный каменный монолит со сколами в тон, без единого цветного пикселя
    const tileC4 = document.createElement('canvas');
    tileC4.width = 32;
    tileC4.height = 32;
    const tctx = tileC4.getContext('2d')!;
    tctx.imageSmoothingEnabled = false;

    // Базовый цвет сланца
    tctx.fillStyle = C.PLATFORM_CH4;
    tctx.fillRect(0, 0, 32, 32);

    // Верхняя фаска монолита (чуть светлее)
    tctx.fillStyle = C.PLATFORM_CH4_LIGHT;
    tctx.fillRect(1, 1, 30, 2);

    // Внутренние каменные прожилки и фактура
    tctx.fillStyle = C.BG_OBJECT_CH4;
    tctx.fillRect(4, 10, 8, 1);
    tctx.fillRect(18, 18, 10, 1);
    tctx.fillRect(8, 24, 6, 1);

    // Тёмный контур
    tctx.strokeStyle = C.BG_SECONDARY_CH4;
    tctx.lineWidth = 1;
    tctx.strokeRect(0.5, 0.5, 31, 31);
    scene.textures.addCanvas('tile_solid_c4', tileC4);

    // 2. Катящийся валун (Rolling Boulder) (32x32) - rolling_boulder
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 32;
    bCanvas.height = 32;
    const bctx = bCanvas.getContext('2d')!;
    bctx.imageSmoothingEnabled = false;

    // Круглое каменное тело валуна
    bctx.fillStyle = C.BOULDER_DARK;
    bctx.beginPath();
    bctx.arc(16, 16, 15, 0, Math.PI * 2);
    bctx.fill();

    bctx.fillStyle = C.BOULDER_MID;
    bctx.beginPath();
    bctx.arc(16, 16, 13, 0, Math.PI * 2);
    bctx.fill();

    // Каменные трещины и рельеф (чтобы было видно вращение при качении)
    bctx.fillStyle = C.BOULDER_LIGHT;
    bctx.fillRect(11, 7, 6, 3);
    bctx.fillRect(8, 16, 4, 3);
    bctx.fillRect(18, 21, 5, 3);

    bctx.fillStyle = C.BG_BASE_CH4;
    // Глубокая расселина поперек валуна
    bctx.fillRect(14, 10, 2, 12);
    bctx.fillRect(16, 16, 7, 2);
    bctx.fillRect(9, 14, 6, 2);
    scene.textures.addCanvas('rolling_boulder', bCanvas);

    // 3. Фон Главы 4: Дальний план (64x64) - Свод катакомб
    const bgFar = document.createElement('canvas');
    bgFar.width = 64;
    bgFar.height = 64;
    const fctx = bgFar.getContext('2d')!;
    fctx.imageSmoothingEnabled = false;
    fctx.fillStyle = C.BG_BASE_CH4;
    fctx.fillRect(0, 0, 64, 64);
    fctx.fillStyle = C.BG_SECONDARY_CH4;
    fctx.fillRect(4, 4, 56, 56);
    // Каменная кладка вдали
    fctx.fillStyle = C.BG_OBJECT_CH4;
    fctx.fillRect(8, 16, 20, 2);
    fctx.fillRect(36, 32, 22, 2);
    fctx.fillRect(14, 48, 24, 2);
    scene.textures.addCanvas('bg_ch4_far', bgFar);

    // 4. Фон Главы 4: Средний план (64x64) - Массивные колонны
    const bgMid = document.createElement('canvas');
    bgMid.width = 64;
    bgMid.height = 64;
    const mctx = bgMid.getContext('2d')!;
    mctx.imageSmoothingEnabled = false;
    mctx.clearRect(0, 0, 64, 64);
    // Вертикальная опора/колонна
    mctx.fillStyle = 'rgba(35, 34, 46, 0.4)';
    mctx.fillRect(20, 0, 10, 64);
    mctx.fillStyle = 'rgba(42, 40, 56, 0.5)';
    mctx.fillRect(22, 0, 6, 64);
    scene.textures.addCanvas('bg_ch4_mid', bgMid);
  }
}

