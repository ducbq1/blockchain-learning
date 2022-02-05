"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let StatisticService = class StatisticService {
    async getListCoinMarket() {
        const returnValues = await axios_1.default.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=c91d7596-a77e-4984-9282-39a2755a63e9&limit=6`);
        return returnValues.data;
    }
    async getBalance(address) {
        const returnValues = await axios_1.default.get(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=H77KF8THJ7PJ9V5HWDQBFBMFYSP24FMPPU`);
        return returnValues.data;
    }
};
StatisticService = __decorate([
    (0, common_1.Injectable)()
], StatisticService);
exports.StatisticService = StatisticService;
//# sourceMappingURL=statistic.service.js.map