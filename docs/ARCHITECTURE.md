# Архитектура — CatTrap

## 1. Обзор архитектуры

CatTrap построен на модульной компонентной архитектуре с разделением ответственности на независимые слои:

```mermaid
graph TD
    Entry[main.ts] --> PhaserGame[Phaser.Game]
    PhaserGame --> BootScene
    PhaserGame --> MenuScene
    PhaserGame --> LevelSelectScene
    PhaserGame --> GameScene
    PhaserGame --> UIScene

    GameScene --> Cat[Cat Entity]
    GameScene --> HazardManager[Hazards & Objects]
    GameScene --> TriggerManager[Deterministic Triggers]
    GameScene --> CameraSystem[Camera System]

    HazardManager --> StaticSpike
    HazardManager --> PopSpike
    HazardManager --> CrumbleBlock
    HazardManager --> FallingBlock
    HazardManager --> FakeFloor
    HazardManager --> MovingPortal
    HazardManager --> ModifierZone
    HazardManager --> Checkpoint

    GameScene -.-> UIScene
    GameScene --> SaveProvider[SaveProvider]
    GameScene --> AudioManager[AudioManager]
    GameScene --> PlatformManager[PlatformManager]

    AudioManager --> SoundSynthesizer[WebAudio Synthesizer]
    PlatformManager --> TelegramService[TelegramPlatformService]
    PlatformManager --> BrowserService[BrowserPlatformService]
```

---

## 2. Сцены Phaser 3

1. **`BootScene`**:
   - Стартовая сцена прелоадера.
   - Вызывает `PixelArtGenerator` для генерации всех процедурных пиксель-арт текстур котика, тайлов, ловушек, частиц и портала.
   - Инициализирует `PlatformManager` (вызывает `Telegram.WebApp.ready()`, `expand()`).
   - Инициализирует `AudioManager` и звуковой синтезатор.
   - Переключается на `MenuScene`.

2. **`MenuScene`**:
   - Главное меню.
   - Отображает логотип CatTrap, анимированного котика, портал.
   - Кнопки: «Играть / Продолжить (Уровень X)», «Выбор уровня», «Настройки».
   - Адаптируется под portrait и landscape. Корректно отписывается от `scale.resize` при SHUTDOWN.

3. **`LevelSelectScene`**:
   - Сетка уровней 1–10.
   - Индикация пройденных уровней (`✓`), текущего открытого уровня, заблокированных уровней (замочек), лучшего времени и числа смертей.
   - Кнопка возврата в меню. Корректная отписка от `scale.resize` при SHUTDOWN.

4. **`GameScene`**:
   - Основной геймплей.
   - Загружает данные уровня (`LevelData`).
   - Физика: Arcade Physics с фиксированным шагом (`fixedStep: true`, 60 Гц).
   - Единоразовая настройка коллайдеров при создании уровня.
   - Мгновенный цикл рестарта при смерти:
     - 0–80 мс: Hit-stop (заморозка)
     - 80–250 мс: Анимация смерти котика + звук + вибрация (Haptics)
     - <400 мс: Мгновенный сброс уровня через `Cat.respawn()` без пересоздания спрайта кота и без утечки коллайдеров в физическом мире.
   - Честная пауза: заморозка физики, часов сцены (`time.paused = true`), твинов и анимаций.
   - Полная очистка слушателей (`scale.resize`, `game.events`, BackButton) при SHUTDOWN.

5. **`UIScene`**:
   - Оверлей пользовательского интерфейса, работающий параллельно с `GameScene`.
   - Верхний HUD: кнопка паузы, номер уровня, таймер попытки.
   - Сенсорные экранные кнопки управления (влево, вправо, прыжок) с защитой от перехвата владения касаниями (Multi-touch lock).
   - Меню паузы (50% затемнение экрана, «Продолжить», «Начать заново», «Выбор уровня», «Настройки», «Главное меню»).
   - Экран настроек с сохранением источника открытия (`settingsOrigin: 'menu' | 'pause'`).
   - Экран «Глава пройдена!» после 10 уровня.
   - Бесшовный прозрачный ресайз при повороте устройства без блокирующих модальных окон.

---

## 3. Детерминированная система триггеров (`TriggerManager`)

Каждый уровень описывается декларативными данными (`LevelData`):
- `spawn`: `{ x, y }`
- `solidTiles`: массив твердых блоков
- `hazards`: список объектов и ловушек
- `triggers`: массив детерминированных условий активации

Условия (`condition`):
- `player_x_greater` / `player_x_less`
- `player_y_greater`
- `player_dist_portal`
- `custom`

Действия (`action`):
- `pop` — поднять выдвижной шип
- `drop` — запустить падение потолочного блока
- `collapse` — начать разрушение обманного пола
- `move_portal` — переместить портал на следующую точку
- `chain_pop` — последовательный запуск шипов с интервалом 120 мс

Каждый триггер поддерживает:
- `delayMs`: задержка перед исполнением в мс (на часах сцены Phaser `delayedCall`, автоматически замирающих при паузе)
- `once`: однократное или повторяющееся действие
- `resetOnDeath`: сброс в исходное состояние при рестарте (или сохранение активности)

---

## 4. Платформенный слой (`PlatformService`)

Платформенный слой изолирует все специфичные вызовы окружения:
- `BrowserPlatformService` — базовый веб, обработка клавиатуры, стандартный `localStorage`.
- `TelegramPlatformService` — интеграция с Telegram WebApp:
  - `Telegram.WebApp.ready()` и `expand()`
  - Отключение вертикальных свайпов для предотвращения случайного закрытия шторки
  - Обработка `safeAreaInset` и `contentSafeAreaInset`
  - Интеграция с нативной `BackButton` (в игре -> пауза, в паузе -> возврат)
  - `HapticFeedback.impactOccurred` / `notificationOccurred` (смерть, победа).

---

## 5. Аудиосистема (`SoundSynthesizer`)

Все звуки синтезируются в реальном времени через `AudioContext` (WebAudio API):
- Не требует загрузки внешних `.wav` / `.mp3` файлов.
- Нулевые сетевые задержки и мгновенная доступность в Telegram Mini App.
- Процедурный синтез ретро-звуков (прыжок, приземление, хруст шипа, разрушение блока, смена гравитации, вход в портал, клик UI).
- Ненавязчивый спокойный chiptune-loop с возможностью отключения в настройках.
- Автоматическая пауза при потере фокуса (`visibilitychange`, `blur`).
