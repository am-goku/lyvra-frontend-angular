import { Injectable, signal } from '@angular/core';

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    notifications = signal<Notification[]>([]);

    private show(notification: Omit<Notification, 'id'>): void {
        const id = Math.random().toString(36).substring(2, 11);
        const fullNotification: Notification = { ...notification, id };

        this.notifications.update(n => [...n, fullNotification]);

        const duration = notification.duration || 5000;
        setTimeout(() => {
            this.remove(id);
        }, duration);
    }

    success(message: string, duration?: number): void {
        this.show({ type: 'success', message, duration });
    }

    error(message: string, duration?: number): void {
        this.show({ type: 'error', message, duration });
    }

    warning(message: string, duration?: number): void {
        this.show({ type: 'warning', message, duration });
    }

    info(message: string, duration?: number): void {
        this.show({ type: 'info', message, duration });
    }

    remove(id: string): void {
        this.notifications.update(n => n.filter(notification => notification.id !== id));
    }

    clear(): void {
        this.notifications.set([]);
    }
}
