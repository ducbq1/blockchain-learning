import { Wallet } from 'src/wallets/entities/wallet.entity';

export class CreateTransactionDto {
  id: string;
  destination: string;
  value: number;
  data: string;
  nonce: number;
  description: string;
  mined: boolean;
  address: string;
}
