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
exports.Transaction = void 0;
const address_entity_1 = require("../../addresses/entities/address.entity");
const wallet_entity_1 = require("../../wallets/entities/wallet.entity");
const typeorm_1 = require("typeorm");
let Transaction = class Transaction {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transaction.prototype, "destination", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transaction.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transaction.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transaction.prototype, "nonce", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Transaction.prototype, "mined", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Transaction.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Transaction.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet, (wallet) => wallet.transactions),
    __metadata("design:type", wallet_entity_1.Wallet)
], Transaction.prototype, "wallet", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => address_entity_1.Address, (address) => address.transaction),
    __metadata("design:type", Array)
], Transaction.prototype, "addresses", void 0);
Transaction = __decorate([
    (0, typeorm_1.Entity)()
], Transaction);
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.entity.js.map