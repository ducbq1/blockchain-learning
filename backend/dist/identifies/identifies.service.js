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
exports.IdentifiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const identify_entity_1 = require("./entities/identify.entity");
const typeorm_2 = require("typeorm");
const address_entity_1 = require("../addresses/entities/address.entity");
const user_entity_1 = require("../users/entities/user.entity");
let IdentifiesService = class IdentifiesService {
    constructor(idenfifiesRepository, addressesRepository, usersRepository) {
        this.idenfifiesRepository = idenfifiesRepository;
        this.addressesRepository = addressesRepository;
        this.usersRepository = usersRepository;
    }
    findAll() {
        return this.idenfifiesRepository.find();
    }
    findOne(id) {
        return this.idenfifiesRepository.findOne(id);
    }
    async delete(id) {
        return await this.idenfifiesRepository.delete(id);
    }
    async restore(id) {
        return await this.idenfifiesRepository.restore(id);
    }
    async update(updateIdentifyDto) {
        return await this.idenfifiesRepository.update(updateIdentifyDto.id, updateIdentifyDto);
    }
    async create(createIdentifyDto) {
        return await this.idenfifiesRepository.save(createIdentifyDto);
    }
    async insert(createIdentifyDto) {
        return await this.idenfifiesRepository.insert(createIdentifyDto);
    }
};
IdentifiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(identify_entity_1.Identify)),
    __param(1, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], IdentifiesService);
exports.IdentifiesService = IdentifiesService;
//# sourceMappingURL=identifies.service.js.map