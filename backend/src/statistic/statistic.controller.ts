import { Controller, Get, Param } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get()
  getListCoinMarket() {
    return this.statisticService.getListCoinMarket();
  }

  @Get(':address')
  getBalance(@Param() address: string) {
    return this.statisticService.getBalance(address);
  }
}
