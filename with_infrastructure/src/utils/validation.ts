import type {
  LoginCredentials,
  ValidationResult,
  ValidationError
} from '@/types/auth';

/**
 * Валидация email адреса
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Валидация пароля
 */
export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Комплексная валидация формы
 */
export function validateLoginForm(
  credentials: LoginCredentials
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!credentials.email) {
    errors.push({
      field: 'email',
      message: 'Email обязателен для заполнения'
    });
  } else if (!validateEmail(credentials.email)) {
    errors.push({
      field: 'email',
      message: 'Некорректный формат email'
    });
  }

  if (!credentials.password) {
    errors.push({
      field: 'password',
      message: 'Пароль обязателен для заполнения'
    });
  } else if (!validatePassword(credentials.password)) {
    errors.push({
      field: 'password',
      message: 'Пароль должен содержать минимум 8 символов'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Установка визуальных ошибок на поля формы
 */
export function setFieldErrors(errors: ValidationError[]): void {
  // Сброс всех ошибок
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;

  if (emailInput) {
    emailInput.removeAttribute('data-error');
  }
  if (passwordInput) {
    passwordInput.removeAttribute('data-error');
  }

  // Установка новых ошибок
  errors.forEach(error => {
    const field = document.getElementById(error.field) as HTMLInputElement;
    if (field) {
      field.setAttribute('data-error', 'true');
    }
  });
}
