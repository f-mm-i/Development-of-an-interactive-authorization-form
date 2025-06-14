# Разработка интерактивной формы авторизации

## Native

### Как запустить проект
1. Склонируйте репозиторий или скачайте архив с файлами.
2. Перейдите в папку: `native/`
3. Откройте файл `index.html` двойным щелчком мыши либо перетащите его в окно любого современного браузера (Chrome, Firefox, Edge).  
   • Никакого сервера или сборщика не требуется – всё работает локально.  
   • Для авто-перезагрузки удобно открыть папку в VS Code и запустить расширение **Live Server**.

### HTML
**Обоснование подхода к вёрстке**  
Форма построена «гибридом» трёх методик:  
* **Grid** – секция `.login-section` в центре экрана: `display:grid; place-items:center;` гарантирует вертикальное и горизонтальное выравнивание вне зависимости от размеров вьюпорта.  
* **Flex** – шапка/подвал (`justify-content:space-between`) и большинство внутренних блоков формы (колонки, горизонтальный ряд соц-кнопок). Flex даёт простой одноосный поток, именно то, что нужно для меню или вертикального списка элементов.  
* **Блочная** (стандартное потоковое расположение) используется там, где дополнительного управления не требуется.  
Такой микс обеспечивает лаконичный код и повышает адаптивность без избыточных медиа-правил.

### CSS
**Выбор брейкпоинтов**  
```
@media (max-width: 1024px)  // планшеты в альбомной ориентации
@media (max-width: 768px)   // большинство смартфонов и планшеты вертикально
@media (max-width: 480px)   // маленькие смартфоны
```
1. **1024 px** – точка, где десктопное меню начинает занимать слишком много места; уменьшаем базовый `font-size`.  
2. **768 px** – классический «tablet-portrait»: прячем горизонтальное меню и компактнее упаковываем форму.  
3. **480 px** – нижний предел для комфортного чтения на старых/малых телефонах; дополнительно урезаем внутренние паддинги.  
Брейкпоинты выбраны исходя из статистики устройств и собственных тестов; они перекрывают 95 % экранов без лишних intermediate-правил.

### JS
**1. Почему `localStorage`**  
Нужно запоминать E-mail между сессиями, чтобы упростить повторный логин. `localStorage` хранит данные бессрочно в браузере и доступен без асинхронных API.  
`sessionStorage` сбрасывается после закрытия вкладки, а cookies отправлялись бы на сервер (не нужно) и подчиняются отключению third-party cookies. Пароль специально *не* сохраняется – это чувствительные данные.

**2. Стрелочные vs именованные функции**  
*Именованные* (`function validateForm() {…}`) использовали для логически законченных, потенциально переиспользуемых операций – так стек вызовов читабельнее, а функцию можно вызвать до её определения (хоистинг).

*Стрелочные* (`const showMessage = (msg)=>{…}`) подошли для коротких одноразовых колбэков (слушатели событий, таймеры). Они короче и лексически наследуют `this`, что упрощает работу внутри анонимных обработчиков.

Больше всего понравились стрелочные: экономят место и читаются как «лямбда-выражения», но для крупных модулей удобнее классические именованные – легче искать в коде и профилировать.

---

## With-infrastructure

### Как запустить проект
#### Предварительные требования

1. **Установите Node.js через nvm:**

   ```bash
   # Установка nvm (если не установлен)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

   # Перезагрузите терминал или выполните:
   source ~/.bashrc

   # Используйте версию из .nvmrc
   nvm install
   nvm use
   ```

2. **Или используйте Git Bash / MINGW64 на Windows:**
   ```bash
   # В Git Bash / MINGW64 терминале
   cd with_infrastructure
   ```

#### Установка зависимостей

```bash
# Установка всех зависимостей
npm install

# Проверка версий
npm --version
node --version
```

#### Команды разработки

```bash
# 🚀 Запуск dev-сервера
npm run dev
# или
npm run serve

# 📦 Сборка проекта
npm run build

# 👀 Предварительный просмотр сборки
npm run preview

# 🔍 Проверка типов
npm run type-check
```

#### Команды качества кода

```bash
# 📋 Проверка линтером
npm run lint

# 🔧 Автоисправление ошибок линтера
npm run lint:fix

# 🎨 Форматирование кода
npm run format

# ✅ Проверка форматирования
npm run format:check
```

#### Команды тестирования

```bash
# 🧪 Запуск тестов
npm run test

# 📊 Тесты с покрытием
npm run test:coverage

# 🖥️ UI для тестов
npm run test:ui
```

### Менеджер пакетов: **npm**

**Обоснование выбора:**

- ✅ Стандартный инструмент, входящий в Node.js
- ✅ Отличная совместимость с Unix-системами
- ✅ Широкая поддержка и экосистема
- ✅ Простота использования и настройки
- ✅ Активное сообщество и регулярные обновления

### Версия Node.js: **18.19.0 LTS**

**Фиксация версии:**

- Файл `.nvmrc` для nvm
- Секция `engines` в `package.json`
- Совместимость с Unix-системами (Git Bash / MINGW64)

### TypeScript: **Строгая конфигурация**

**Обоснование выбора конфигурации:**

- ✅ `strict: true` - максимальная проверка типов
- ✅ `noUnusedLocals` и `noUnusedParameters` - контроль неиспользуемого кода
- ✅ `exactOptionalPropertyTypes` - строгость опциональных свойств
- ✅ `noImplicitReturns` - контроль возвращаемых значений
- ✅ `noUncheckedIndexedAccess` - безопасность доступа к массивам
- ✅ Path mapping для удобных импортов (`@/*`)

**Типы данных:**

- `LoginCredentials` - данные для авторизации
- `ValidationResult` - результат валидации
- `AuthResponse` - ответ сервера авторизации
- `FormState` - состояние UI формы
- `LocalStorageData` - данные в localStorage

### Сборщик: **Vite 5.0**

**Обоснование выбора:**

- ✅ Невероятно быстрая разработка с HMR
- ✅ Современный подход с ES modules
- ✅ Оптимизированная сборка с Rollup
- ✅ Минимальная конфигурация из коробки
- ✅ Отличная поддержка TypeScript
- ✅ Встроенный dev-сервер с proxy

**Конфигурация:**

- TypeScript support без дополнительных плагинов
- Path aliases для удобных импортов
- Source maps для отладки
- Terser для минификации
- Поддержка тестирования с Vitest

### Линтер: **ESLint 8.54**

**Обоснование выбора конфигурации:**

- ✅ `eslint:recommended` - базовые правила
- ✅ `@typescript-eslint/recommended` - TypeScript правила
- ✅ `@typescript-eslint/recommended-requiring-type-checking` - продвинутые правила
- ✅ `prettier` - интеграция с форматтером
- ✅ `eslint-plugin-html` - проверка HTML файлов

**Ключевые правила:**

- Строгие TypeScript правила
- Запрет `any` типов
- Контроль неиспользуемых переменных
- Обязательные explicit return types
- Консистентный стиль кода

### Форматтер: **Prettier 3.1**

**Обоснование выбора конфигурации:**

- ✅ `printWidth: 80` - стандартная ширина
- ✅ `singleQuote: true` - одинарные кавычки
- ✅ `semi: true` - точки с запятой
- ✅ `tabWidth: 2` - 2 пробела для отступов
- ✅ `endOfLine: "lf"` - Unix стиль переносов
- ✅ Автоматическое форматирование HTML, CSS, TypeScript

### Фреймворк тестирования: **Vitest 1.0**

**Обоснование выбора:**

- ✅ Встроенная интеграция с Vite
- ✅ Совместимость API с Jest
- ✅ Встроенный coverage через V8
- ✅ Поддержка TypeScript из коробки
- ✅ Graphical UI для тестов
- ✅ jsdom для тестирования DOM

**Конфигурация тестов:**

- Настройка jsdom environment
- Моки для localStorage
- Автоматическая очистка после тестов
- Coverage reporting

---

## Framework
*(планируется)*