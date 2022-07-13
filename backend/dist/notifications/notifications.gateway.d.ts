import { OnGatewayInit, WsResponse, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { Server, Socket } from 'socket.io';
export declare class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly notificationsService;
    private logger;
    private currentUser;
    constructor(notificationsService: NotificationsService);
    wss: Server;
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleMessage(client: Socket, data: string): WsResponse<string>;
    sendToAll(message: string): void;
}
