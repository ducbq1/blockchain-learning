"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_module_1 = require("./users/users.module");
const identifies_module_1 = require("./identifies/identifies.module");
const notifications_module_1 = require("./notifications/notifications.module");
const addresses_module_1 = require("./addresses/addresses.module");
const validate_middleware_1 = require("./validate.middleware");
const statistic_module_1 = require("./statistic/statistic.module");
let AppModule = class AppModule {
    constructor(connection) {
        this.connection = connection;
    }
    configure(consumer) {
        consumer
            .apply(validate_middleware_1.ValidateMiddleware)
            .forRoutes({ path: 'users', method: common_1.RequestMethod.GET });
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: async () => Object.assign(await (0, typeorm_2.getConnectionOptions)(), {
                    autoLoadEntities: true,
                }),
            }),
            users_module_1.UsersModule,
            identifies_module_1.IdentifiesModule,
            notifications_module_1.NotificationsModule,
            addresses_module_1.AddressesModule,
            statistic_module_1.StatisticModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [typeorm_2.Connection])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map