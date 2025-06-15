import type { LocalStorageData } from '@/types/auth';

const STORAGE_KEYS = {
  SAVED_EMAIL: 'savedEmail',
  REMEMBER_ME: 'rememberMe'
} as const;

/**
 * Сохранение email в localStorage
 */
export function saveEmail(email: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_EMAIL, email);
  } catch (error) {
    console.warn('Не удалось сохранить email в localStorage:', error);
  }
}

/**
 * Получение сохраненного email из localStorage
 */
export function getSavedEmail(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.SAVED_EMAIL);
  } catch (error) {
    console.warn('Не удалось получить email из localStorage:', error);
    return null;
  }
}

/**
 * Удаление сохраненного email из localStorage
 */
export function removeSavedEmail(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVED_EMAIL);
  } catch (error) {
    console.warn('Не удалось удалить email из localStorage:', error);
  }
}

/**
 * Сохранение данных пользователя
 */
export function saveUserData(data: LocalStorageData): void {
  if (data.savedEmail) {
    saveEmail(data.savedEmail);
  }
  if (data.rememberMe === false) {
    removeSavedEmail();
  }
}

/**
 * Получение всех сохраненных данных пользователя
 */
export function getUserData(): LocalStorageData {
  const savedEmail = getSavedEmail();
  const result: LocalStorageData = {
    rememberMe: savedEmail !== null
  };

  if (savedEmail) {
    result.savedEmail = savedEmail;
  }

  return result;
}

/**
 * Проверка доступности localStorage
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
