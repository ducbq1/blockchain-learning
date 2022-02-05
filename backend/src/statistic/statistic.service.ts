import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class StatisticService {
  async getListCoinMarket() {
    const returnValues = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=c91d7596-a77e-4984-9282-39a2755a63e9&limit=6`,
    );
    return returnValues.data;
  }

  async getBalance(address: string) {
    const returnValues = await axios.get(
      `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=H77KF8THJ7PJ9V5HWDQBFBMFYSP24FMPPU`,
    );
    return returnValues.data;
  }
}
