import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsGateway: NotificationsGateway) {}

  @Post()
  @HttpCode(200)
  sendToAll(@Body() messageDto: { message: string }) {
    return this.notificationsGateway.sendToAll(messageDto.message);
  }
}
