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
exports.IdentifiesController = void 0;
const common_1 = require("@nestjs/common");
const create_address_dto_1 = require("../addresses/dto/create-address.dto");
const create_identify_dto_1 = require("./dto/create-identify.dto");
const update_identify_dto_1 = require("./dto/update-identify.dto");
const identifies_service_1 = require("./identifies.service");
let IdentifiesController = class IdentifiesController {
    constructor(identifiesService) {
        this.identifiesService = identifiesService;
    }
    findAll() {
        return this.identifiesService.findAll();
    }
    findOne(uuid) {
        return this.identifiesService.findOne(uuid);
    }
    findAddresses(uuid) {
        return this.identifiesService.findAddresses(uuid);
    }
    remove(uuid) {
        return this.identifiesService.softDelete(uuid);
    }
    restore(uuid) {
        return this.identifiesService.restore(uuid);
    }
    insertAddresses(combineId, createAddressDto) {
        return this.identifiesService.insertAddresses(combineId, createAddressDto);
    }
    create(createIdentifyDto) {
        return this.identifiesService.create(createIdentifyDto);
    }
    update(updateIdentityDto) {
        return this.identifiesService.update(updateIdentityDto);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IdentifiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':uuid'),
    __param(0, (0, common_1.Param)('uuid', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IdentifiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('addresses/:uuid'),
    __param(0, (0, common_1.Param)('uuid', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IdentifiesController.prototype, "findAddresses", null);
__decorate([
    (0, common_1.Delete)(':uuid'),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IdentifiesController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':uuid'),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IdentifiesController.prototype, "restore", null);
__decorate([
    (0, common_1.Post)('address/:combineId'),
    __param(0, (0, common_1.Param)('combineId', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_address_dto_1.CreateAddressDto]),
    __metadata("design:returntype", void 0)
], IdentifiesController.prototype, "insertAddresses", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_identify_dto_1.CreateIdentifyDto]),
    __metadata("design:returntype", void 0)
], IdentifiesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_identify_dto_1.UpdateIdentifyDto]),
    __metadata("design:returntype", void 0)
], IdentifiesController.prototype, "update", null);
IdentifiesController = __decorate([
    (0, common_1.Controller)('identifies'),
    __metadata("design:paramtypes", [identifies_service_1.IdentifiesService])
], IdentifiesController);
exports.IdentifiesController = IdentifiesController;
//# sourceMappingURL=identifies.controller.js.map