import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { BinanceModule } from './binance/binance.module';
import { TradesModule } from './trades/trades.module';
import { StrategyModule } from './strategy/strategy.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    DatabaseModule,
    BinanceModule,
    TradesModule,
    StrategyModule,
    LoggerModule,
  ],
})
export class AppModule {}
