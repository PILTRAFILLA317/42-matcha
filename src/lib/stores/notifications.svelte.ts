type NotificationType = {
    message: string;
    type: string;
};

class NotificationState {
    private notifications: NotificationType[] = $state([]);
    constructor() {
        this.notifications = [];
    }
    getNotifications(): NotificationType[] {
        return this.notifications;
    }
    addNotification(notification: NotificationType): void {
        this.notifications.push(notification);
    }
    removeAll(): void {
        this.notifications = [];
    }
    setAll(notifications: NotificationType[]): void {
        this.notifications = notifications;
    }
    getLength(): number {
        return this.notifications.length;
    }
    getLastNotification(): NotificationType {
        return this.notifications[this.notifications.length - 1];
    }
    get AllNotifications() {
        return this.notifications;
    }
}

export const notificationState = new NotificationState();
export type { NotificationType };