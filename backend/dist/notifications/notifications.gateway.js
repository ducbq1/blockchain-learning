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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const notifications_service_1 = require("./notifications.service");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
let NotificationsGateway = class NotificationsGateway {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
        this.logger = new common_1.Logger('NotificationGateway');
        this.currentUser = 0;
    }
    afterInit() {
        this.logger.log('Initialized!');
    }
    handleConnection(client) {
        this.currentUser++;
        client.emit('API', 'Hello');
        this.logger.log(`Connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.currentUser--;
        this.logger.log(`Disconnected: ${client.id}`);
    }
    findAll() {
        return this.notificationsService.findAll();
    }
    findOne(id) {
        return this.notificationsService.findOne(id);
    }
    remove(id) {
        return this.notificationsService.remove(id);
    }
    handleMessage(client, data) {
        return { event: 'messageToServer', data: data };
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "afterInit", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findAllNotifications'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "findAll", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findOneNotification'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "findOne", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeNotification'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "remove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('messageToServer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Object)
], NotificationsGateway.prototype, "handleMessage", null);
NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsGateway);
exports.NotificationsGateway = NotificationsGateway;
//# sourceMappingURL=notifications.gateway.js.map