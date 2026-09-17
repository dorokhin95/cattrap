# Карта проекта — CatTrap

## Структура каталогов и файлов

```
cattrap/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Автосборка и деплой на GitHub Pages
├── docs/
│   ├── ARCHITECTURE.md             # Архитектура систем и сцен Phaser
│   ├── CHANGELOG.md                # История изменений
│   ├── DECISIONS.md                # Журнал архитектурных решений (ADR)
│   ├── GAME_DESIGN.md              # Геймдизайн, физика котика, анимации и тайминги
│   ├── LEVEL_DESIGN.md             # Описание и схемы уровней 1–10 Главы 1
│   ├── PLATFORMS.md                # Telegram Mini App, Web, Safe Area, Адаптивность
│   ├── PROJECT_MAP.md              # Карта проекта (этот файл)
│   └── TZ.md                       # Полное техническое задание
├── public/
│   └── favicon.ico                 # Иконка приложения
├── src/
│   ├── assets/
│   │   └── PixelArtGenerator.ts    # Процедурная генерация пиксель-арта котика и ловушек
│   ├── audio/
│   │   ├── AudioManager.ts         # Менеджер громкости, настроек и состояний аудио
│   │   └── SoundSynthesizer.ts     # Процедурный синтез звуковых ретро-эффектов и chiptune BGM
│   ├── core/
│   │   ├── Constants.ts            # Глобальные константы физики, таймингов и тайлов
│   │   └── Events.ts               # Типизированная шина игровых событий
│   ├── game/
│   │   ├── CameraSystem.ts         # Адаптивная камера (portrait/landscape, look-ahead)
│   │   ├── entities/
│   │   │   └── Cat.ts              # Сущность котика: физика, coyote time, jump buffer, состояния
│   │   ├── hazards/
│   │   │   ├── Checkpoint.ts       # Коробка-сохранение спауна
│   │   │   ├── CrumbleBlock.ts     # Осыпающиеся блоки
│   │   │   ├── FallingBlock.ts     # Падающие 2×2 потолочные блоки
│   │   │   ├── FakeFloor.ts        # Обманный опускающийся пол
│   │   │   ├── HazardBase.ts       # Базовый класс опасных объектов
│   │   │   ├── ModifierZone.ts     # Зоны изменения размера (Shrink) и гравитации (Gravity)
│   │   │   ├── MovingPortal.ts     # Убегающий портал
│   │   │   ├── PopSpike.ts         # Выдвижной шип в полу
│   │   │   └── StaticSpike.ts      # Статический шип с честным хитбоксом
│   │   ├── levels/
│   │   │   ├── LevelData.ts        # Типы и структуры данных уровней
│   │   │   ├── LevelRegistry.ts    # Реестр и загрузчик уровней 1–10
│   │   │   ├── level01.ts          # Уровень 1: «Первый подвох»
│   │   │   ├── level02.ts          # Уровень 2: «Не стой»
│   │   │   ├── level03.ts          # Уровень 3: «Подожди, куда?»
│   │   │   ├── level04.ts          # Уровень 4: «Беги, кот»
│   │   │   ├── level05.ts          # Уровень 5: «Смотри вверх»
│   │   │   ├── level06.ts          # Уровень 6: «Пол врёт»
│   │   │   ├── level07.ts          # Уровень 7: «Маленький кот»
│   │   │   ├── level08.ts          # Уровень 8: «Лапами вверх»
│   │   │   ├── level09.ts          # Уровень 9: «Почти дошёл»
│   │   │   └── level10.ts          # Уровень 10: «Девять жизней»
│   │   └── triggers/
│   │       └── TriggerManager.ts   # Детерминированный менеджер триггеров и условий
│   ├── platform/
│   │   ├── BrowserPlatformService.ts # Адаптер для стандартного браузера и GitHub Pages
│   │   ├── PlatformManager.ts      # Менеджер активного платформенного адаптера
│   │   ├── PlatformService.ts      # Интерфейс платформенного взаимодействия
│   │   └── TelegramPlatformService.ts # Адаптер Telegram WebApp (safe areas, BackButton, haptics)
│   ├── save/
│   │   └── SaveProvider.ts         # Управление сохранениями (localStorage + абстракция под Cloud)
│   ├── scenes/
│   │   ├── BootScene.ts            # Генерация ассетов, предзагрузка, инициализация аудио/платформы
│   │   ├── GameScene.ts            # Основной геймплей: тайлы, физика, спавн, рестарт за 350мс
│   │   ├── LevelSelectScene.ts     # Экран выбора уровней (сетка 1-10, статус, замки, рекорды)
│   │   ├── MenuScene.ts            # Главное меню (Играть/Продолжить, Уровни, Настройки, анимированный кот)
│   │   └── UIScene.ts              # HUD, тач-кнопки, экраны паузы, настроек, триумфа, смены ориентации
│   ├── types/
│   │   └── index.ts                # Общие интерфейсы, enum'ы и псевдонимы типов
│   ├── ui/
│   │   └── TouchControls.ts        # Экранные сенсорные контроллеры с адаптивной геометрией
│   ├── main.ts                     # Точка входа приложения, конфигурация Phaser.Game
│   └── style.css                   # Глобальные стили (safe-area, canvas-контейнер, шрифты)
├── tests/
│   ├── cat-physics.test.ts         # Тесты физики (coyote time, jump buffer, переменный прыжок)
│   ├── hazards.test.ts             # Тесты хитбоксов и логики ловушек
│   ├── levels.test.ts              # Тесты валидности структуры всех 10 уровней
│   └── save-provider.test.ts       # Тесты сохранения и загрузки прогресса
├── index.html                      # Корневой HTML-файл с метатегами для Telegram и мобильных браузеров
├── package.json                    # Зависимости и скрипты проекта
├── tsconfig.json                   # Конфигурация компилятора TypeScript
└── vite.config.ts                  # Конфигурация сборщика Vite
```
