import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import config from '../config/binance.config';

@Injectable()
export class BinanceService {
  private readonly logger = new Logger(BinanceService.name);
  private readonly baseUrl = config.baseUrl;

  async fetchRecentTrades(symbol: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/trades?symbol=${symbol}&limit=5`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching trades', error);
      throw new Error('Failed to fetch recent trades');
    }
  }
}
