import { OnGatewayInit, WsResponse, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { Socket } from 'socket.io';
export declare class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly notificationsService;
    private logger;
    private currentUser;
    constructor(notificationsService: NotificationsService);
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    findAll(): string;
    findOne(id: number): string;
    remove(id: number): string;
    handleMessage(client: Socket, data: string): WsResponse<string>;
}
