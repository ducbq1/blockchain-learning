import { StatisticService } from './statistic.service';
export declare class StatisticController {
    private readonly statisticService;
    constructor(statisticService: StatisticService);
    getListCoinMarket(): Promise<unknown>;
    getBalance(address: string): Promise<unknown>;
}
