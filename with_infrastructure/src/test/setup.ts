import { vi } from 'vitest';

// Мокирование localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

// Мокирование sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

// Глобальные моки
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Мокирование focus
Object.defineProperty(document, 'hasFocus', {
  value: vi.fn(() => true)
});

// Очистка всех моков после каждого теста
afterEach(() => {
  vi.clearAllMocks();
});
