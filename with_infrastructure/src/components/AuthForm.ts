import type {
  LoginCredentials,
  AuthResponse,
  FormState,
  AuthFormConfig,
  MessageType,
  LocalStorageData
} from '@/types/auth';
import { validateLoginForm, setFieldErrors } from '@/utils/validation';
import { saveUserData, getUserData } from '@/utils/storage';

export class AuthForm {
  private form: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private passwordInput: HTMLInputElement;
  private rememberCheckbox: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private messageBox: HTMLElement;
  private config: AuthFormConfig;
  private state: FormState;

  constructor(config: AuthFormConfig) {
    this.config = config;
    this.state = {
      isLoading: false,
      message: '',
      messageType: 'info'
    };

    // Получение DOM элементов
    this.form = this.getRequiredElement('login-form') as HTMLFormElement;
    this.emailInput = this.getRequiredElement('email') as HTMLInputElement;
    this.passwordInput = this.getRequiredElement(
      'password'
    ) as HTMLInputElement;
    this.rememberCheckbox = this.getRequiredElement(
      'remember'
    ) as HTMLInputElement;
    this.submitButton = this.getRequiredElement(
      'submit-btn'
    ) as HTMLButtonElement;
    this.messageBox = this.getRequiredElement('message') as HTMLElement;

    this.initialize();
  }

  private getRequiredElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Элемент с ID "${id}" не найден`);
    }
    return element;
  }

  private initialize(): void {
    this.loadSavedData();
    this.bindEvents();
  }

  private loadSavedData(): void {
    const userData = getUserData();
    if (userData.savedEmail) {
      this.emailInput.value = userData.savedEmail;
      this.rememberCheckbox.checked = userData.rememberMe ?? false;
    }
  }

  private bindEvents(): void {
    // Обработка отправки формы
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    // Очистка сообщений при вводе
    this.emailInput.addEventListener('input', () => {
      this.clearMessage();
    });

    // Обработка социальных сетей
    this.bindSocialButtons();
  }

  private bindSocialButtons(): void {
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
      button.addEventListener('click', this.handleSocialLogin.bind(this));
    });
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();

    const credentials = this.getFormData();
    const validation = validateLoginForm(credentials);

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      this.showMessage('Проверьте правильность введённых данных', 'error');
      return;
    }

    this.authenticate(credentials);
  }

  private getFormData(): LoginCredentials {
    return {
      email: this.emailInput.value.trim(),
      password: this.passwordInput.value,
      remember: this.rememberCheckbox.checked
    };
  }

  private async authenticate(credentials: LoginCredentials): Promise<void> {
    this.setLoading(true);

    try {
      // Имитация API запроса
      const response = await this.simulateApiCall(credentials);

      if (response.success) {
        this.handleAuthSuccess(credentials, response);
      } else {
        this.handleAuthError(response.message);
      }
    } catch (error) {
      this.handleAuthError('Произошла ошибка при авторизации');
    } finally {
      this.setLoading(false);
    }
  }

  private simulateApiCall(
    credentials: LoginCredentials
  ): Promise<AuthResponse> {
    return new Promise(resolve => {
      setTimeout(() => {
        const isValid =
          credentials.email === this.config.correctEmail &&
          credentials.password === this.config.correctPassword;

        const response: AuthResponse = {
          success: isValid,
          message: isValid ? 'Успешный вход!' : 'Неверная почта или пароль'
        };

        if (isValid) {
          response.user = {
            id: '1',
            email: credentials.email,
            name: 'Пользователь'
          };
        }

        resolve(response);
      }, 1200);
    });
  }

  private handleAuthSuccess(
    credentials: LoginCredentials,
    response: AuthResponse
  ): void {
    this.showMessage(response.message, 'success');

    // Сохранение данных пользователя
    const userData: LocalStorageData = {
      rememberMe: credentials.remember
    };

    if (credentials.remember) {
      userData.savedEmail = credentials.email;
    }

    saveUserData(userData);
  }

  private handleAuthError(message: string): void {
    this.showMessage(message, 'error');
    this.passwordInput.value = '';
  }

  private handleSocialLogin(event: Event): void {
    const button = event.currentTarget as HTMLButtonElement;
    const network = button.dataset.network;

    if (network) {
      this.showMessage(`Авторизация через ${network.toUpperCase()}`, 'info');
      // Здесь можно добавить реальную логику авторизации через социальные сети
    }
  }

  private setLoading(isLoading: boolean): void {
    this.state.isLoading = isLoading;
    this.submitButton.classList.toggle('loading', isLoading);
    this.submitButton.disabled = isLoading;
  }

  private showMessage(message: string, type: MessageType): void {
    this.state.message = message;
    this.state.messageType = type;

    this.messageBox.className = `message ${type}`;
    this.messageBox.textContent = message;
  }

  private clearMessage(): void {
    this.messageBox.textContent = '';
    this.messageBox.className = 'message';
  }

  // Публичные методы для тестирования
  public getState(): FormState {
    return { ...this.state };
  }

  public reset(): void {
    this.form.reset();
    this.clearMessage();
    this.setLoading(false);
  }
}
