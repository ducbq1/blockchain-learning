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
const typeorm_2 = require("typeorm");
const address_entity_1 = require("./entities/address.entity");
let AddressesService = class AddressesService {
    constructor(addressesRepository, identifiesRepository) {
        this.addressesRepository = addressesRepository;
        this.identifiesRepository = identifiesRepository;
    }
    async findAll(sort) {
        if (sort) {
            return this.addressesRepository.find({ order: { message: 'ASC' } });
        }
        else {
            return this.addressesRepository.find({ order: { message: 'DESC' } });
        }
    }
    async findIdentify(address) {
        const item = await this.addressesRepository.find({
            where: { address: address },
            relations: ['identify'],
        });
        return item.map((it) => it.identify);
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
    async updateStatus(id, isVerify) {
        return this.addressesRepository.update(id, {
            isVerify: isVerify,
        });
    }
    async update(updateAddressDto) {
        return this.addressesRepository.update(updateAddressDto.id, updateAddressDto);
    }
    async create(createAddressDto) {
        const identify = await this.identifiesRepository.findOne(createAddressDto.identifyId);
        const address = this.addressesRepository.create(createAddressDto);
        address.identify = identify;
        return this.addressesRepository.save(address);
    }
    insert(createAddressDto) {
        return this.addressesRepository.insert(createAddressDto);
    }
};
AddressesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __param(1, (0, typeorm_1.InjectRepository)(identify_entity_1.Identify)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AddressesService);
exports.AddressesService = AddressesService;
//# sourceMappingURL=addresses.service.js.map