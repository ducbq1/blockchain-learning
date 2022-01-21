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
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('NotificationGateway');
  private currentUser = 0;
  constructor(private readonly notificationsService: NotificationsService) {}

  @WebSocketServer()
  afterInit() {
    this.logger.log('Initialized!');
  }

  handleConnection(client: Socket) {
    // throw new Error('Method not implemented.');
    this.currentUser++;
    client.emit('API', 'Hello');
    this.logger.log(`Connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.currentUser--;
    this.logger.log(`Disconnected: ${client.id}`);
  }

  @SubscribeMessage('findAllNotifications')
  findAll() {
    return this.notificationsService.findAll();
  }

  @SubscribeMessage('findOneNotification')
  findOne(@MessageBody() id: number) {
    return this.notificationsService.findOne(id);
  }

  @SubscribeMessage('removeNotification')
  remove(@MessageBody() id: number) {
    return this.notificationsService.remove(id);
  }

  // @UsePipes(new ValidationPipe())
  @SubscribeMessage('messageToServer')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): WsResponse<string> {
    return { event: 'messageToServer', data: data };
  }
}
