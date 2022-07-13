import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  WsResponse,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

// @WebSocketGateway(4001, {
//   cors: true,
//   path: '/websockets',
//   serveClient: true,
//   namespace: '/',
// })
@WebSocketGateway({ cors: true })
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('NotificationGateway');
  private currentUser = {};
  constructor(private readonly notificationsService: NotificationsService) {}

  @WebSocketServer() wss: Server;

  afterInit() {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('connect')
  handleConnection(client: Socket) {
    // client.to('...').emit('');
    this.currentUser[client.id] = true;
    this.logger.log(`Connected: ${client.id}`);
    this.wss.emit('getUserActiveCount', {
      count: Object.keys(this.currentUser).length,
    });
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(client: Socket) {
    delete this.currentUser[client.id];
    this.logger.log(`Disconnected: ${client.id}`);
    this.wss.emit('getUserActiveCount', {
      count: Object.keys(this.currentUser).length,
    });
  }

  @SubscribeMessage('messageToServer')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): WsResponse<string> {
    this.logger.log(`Message to server: ${client.id}`);
    return { event: 'messageToServer', data: data };
  }

  sendToAll(message: string) {
    this.wss.emit('alert', { type: 'alert', message: message });
  }
}
