# История изменений (Changelog) — CatTrap

## [1.0.0] — 2026-09-17

### Добавлено:
- Инициализация проекта CatTrap на стеке Phaser 3 + TypeScript + Vite.
- Полная проектная документация: `TZ.md`, `PROJECT_MAP.md`, `ARCHITECTURE.md`, `GAME_DESIGN.md`, `LEVEL_DESIGN.md`, `PLATFORMS.md`, `DECISIONS.md`.
- Процедурный генератор пиксель-арт спрайтов `PixelArtGenerator` (котик 24×24 px со всеми анимациями: Idle, Run, Jump, Fall, Landing, Death, Portal; платформы, шипы, осыпающиеся плиты, падающие блоки, чекпоинт, зоны и портал).
- Физическое ядро `Cat` с коллайдером 14×19 px, фиксированным шагом 60 FPS, Coyote Time (100 мс), Jump Buffer (120 мс) и Variable Jump.
- Движок ловушек: Static Spike (уменьшенный хитбокс 70%), Pop Spike, Crumble Block, Falling Block (2×2 блок-платформа), Fake Floor, Moving Portal, Shrink Zone (68%), Gravity Zone, Checkpoint (`📦`).
- Детерминированный менеджер триггеров `TriggerManager`.
- 10 полностью готовых и проходимых уровней Главы 1 («Ничему не верь»).
- Сцены: `BootScene`, `MenuScene`, `LevelSelectScene`, `GameScene`, `UIScene`.
- Адаптивная камера с поддержкой Portrait (9–11 тайлов, look-ahead), Landscape (17–20 тайлов) и автопаузой при повороте экрана.
- Экранное сенсорное управление с защитой от залипания при респауне.
- Процедурный синтезатор звуков WebAudio API (`SoundSynthesizer`) и `AudioManager` (эффекты и мягкий chiptune loop).
- Платформенный слой `TelegramPlatformService` (safe areas, BackButton, haptics) и `BrowserPlatformService`.
- Сервис сохранения прогресса `SaveProvider` (localStorage, открытые уровни, рекорды, смерти, настройки).
- Автоматический деплой на GitHub Pages через GitHub Actions.
