/**
 * Environment-aware logger utility
 * Provides safe logging that prevents sensitive information exposure in production
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LoggerConfig {
    enableInProduction: boolean
    sendToService?: (level: LogLevel, message: string, data?: unknown) => void
}

const defaultConfig: LoggerConfig = {
    enableInProduction: false,
}

class Logger {
    private config: LoggerConfig

    constructor(config: LoggerConfig = defaultConfig) {
        this.config = config
    }

    private shouldLog(): boolean {
        return import.meta.env.DEV || this.config.enableInProduction
    }

    error(message: string, error?: unknown): void {
        if (this.shouldLog()) {
            console.error(`[ERROR] ${message}`, error)
        } else {
            // In production, only log sanitized message
            console.error(`[ERROR] ${message}`)
        }

        // Send to error tracking service (e.g., Sentry)
        if (this.config.sendToService) {
            this.config.sendToService('error', message, error)
        }
    }

    warn(message: string, data?: unknown): void {
        if (this.shouldLog()) {
            console.warn(`[WARN] ${message}`, data)
        }

        if (this.config.sendToService) {
            this.config.sendToService('warn', message, data)
        }
    }

    info(message: string, data?: unknown): void {
        if (this.shouldLog()) {
            console.info(`[INFO] ${message}`, data)
        }

        if (this.config.sendToService) {
            this.config.sendToService('info', message, data)
        }
    }

    debug(message: string, data?: unknown): void {
        if (import.meta.env.DEV) {
            console.debug(`[DEBUG] ${message}`, data)
        }
    }
}

// Export singleton instance
export const logger = new Logger()

// Export class for custom configurations
export { Logger }
export type { LoggerConfig }
