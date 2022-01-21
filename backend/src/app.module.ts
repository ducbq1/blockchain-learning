import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions, Connection } from 'typeorm';
import { UsersModule } from './users/users.module';
import { IdentifiesModule } from './identifies/identifies.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AddressesModule } from './addresses/addresses.module';
import { ValidateMiddleware } from './validate.middleware';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    UsersModule,
    IdentifiesModule,
    NotificationsModule,
    AddressesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.GET });
  }
}
