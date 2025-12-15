import { ErrorHandler, Injectable, inject } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private logger = inject(LoggerService);
    private notification = inject(NotificationService);

    handleError(error: Error | any): void {
        // Log the error
        this.logger.error('Unhandled error occurred', error);

        // Show user-friendly message
        const message = this.getUserFriendlyMessage(error);
        this.notification.error(message, 7000);

        // In production, you might want to send to error tracking service
        if (environment.production) {
            // TODO: Send to error tracking service
            // Example: Sentry.captureException(error);
        }

        // Re-throw in development for better debugging
        if (!environment.production) {
            throw error;
        }
    }

    private getUserFriendlyMessage(error: any): string {
        // Handle HTTP errors
        if (error?.status) {
            switch (error.status) {
                case 0:
                    return 'Unable to connect to server. Please check your internet connection.';
                case 400:
                    return error.error?.message || 'Invalid request. Please check your input.';
                case 401:
                    return 'Your session has expired. Please log in again.';
                case 403:
                    return 'You do not have permission to perform this action.';
                case 404:
                    return 'The requested resource was not found.';
                case 429:
                    return 'Too many requests. Please try again later.';
                case 500:
                case 502:
                case 503:
                    return 'Server error. Please try again later.';
                default:
                    return 'An unexpected error occurred. Please try again.';
            }
        }

        // Handle specific error types
        if (error?.message) {
            if (error.message.includes('timeout')) {
                return 'Request timed out. Please try again.';
            }
            if (error.message.includes('Network')) {
                return 'Network error. Please check your connection.';
            }
        }

        // Default message
        return 'An unexpected error occurred. Please try again.';
    }
}
