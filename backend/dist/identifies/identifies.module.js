"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifiesModule = void 0;
const common_1 = require("@nestjs/common");
const identifies_service_1 = require("./identifies.service");
const identifies_controller_1 = require("./identifies.controller");
const identify_entity_1 = require("./entities/identify.entity");
const typeorm_1 = require("@nestjs/typeorm");
const address_entity_1 = require("../addresses/entities/address.entity");
const user_entity_1 = require("../users/entities/user.entity");
let IdentifiesModule = class IdentifiesModule {
};
IdentifiesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([identify_entity_1.Identify, address_entity_1.Address, user_entity_1.User])],
        controllers: [identifies_controller_1.IdentifiesController],
        providers: [identifies_service_1.IdentifiesService],
    })
], IdentifiesModule);
exports.IdentifiesModule = IdentifiesModule;
//# sourceMappingURL=identifies.module.js.map