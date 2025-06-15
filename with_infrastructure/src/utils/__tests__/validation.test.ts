import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateLoginForm
} from '../validation';

describe('Валидация email', () => {
  it('должен принимать корректные email адреса', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('name+tag@example.org')).toBe(true);
  });

  it('должен отклонять некорректные email адреса', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('test@domain')).toBe(false);
  });
});

describe('Валидация пароля', () => {
  it('должен принимать пароли длиной 8 или более символов', () => {
    expect(validatePassword('12345678')).toBe(true);
    expect(validatePassword('password123')).toBe(true);
    expect(validatePassword('VeryLongPassword!')).toBe(true);
  });

  it('должен отклонять пароли короче 8 символов', () => {
    expect(validatePassword('123456')).toBe(false);
    expect(validatePassword('pass')).toBe(false);
    expect(validatePassword('')).toBe(false);
    expect(validatePassword('1234567')).toBe(false);
  });
});

describe('Комплексная валидация формы', () => {
  it('должен возвращать успешную валидацию для корректных данных', () => {
    const result = validateLoginForm({
      email: 'test@example.com',
      password: 'validpassword',
      remember: true
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('должен возвращать ошибки для некорректного email', () => {
    const result = validateLoginForm({
      email: 'invalid-email',
      password: 'validpassword',
      remember: false
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('email');
    expect(result.errors[0].message).toBe('Некорректный формат email');
  });

  it('должен возвращать ошибки для короткого пароля', () => {
    const result = validateLoginForm({
      email: 'test@example.com',
      password: '123',
      remember: false
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('password');
    expect(result.errors[0].message).toBe(
      'Пароль должен содержать минимум 8 символов'
    );
  });

  it('должен возвращать ошибки для пустых полей', () => {
    const result = validateLoginForm({
      email: '',
      password: '',
      remember: false
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);

    const fieldNames = result.errors.map(e => e.field);
    expect(fieldNames).toContain('email');
    expect(fieldNames).toContain('password');
  });

  it('должен возвращать несколько ошибок одновременно', () => {
    const result = validateLoginForm({
      email: 'invalid-email',
      password: '123',
      remember: false
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});
