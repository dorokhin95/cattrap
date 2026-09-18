export const CONSTANTS = {
  // Размеры сетки и спрайтов
  TILE_SIZE: 32,
  CAT_SPRITE_SIZE: 24,
  
  // Коллайдеры котика
  CAT_COLLIDER_WIDTH: 14,
  CAT_COLLIDER_HEIGHT: 19,
  CAT_COLLIDER_OFFSET_X: 5,
  CAT_COLLIDER_OFFSET_Y: 5,

  // Коллайдер маленького котика (уменьшение до ~68%)
  CAT_SMALL_SCALE: 0.68,
  CAT_SMALL_COLLIDER_WIDTH: 10,
  CAT_SMALL_COLLIDER_HEIGHT: 13,
  CAT_SMALL_COLLIDER_OFFSET_X: 7,
  CAT_SMALL_COLLIDER_OFFSET_Y: 9,

  // Физика движения
  MOVE_SPEED: 160,       // 5 tiles/sec при тайле 32px
  ACCELERATION: 1000,    // Достигает максимальной скорости за ~0.16 сек
  DECELERATION: 1200,    // Быстрая остановка
  AIR_CONTROL: 0.85,     // 85% управления в воздухе
  GRAVITY: 980,          // Стандартная гравитация
  JUMP_VELOCITY: -420,   // Высота прыжка 2.81 тайла (90 px): 420^2 / (2 * 980) = 90
  VARIABLE_JUMP_CUTOFF: 0.5, // Срез скорости при раннем отпускании прыжка

  // Честные тайминги
  COYOTE_TIME_MS: 110,   // 90-110 мс
  JUMP_BUFFER_MS: 130,   // 100-130 мс

  // Тайминги смерти и рестарта
  HITSTOP_DURATION_MS: 60,
  DEATH_ANIM_DURATION_MS: 250,
  TOTAL_RESTART_TIME_MS: 350, // Меньше 0.5 сек

  // Ловушки
  HAZARD_HITBOX_RATIO: 0.70, // 70% площади графики шипа (честный хитбокс)
  POP_SPIKE_RISE_TIME_MS: 120,
  CRUMBLE_SHAKE_DELAY_MS: 150,
  CRUMBLE_FALL_DELAY_MS: 450,
  FALLING_BLOCK_SHAKE_MS: 100,
  FALLING_BLOCK_DROP_MS: 220,
  FAKE_FLOOR_DROP_DELAY_MS: 180,
  FAKE_FLOOR_VANISH_MS: 350,

  // Камера
  LANDSCAPE_TILES_X: 18,
  PORTRAIT_TILES_X: 10,
  CAMERA_LOOKAHEAD_TILES: 1.8, // 1.5 - 2.0 тайла

  // Механики Главы 2
  BOUNCE_IMPULSE: -520,
  BOUNCE_COOLDOWN_MS: 120,
  CONVEYOR_SPEED: 90,
  MOVING_PLATFORM_SPEED: 65,
  CRUSHER_WARNING_MS: 220,
  CRUSHER_SLAM_MS: 120,
  CRUSHER_HOLD_MS: 350,
  CRUSHER_RETRACT_MS: 300,

  // Цвета пиксель-арта
  COLORS: {
    BG_DARK: '#181622',
    BG_LIGHT: '#252136',
    PLATFORM_DARK: '#312c44',
    PLATFORM_LIGHT: '#433c5b',
    PLATFORM_OUTLINE: '#1d1a29',
    CRUMBLE: '#544b70',
    CRUMBLE_CRACK: '#8a7fa8',
    SPIKE: '#e11d48',
    SPIKE_LIGHT: '#fb7185',
    SIZE_CYAN: '#06b6d4',
    SIZE_CYAN_LIGHT: '#67e8f9',
    GRAVITY_PURPLE: '#9333ea',
    GRAVITY_PURPLE_LIGHT: '#c084fc',
    CHECKPOINT_BOX: '#d97706',
    PORTAL_PURPLE: '#7c3aed',
    PORTAL_CORE: '#c084fc',
    CAT_BODY: '#f59e42',
    CAT_LIGHT: '#fcd34d',
    CAT_DARK: '#2d2a32',
    CAT_MUZZLE: '#fffbeb',
    CAT_EYE: '#1e1e24',
    CAT_COLLAR: '#e11d48',
    // Глава 2
    BG_BASE_CH2: '#101923',
    BG_SECONDARY_CH2: '#162634',
    BG_OBJECT_CH2: '#1e3443',
    PLATFORM_CH2: '#232f3d',
    PLATFORM_CH2_LIGHT: '#344558',
    ACCENT_TEAL: '#22d3c5',
    ACCENT_BLUE: '#38bdf8',
    CONVEYOR_ARROW: '#38bdf8',
    BOUNCE_SPRING: '#f59e0b',
    TOGGLE_ACTIVE: '#22d3c5',
    TOGGLE_INACTIVE: '#162634',
    CRUSHER_BODY: '#334155',
    BUTTON_UP: '#e11d48',
    BUTTON_DOWN: '#10b981',
    // Глава 3: Матрица
    BG_BASE_CH3: '#070a14',
    BG_SECONDARY_CH3: '#0f172a',
    BG_OBJECT_CH3: '#1e1b4b',
    PLATFORM_CH3: '#1e2238',
    PLATFORM_CH3_LIGHT: '#2d3354',
    NEON_CYAN: '#06b6d4',
    NEON_MAGENTA: '#ec4899',
    NEON_PURPLE: '#a855f7',
    LASER_BEAM: '#f43f5e',
    LASER_CORE: '#ffffff',
    WARP_IN: '#06b6d4',
    WARP_OUT: '#ec4899',
    // Глава 4: Катакомбы
    BG_BASE_CH4: '#121118',
    BG_SECONDARY_CH4: '#1a1923',
    BG_OBJECT_CH4: '#23222e',
    PLATFORM_CH4: '#2a2838',
    PLATFORM_CH4_LIGHT: '#3d3a52',
    BOULDER_DARK: '#1f1e29',
    BOULDER_MID: '#383547',
    BOULDER_LIGHT: '#524e68'
  }
} as const;
