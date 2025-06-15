import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthForm } from '../AuthForm';

// Мокирование DOM элементов
const createMockElement = (id: string, tagName: string = 'div') => {
  const element = document.createElement(tagName);
  element.id = id;
  return element;
};

describe('AuthForm', () => {
  let authForm: AuthForm;
  let mockForm: HTMLFormElement;
  let mockEmailInput: HTMLInputElement;
  let mockPasswordInput: HTMLInputElement;
  let mockRememberCheckbox: HTMLInputElement;
  let mockSubmitButton: HTMLButtonElement;
  let mockMessageBox: HTMLDivElement;

  const mockConfig = {
    correctEmail: 'test@example.com',
    correctPassword: 'password123',
    socialNetworks: [{ id: 'vk' as const, name: 'VK', color: '#4c75a3' }]
  };

  beforeEach(() => {
    // Создание моков DOM элементов
    mockForm = createMockElement('login-form', 'form') as HTMLFormElement;
    mockEmailInput = createMockElement('email', 'input') as HTMLInputElement;
    mockPasswordInput = createMockElement(
      'password',
      'input'
    ) as HTMLInputElement;
    mockRememberCheckbox = createMockElement(
      'remember',
      'input'
    ) as HTMLInputElement;
    mockSubmitButton = createMockElement(
      'submit-btn',
      'button'
    ) as HTMLButtonElement;
    mockMessageBox = createMockElement('message', 'div') as HTMLDivElement;

    // Настройка типов input
    mockEmailInput.type = 'email';
    mockPasswordInput.type = 'password';
    mockRememberCheckbox.type = 'checkbox';
    mockSubmitButton.type = 'submit';

    // Добавление элементов в DOM
    document.body.appendChild(mockForm);
    document.body.appendChild(mockEmailInput);
    document.body.appendChild(mockPasswordInput);
    document.body.appendChild(mockRememberCheckbox);
    document.body.appendChild(mockSubmitButton);
    document.body.appendChild(mockMessageBox);

    // Мокирование методов
    mockForm.reset = vi.fn();
    mockForm.addEventListener = vi.fn();
    mockEmailInput.addEventListener = vi.fn();
    mockPasswordInput.addEventListener = vi.fn();
    mockSubmitButton.classList = {
      toggle: vi.fn(),
      add: vi.fn(),
      remove: vi.fn()
    } as any;

    // Мокирование localStorage
    const mockLocalStorage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      configurable: true
    });

    // Мокирование querySelectorAll для социальных кнопок
    document.querySelectorAll = vi.fn().mockReturnValue([]);
  });

  afterEach(() => {
    // Очистка DOM
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('Инициализация', () => {
    it('должен создавать экземпляр AuthForm', () => {
      authForm = new AuthForm(mockConfig);
      expect(authForm).toBeInstanceOf(AuthForm);
    });

    it('должен выбрасывать ошибку, если элемент не найден', () => {
      document.body.innerHTML = '';

      expect(() => {
        new AuthForm(mockConfig);
      }).toThrow('не найден');
    });

    it('должен привязывать обработчики событий', () => {
      authForm = new AuthForm(mockConfig);

      expect(mockForm.addEventListener).toHaveBeenCalledWith(
        'submit',
        expect.any(Function)
      );
      expect(mockEmailInput.addEventListener).toHaveBeenCalledWith(
        'input',
        expect.any(Function)
      );
    });
  });

  describe('Валидация формы', () => {
    beforeEach(() => {
      authForm = new AuthForm(mockConfig);
    });

    it('должен показывать ошибку для невалидных данных', () => {
      mockEmailInput.value = 'invalid-email';
      mockPasswordInput.value = '123';

      const event = new Event('submit');
      event.preventDefault = vi.fn();

      // Получаем обработчик submit из мока
      const submitHandler = (mockForm.addEventListener as any).mock.calls.find(
        (call: any) => call[0] === 'submit'
      )[1];

      submitHandler(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockMessageBox.textContent).toContain('правильность');
    });
  });

  describe('Состояние формы', () => {
    beforeEach(() => {
      authForm = new AuthForm(mockConfig);
    });

    it('должен возвращать текущее состояние', () => {
      const state = authForm.getState();

      expect(state).toHaveProperty('isLoading');
      expect(state).toHaveProperty('message');
      expect(state).toHaveProperty('messageType');
    });

    it('должен сбрасывать форму', () => {
      authForm.reset();

      expect(mockForm.reset).toHaveBeenCalled();
      expect(mockMessageBox.textContent).toBe('');
    });
  });

  describe('Обработка успешной авторизации', () => {
    beforeEach(() => {
      authForm = new AuthForm(mockConfig);
      mockEmailInput.value = mockConfig.correctEmail;
      mockPasswordInput.value = mockConfig.correctPassword;
      mockRememberCheckbox.checked = true;
    });

    it('должен обрабатывать успешную авторизацию', async () => {
      const event = new Event('submit');
      event.preventDefault = vi.fn();

      const submitHandler = (mockForm.addEventListener as any).mock.calls.find(
        (call: any) => call[0] === 'submit'
      )[1];

      submitHandler(event);

      // Ожидаем завершения асинхронной операции
      await new Promise(resolve => setTimeout(resolve, 1300));

      expect(mockMessageBox.textContent).toContain('Успешный');
    });
  });
});
