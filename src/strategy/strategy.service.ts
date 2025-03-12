import { Injectable, Logger } from '@nestjs/common';
import { TradesService } from '../trades/trades.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('strategy')
@Injectable()
export class StrategyService {
  private readonly logger = new Logger(StrategyService.name);

  constructor(private readonly tradesService: TradesService) {}

  @ApiOperation({ summary: 'Execute trading strategy' })
  async executeStrategy(symbol: string) {
    console.log('executeStrategy');
    const trades = await this.tradesService.getTrades(symbol);
    if (trades.length < 2) return;

    const latestTrade = trades[0];
    const prevTrade = trades[1];

    const priceDropPercentage = Number(process.env.PRICE_DROP_PERCENTAGE) || 2;
    const priceIncreasePercentage =
      Number(process.env.PRICE_INCREASE_PERCENTAGE) || 2;

    const priceDropThreshold =
      prevTrade.price * (1 - priceDropPercentage / 100);
    const priceIncreaseThreshold =
      prevTrade.price * (1 + priceIncreasePercentage / 100);

    if (latestTrade.price <= priceDropThreshold) {
      this.logger.log(`Buying ${symbol} at ${latestTrade.price}`);
    } else if (latestTrade.price >= priceIncreaseThreshold) {
      this.logger.log(`Selling ${symbol} at ${latestTrade.price}`);
    }
  }
}
