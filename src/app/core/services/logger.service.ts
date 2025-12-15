import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export enum LogLevel {
    Debug = 0,
    Info = 1,
    Warn = 2,
    Error = 3,
    None = 4
}

@Injectable({ providedIn: 'root' })
export class LoggerService {
    private currentLogLevel: LogLevel;

    constructor() {
        this.currentLogLevel = this.getLogLevelFromEnvironment();
    }

    private getLogLevelFromEnvironment(): LogLevel {
        switch (environment.logLevel) {
            case 'debug':
                return LogLevel.Debug;
            case 'info':
                return LogLevel.Info;
            case 'warn':
                return LogLevel.Warn;
            case 'error':
                return LogLevel.Error;
            case 'none':
                return LogLevel.None;
            default:
                return environment.production ? LogLevel.Warn : LogLevel.Debug;
        }
    }

    debug(message: string, ...args: any[]): void {
        this.log(LogLevel.Debug, message, args);
    }

    info(message: string, ...args: any[]): void {
        this.log(LogLevel.Info, message, args);
    }

    warn(message: string, ...args: any[]): void {
        this.log(LogLevel.Warn, message, args);
    }

    error(message: string, error?: any, ...args: any[]): void {
        this.log(LogLevel.Error, message, [error, ...args]);

        // In production, send to error tracking service
        if (environment.production && error) {
            // TODO: Integrate with Sentry, LogRocket, or similar service
            // Example: Sentry.captureException(error);
        }
    }

    private log(level: LogLevel, message: string, args: any[]): void {
        if (level < this.currentLogLevel) {
            return;
        }

        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${LogLevel[level]}]`;

        switch (level) {
            case LogLevel.Debug:
                console.log(prefix, message, ...args);
                break;
            case LogLevel.Info:
                console.info(prefix, message, ...args);
                break;
            case LogLevel.Warn:
                console.warn(prefix, message, ...args);
                break;
            case LogLevel.Error:
                console.error(prefix, message, ...args);
                break;
        }
    }
}
