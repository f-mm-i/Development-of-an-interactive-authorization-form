/**
 * Утилиты для создания анимаций
 */

export interface SnowflakeConfig {
  emoji: string;
  interval: number;
  lifetime: number;
}

export class SnowflakeManager {
  private config: SnowflakeConfig;
  private intervalId: number | null = null;

  constructor(
    config: SnowflakeConfig = {
      emoji: '🍉',
      interval: 300,
      lifetime: 10000
    }
  ) {
    this.config = config;
  }

  public start(): void {
    if (this.intervalId !== null) {
      return; // Уже запущено
    }

    this.intervalId = window.setInterval(() => {
      if (document.hasFocus()) {
        this.createSnowflake();
      }
    }, this.config.interval);
  }

  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private createSnowflake(): void {
    const snowflake = document.createElement('span');
    snowflake.className = 'snowflake';
    snowflake.textContent = this.config.emoji;
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.animationDuration = 5 + Math.random() * 5 + 's';
    snowflake.style.opacity = String(Math.random());

    document.body.appendChild(snowflake);

    // Удаление снежинки через заданное время
    setTimeout(() => {
      if (snowflake.parentNode) {
        snowflake.remove();
      }
    }, this.config.lifetime);
  }

  public changeEmoji(emoji: string): void {
    this.config.emoji = emoji;
  }

  public changeInterval(interval: number): void {
    this.config.interval = interval;

    // Перезапуск с новым интервалом
    if (this.intervalId !== null) {
      this.stop();
      this.start();
    }
  }
}
