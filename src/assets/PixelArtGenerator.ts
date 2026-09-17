import Phaser from 'phaser';
import { CONSTANTS } from '../core/Constants';

export class PixelArtGenerator {
  public static generateAll(scene: Phaser.Scene): void {
    PixelArtGenerator.generateCatSpritesheet(scene);
    PixelArtGenerator.generateTiles(scene);
    PixelArtGenerator.generateHazards(scene);
    PixelArtGenerator.generateObjects(scene);
    PixelArtGenerator.generateParticles(scene);
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

    // 2. Осыпающийся блок (crumble_block) — с тонкой трещиной
    const crumbleCanvas = document.createElement('canvas');
    crumbleCanvas.width = size;
    crumbleCanvas.height = size;
    const cctx = crumbleCanvas.getContext('2d')!;
    cctx.fillStyle = C.PLATFORM_OUTLINE;
    cctx.fillRect(0, 0, size, size);
    cctx.fillStyle = C.CRUMBLE;
    cctx.fillRect(1, 1, size - 2, size - 2);
    cctx.fillStyle = C.PLATFORM_LIGHT;
    cctx.fillRect(1, 1, size - 2, 3);
    // Тонкая характерная трещина
    cctx.fillStyle = C.CRUMBLE_CRACK;
    cctx.fillRect(10, 3, 1, 4);
    cctx.fillRect(11, 7, 2, 1);
    cctx.fillRect(13, 8, 1, 5);
    cctx.fillRect(14, 13, 2, 1);
    cctx.fillRect(16, 14, 1, 6);
    scene.textures.addCanvas('tile_crumble', crumbleCanvas);

    // 3. Обманный пол (fake_floor)
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
    // Микро-отличие: едва заметный сдвиг шва
    fctx.fillStyle = C.PLATFORM_OUTLINE;
    fctx.fillRect(16, 0, 1, 4);
    scene.textures.addCanvas('tile_fake', fakeCanvas);

    // 4. Декоративная плитка со следами лапок (level 6 подсказка)
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

    // 5. Падающий потолочный блок 2x2 тайла (64x64 px)
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
    // Отличительные пиксели другого оттенка на нижней грани (ТЗ пункт 10)
    fbctx.fillStyle = '#f59e42';
    fbctx.fillRect(28, size * 2 - 4, 8, 2);
    scene.textures.addCanvas('falling_block', fallBlockCanvas);
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

    // 3. Скрытая плита Pop Spike в закрытом состоянии (видна лишь тонкая щель)
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
    // Едва заметная щель в полу (ТЗ пункт 10)
    phctx.fillStyle = '#0f0e17';
    phctx.fillRect(4, 2, 24, 2);
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

    // 3. Зона уменьшения (бирюзовая, 32x64 px)
    const sizeZoneCanvas = document.createElement('canvas');
    sizeZoneCanvas.width = size;
    sizeZoneCanvas.height = size * 2;
    const szctx = sizeZoneCanvas.getContext('2d')!;
    szctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    szctx.fillRect(0, 0, size, size * 2);
    szctx.fillStyle = C.SIZE_CYAN_LIGHT;
    // Стрелочки уменьшения внутрь
    szctx.fillRect(15, 12, 2, 10);
    szctx.fillRect(13, 20, 6, 2);
    szctx.fillRect(14, 22, 4, 2);
    szctx.fillRect(15, 42, 2, 10);
    szctx.fillRect(13, 42, 6, 2);
    szctx.fillRect(14, 40, 4, 2);
    scene.textures.addCanvas('zone_shrink', sizeZoneCanvas);

    // 4. Зона гравитации (фиолетовая, 32x64 px)
    const gravZoneCanvas = document.createElement('canvas');
    gravZoneCanvas.width = size;
    gravZoneCanvas.height = size * 2;
    const gzctx = gravZoneCanvas.getContext('2d')!;
    gzctx.fillStyle = 'rgba(147, 51, 234, 0.25)';
    gzctx.fillRect(0, 0, size, size * 2);
    gzctx.fillStyle = C.GRAVITY_PURPLE_LIGHT;
    // Стрелки гравитации вверх
    gzctx.fillRect(15, 20, 2, 24);
    gzctx.fillRect(13, 24, 6, 2);
    gzctx.fillRect(14, 22, 4, 2);
    gzctx.fillRect(15, 20, 2, 2);
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
}
