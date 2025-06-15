/**
 * Типы данных для авторизации
 */

export interface LoginCredentials {
  email: string;
  password: string;
  remember: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface FormState {
  isLoading: boolean;
  message: string;
  messageType: 'success' | 'error' | 'info';
}

export interface SocialNetwork {
  id: 'vk' | 'google' | 'facebook';
  name: string;
  color: string;
}

export type MessageType = 'success' | 'error' | 'info';

export interface AuthFormConfig {
  correctEmail: string;
  correctPassword: string;
  socialNetworks: SocialNetwork[];
}

export interface LocalStorageData {
  savedEmail?: string;
  rememberMe?: boolean;
}
