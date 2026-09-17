export const EVENTS = {
  // Игровой цикл
  LEVEL_START: 'level_start',
  LEVEL_RESTART: 'level_restart',
  LEVEL_COMPLETE: 'level_complete',
  CHAPTER_COMPLETE: 'chapter_complete',
  PLAYER_DEATH: 'player_death',
  CHECKPOINT_REACHED: 'checkpoint_reached',
  FIRST_INPUT: 'first_input',
  
  // UI & HUD
  UPDATE_DEATHS: 'update_deaths',
  UPDATE_TIMER: 'update_timer',
  PAUSE_REQUEST: 'pause_request',
  PAUSE_STATE_CHANGED: 'pause_state_changed',
  PAUSE_TOGGLE: 'pause_toggle',
  RESUME_GAME: 'resume_game',
  RETRY_LEVEL: 'retry_level',
  GOTO_LEVEL_SELECT: 'goto_level_select',
  GOTO_MENU: 'goto_menu',
  ORIENTATION_CHANGE: 'orientation_change',
  CONTINUE_AFTER_ROTATE: 'continue_after_rotate',
  CONTROL_MODIFIED: 'control_modified',
  
  // Настройки
  SETTINGS_CHANGED: 'settings_changed',
  
  // Аудио
  PLAY_SOUND: 'play_sound'
} as const;
