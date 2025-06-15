import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  saveEmail,
  getSavedEmail,
  removeSavedEmail,
  saveUserData,
  getUserData,
  isLocalStorageAvailable
} from '../storage';

// Мокирование localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('Работа с localStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveEmail', () => {
    it('должен сохранять email в localStorage', () => {
      saveEmail('test@example.com');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'savedEmail',
        'test@example.com'
      );
    });

    it('должен обрабатывать ошибки при сохранении', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      saveEmail('test@example.com');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getSavedEmail', () => {
    it('должен возвращать сохраненный email', () => {
      mockLocalStorage.getItem.mockReturnValue('test@example.com');

      const result = getSavedEmail();

      expect(result).toBe('test@example.com');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('savedEmail');
    });

    it('должен возвращать null, если email не сохранен', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = getSavedEmail();

      expect(result).toBeNull();
    });

    it('должен обрабатывать ошибки при получении данных', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = getSavedEmail();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('removeSavedEmail', () => {
    it('должен удалять сохраненный email', () => {
      removeSavedEmail();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('savedEmail');
    });

    it('должен обрабатывать ошибки при удалении', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      removeSavedEmail();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('saveUserData', () => {
    it('должен сохранять email, если он указан', () => {
      saveUserData({ savedEmail: 'test@example.com', rememberMe: true });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'savedEmail',
        'test@example.com'
      );
    });

    it('должен удалять email, если rememberMe = false', () => {
      saveUserData({ rememberMe: false });
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('savedEmail');
    });
  });

  describe('getUserData', () => {
    it('должен возвращать данные пользователя с сохраненным email', () => {
      mockLocalStorage.getItem.mockReturnValue('test@example.com');

      const result = getUserData();

      expect(result).toEqual({
        savedEmail: 'test@example.com',
        rememberMe: true
      });
    });

    it('должен возвращать данные без email, если он не сохранен', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = getUserData();

      expect(result).toEqual({
        rememberMe: false
      });
    });
  });

  describe('isLocalStorageAvailable', () => {
    it('должен возвращать true, если localStorage доступен', () => {
      // Убеждаемся, что моки работают нормально
      mockLocalStorage.setItem.mockImplementation(() => {});
      mockLocalStorage.removeItem.mockImplementation(() => {});

      const result = isLocalStorageAvailable();
      expect(result).toBe(true);
    });

    it('должен возвращать false, если localStorage недоступен', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage not available');
      });

      const result = isLocalStorageAvailable();
      expect(result).toBe(false);
    });
  });
});
