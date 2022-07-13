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
        this.currentUser = {};
    }
    afterInit() {
        this.logger.log('Initialized!');
    }
    handleConnection(client) {
        this.currentUser[client.id] = true;
        this.logger.log(`Connected: ${client.id}`);
        this.wss.emit('getUserActiveCount', {
            count: Object.keys(this.currentUser).length,
        });
    }
    handleDisconnect(client) {
        delete this.currentUser[client.id];
        this.logger.log(`Disconnected: ${client.id}`);
        this.wss.emit('getUserActiveCount', {
            count: Object.keys(this.currentUser).length,
        });
    }
    handleMessage(client, data) {
        this.logger.log(`Message to server: ${client.id}`);
        return { event: 'messageToServer', data: data };
    }
    sendToAll(message) {
        this.wss.emit('alert', { type: 'alert', message: message });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "wss", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('connect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleConnection", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('disconnect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleDisconnect", null);
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