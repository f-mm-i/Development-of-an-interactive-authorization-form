/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // Базовые настройки
  base: './',

  // Настройки сборки
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    target: 'es2022',
    rollupOptions: {
      input: {
        main: resolve(fileURLToPath(new URL('./index.html', import.meta.url)))
      }
    }
  },

  // Настройки разработки
  server: {
    port: 3000,
    open: true,
    host: true
  },

  // Алиасы путей
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@/utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@/components': fileURLToPath(
        new URL('./src/components', import.meta.url)
      )
    }
  },

  // Настройки тестирования для Vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
});
