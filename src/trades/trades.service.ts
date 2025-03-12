import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trade } from './schemas/trade.schema';
import { BinanceService } from '../binance/binance.service';

@Injectable()
export class TradesService {
  constructor(
    @InjectModel(Trade.name) private tradeModel: Model<Trade>,
    private readonly binanceService: BinanceService,
  ) {}

  async fetchAndStoreTrades(symbol: string): Promise<void> {
    const trades = await this.binanceService.fetchRecentTrades(symbol);
    const tradeData = trades.map((t) => ({
      symbol,
      price: parseFloat(t.price),
      quantity: parseFloat(t.qty),
      timestamp: new Date(t.time),
    }));
    await this.tradeModel.insertMany(tradeData);
  }

  async getTrades(symbol: string) {
    return this.tradeModel.find({ symbol }).sort({ timestamp: -1 }).limit(10);
  }
}
