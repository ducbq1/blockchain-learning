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
exports.AddressesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const identify_entity_1 = require("../identifies/entities/identify.entity");
const transaction_entity_1 = require("../transactions/entities/transaction.entity");
const wallet_entity_1 = require("../wallets/entities/wallet.entity");
const typeorm_2 = require("typeorm");
const address_entity_1 = require("./entities/address.entity");
let AddressesService = class AddressesService {
    constructor(addressesRepository, transactionsRepository, walletsRepository) {
        this.addressesRepository = addressesRepository;
        this.transactionsRepository = transactionsRepository;
        this.walletsRepository = walletsRepository;
    }
    async findAllAddressTransaction(uuid) {
        const transactionInstance = await this.transactionsRepository.findOne({
            where: {
                id: uuid,
            },
            relations: ['addresses'],
        });
        return transactionInstance.addresses;
    }
    async findAllAddressWallet(uuid) {
        const walletInstance = await this.walletsRepository.findOne({
            where: {
                id: uuid,
                isIdentified: false,
            },
            relations: ['addresses'],
        });
        return walletInstance.addresses;
    }
    async findOne(id) {
        return this.addressesRepository.findOne(id);
    }
    async delete(id) {
        return this.addressesRepository.delete(id);
    }
    async softDelete(id) {
        return this.addressesRepository.softDelete(id);
    }
    async restore(id) {
        return this.addressesRepository.restore(id);
    }
    async update(updateAddressDto) {
        return this.addressesRepository.update(updateAddressDto.id, updateAddressDto);
    }
    async createAddressTransaction(createAddressDto) {
        const transactionInstance = await this.transactionsRepository.findOne({
            where: { id: createAddressDto.transactionId },
            relations: ['addresses'],
        });
        if (transactionInstance.addresses.some((item) => item.signature == createAddressDto.signature)) {
            return new address_entity_1.Address();
        }
        const address = this.addressesRepository.create(createAddressDto);
        address.transaction = transactionInstance;
        return this.addressesRepository.save(address);
    }
    async createAddressWallet(createAddressDto) {
        const walletInstance = await this.walletsRepository.findOne({
            where: { id: createAddressDto.walletId },
            relations: ['addresses'],
        });
        if (walletInstance.addresses.some((item) => item.address == createAddressDto.address)) {
            return new address_entity_1.Address();
        }
        const address = this.addressesRepository.create(createAddressDto);
        address.wallet = walletInstance;
        return this.addressesRepository.save(address);
    }
    insert(createAddressDto) {
        return this.addressesRepository.insert(createAddressDto);
    }
};
AddressesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(2, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AddressesService);
exports.AddressesService = AddressesService;
//# sourceMappingURL=addresses.service.js.map