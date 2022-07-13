import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsController {
    private notificationsGateway;
    constructor(notificationsGateway: NotificationsGateway);
    sendToAll(messageDto: {
        message: string;
    }): void;
}
