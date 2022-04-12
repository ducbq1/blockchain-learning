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
exports.WalletsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("./entities/wallet.entity");
let WalletsService = class WalletsService {
    constructor(walletsRepository) {
        this.walletsRepository = walletsRepository;
    }
    async create(createWalletDto) {
        return await this.walletsRepository.save(createWalletDto);
    }
    findAll() {
        return this.walletsRepository.find({
            where: {
                isIdentified: true,
            },
        });
    }
    async findOne(title) {
        const walletInstance = await this.walletsRepository.findOne({
            where: {
                title: title,
                isIdentified: false,
            },
        });
        if (walletInstance == undefined) {
            return '00000000-0000-0000-0000-000000000000';
        }
        else {
            return walletInstance.id;
        }
    }
    async check(title) {
        const walletCount = await this.walletsRepository.count({
            where: {
                title: title,
                isIdentified: true,
            },
        });
        return walletCount !== 0;
    }
    async update(updateWalletDto) {
        return this.walletsRepository.update(updateWalletDto.id, updateWalletDto);
    }
    remove(id) {
        return `This action removes a #${id} wallet`;
    }
};
WalletsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WalletsService);
exports.WalletsService = WalletsService;
//# sourceMappingURL=wallets.service.js.map