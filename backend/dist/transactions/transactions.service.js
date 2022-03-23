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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const wallet_entity_1 = require("../wallets/entities/wallet.entity");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("./entities/transaction.entity");
let TransactionsService = class TransactionsService {
    constructor(walletsRepository, transactionsRepository) {
        this.walletsRepository = walletsRepository;
        this.transactionsRepository = transactionsRepository;
    }
    async create(createTransacionDto) {
        const walletInstance = await this.walletsRepository.findOne({
            where: {
                address: createTransacionDto.address,
            },
        });
        const transaction = this.transactionsRepository.create(createTransacionDto);
        transaction.wallet = walletInstance;
        return await this.transactionsRepository.save(transaction);
    }
    async update(updateTransactionDto) {
        console.log(updateTransactionDto);
        return await this.transactionsRepository.update(updateTransactionDto.id, updateTransactionDto);
    }
    async findAll(address) {
        const walletInstance = await this.walletsRepository.findOne({
            where: {
                address: address,
            },
            relations: ['transactions'],
        });
        return walletInstance.transactions;
    }
    remove(id) {
        return `This action removes a #${id} transaction`;
    }
};
TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TransactionsService);
exports.TransactionsService = TransactionsService;
//# sourceMappingURL=transactions.service.js.map