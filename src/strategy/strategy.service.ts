import { Injectable } from '@nestjs/common';
import { TradesService } from '../trades/trades.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';

@ApiTags('strategy')
@Injectable()
export class StrategyService {
  private balanceUSDT = 1000;
  private balanceCrypto = 0;
  private lastBuyPriceCrypto = 0;
  private cryptoAsset = '';

  constructor(
    private readonly tradesService: TradesService,
    private readonly logger: LoggerService,
  ) {}

  @ApiOperation({ summary: 'Execute trading strategy' })
  async executeStrategy(symbol: string) {
    this.cryptoAsset = this.extractAsset(symbol);

    await this.tradesService.fetchAndStoreTrades(symbol);

    const trades = await this.tradesService.getTrades(symbol);
    if (trades.length < 5) {
      this.logger.warn(
        `Not enough trade data for ${symbol}, skipping strategy execution.`,
      );
      return;
    }

    trades.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const prices = trades.map((t) => t.price);

    const shortTermAvg = this.calculateMovingAverage(prices.slice(-5));
    const longTermAvg = this.calculateMovingAverage(prices.slice(-20));

    this.logger.log(
      `[${symbol}] Short-term Avg: ${shortTermAvg} | Long-term Avg: ${longTermAvg}`,
    );

    const lastPrice = prices[prices.length - 1];

    if (shortTermAvg > longTermAvg) {
      this.buy(symbol, lastPrice);
    } else if (shortTermAvg < longTermAvg) {
      this.sell(symbol, lastPrice);
    }

    this.logPerformance(symbol);
  }

  private buy(symbol: string, price: number) {
    if (this.balanceUSDT > 0) {
      const amountCrypto = this.balanceUSDT / price;
      this.balanceCrypto += amountCrypto;
      this.lastBuyPriceCrypto = price;
      this.balanceUSDT = 0;

      this.logger.log(
        `[${symbol}] BUY ${amountCrypto.toFixed(6)} ${this.cryptoAsset} at ${price} USDT. New Balance: ${this.balanceCrypto.toFixed(6)}`,
      );
    } else {
      this.logger.warn(`[${symbol}] Cannot BUY, no USDT available.`);
    }
  }

  private sell(symbol: string, price: number) {
    if (this.balanceCrypto > 0) {
      const earnedUSDT = this.balanceCrypto * price;
      const profit = earnedUSDT - this.lastBuyPriceCrypto * this.balanceCrypto;
      this.balanceUSDT += earnedUSDT;
      this.balanceCrypto = 0;

      this.logger.log(
        `[${symbol}] SELL at ${price} USDT. Earned: ${earnedUSDT.toFixed(2)} USDT. Profit: ${profit.toFixed(2)} USDT`,
      );
    } else {
      this.logger.warn(
        `[${symbol}] Cannot SELL, no ${this.cryptoAsset} available.`,
      );
    }
  }

  private logPerformance(symbol: string) {
    this.logger.log(
      `[${symbol}] Portfolio - USDT: ${this.balanceUSDT.toFixed(2)} | ${this.cryptoAsset}: ${this.balanceCrypto.toFixed(6)}`,
    );
  }

  private calculateMovingAverage(prices: number[]): number {
    if (prices.length === 0) return 0;
    return prices.reduce((sum, price) => sum + price, 0) / prices.length;
  }

  private extractAsset(symbol: string): string {
    return symbol.replace('USDT', '');
  }
}
