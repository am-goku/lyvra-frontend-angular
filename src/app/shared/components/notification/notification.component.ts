import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="notification-container">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div 
          class="notification notification-{{ notification.type }}"
          (click)="notificationService.remove(notification.id)"
          role="alert"
          [attr.aria-live]="notification.type === 'error' ? 'assertive' : 'polite'"
        >
          <span class="notification-icon">
            @switch (notification.type) {
              @case ('success') { ✓ }
              @case ('error') { ✕ }
              @case ('warning') { ⚠ }
              @case ('info') { ℹ }
            }
          </span>
          <span class="notification-message">{{ notification.message }}</span>
          <button 
            class="notification-close" 
            (click)="notificationService.remove(notification.id)"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      }
    </div>
  `,
    styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
      pointer-events: none;
    }

    .notification {
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      animation: slideIn 0.3s ease-out;
      cursor: pointer;
      pointer-events: auto;
      backdrop-filter: blur(10px);
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .notification-success {
      background-color: #10b981;
      color: white;
    }

    .notification-error {
      background-color: #ef4444;
      color: white;
    }

    .notification-warning {
      background-color: #f59e0b;
      color: white;
    }

    .notification-info {
      background-color: #3b82f6;
      color: white;
    }

    .notification-icon {
      font-size: 20px;
      font-weight: bold;
      flex-shrink: 0;
    }

    .notification-message {
      flex: 1;
      font-size: 14px;
      line-height: 1.5;
    }

    .notification-close {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      margin: 0;
      line-height: 1;
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .notification-close:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .notification:hover {
      transform: translateX(-4px);
      transition: transform 0.2s;
    }
  `]
})
export class NotificationComponent {
    notificationService = inject(NotificationService);
}
