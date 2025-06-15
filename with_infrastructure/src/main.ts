import { AuthForm } from '@/components/AuthForm';
import { SnowflakeManager } from '@/utils/animations';
import type { AuthFormConfig } from '@/types/auth';

/**
 * Конфигурация приложения
 */
const APP_CONFIG: AuthFormConfig = {
  correctEmail: 'student@example.com',
  correctPassword: 'Passw0rd!',
  socialNetworks: [
    { id: 'vk', name: 'VK', color: '#4c75a3' },
    { id: 'google', name: 'Google', color: '#db4437' },
    { id: 'facebook', name: 'Facebook', color: '#3b5998' }
  ]
};

/**
 * Инициализация приложения
 */
function initializeApp(): void {
  try {
    // Инициализация формы авторизации
    const authForm = new AuthForm(APP_CONFIG);

    // Инициализация анимации снежинок
    const snowflakeManager = new SnowflakeManager({
      emoji: '🍉',
      interval: 300,
      lifetime: 10000
    });

    snowflakeManager.start();

    // Глобальный доступ для отладки (только в development)
    if (import.meta.env.DEV) {
      (window as any).authForm = authForm;
      (window as any).snowflakeManager = snowflakeManager;
    }

    console.log('✅ Приложение успешно инициализировано');
  } catch (error) {
    console.error('❌ Ошибка инициализации приложения:', error);
  }
}

/**
 * Проверка готовности DOM
 */
function ensureDOMReady(callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

/**
 * Обработка ошибок приложения
 */
function setupErrorHandling(): void {
  window.addEventListener('error', event => {
    console.error('Глобальная ошибка:', event.error);
  });

  window.addEventListener('unhandledrejection', event => {
    console.error('Необработанное отклонение промиса:', event.reason);
  });
}

// Запуск приложения
setupErrorHandling();
ensureDOMReady(initializeApp);
