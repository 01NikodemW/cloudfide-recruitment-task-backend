import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import config from '../config/binance.config';
import { LoggerService } from '../logger/logger.service';
import { BinanceTrade } from './interfaces/binance-trade.interface';

@Injectable()
export class BinanceService {
  private readonly baseUrl = config.baseUrl;

  constructor(private readonly logger: LoggerService) {}

  async fetchRecentTrades(symbol: string): Promise<BinanceTrade[]> {
    try {
      const trades = await this.requestTrades(symbol);

      if (trades.length === 0) {
        this.logger.warn(`No trade data found for ${symbol}`);
        throw new BadRequestException(`No trade data found for ${symbol}`);
      }

      this.logger.log(`Fetched ${trades.length} trades for ${symbol}`);
      return trades;
    } catch (error) {
      this.handleError(error, symbol);
    }
  }

  private async requestTrades(symbol: string): Promise<BinanceTrade[]> {
    const url = `${this.baseUrl}/trades?symbol=${symbol}&limit=5`;
    const response = await axios.get<BinanceTrade[]>(url);
    return response.data;
  }

  private handleError(error: unknown, symbol: string): never {
    let errorMessage: string;

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 'Unknown Status';
      const message = error.message || 'No message available';
      errorMessage = `Binance API error for ${symbol}: ${status} - ${message}`;
    } else if (error instanceof Error) {
      errorMessage = `Unexpected error fetching trades for ${symbol}: ${error.message}`;
    } else {
      errorMessage = `Unknown error fetching trades for ${symbol}`;
    }

    this.logger.error(errorMessage);
    throw new InternalServerErrorException(errorMessage);
  }
}
