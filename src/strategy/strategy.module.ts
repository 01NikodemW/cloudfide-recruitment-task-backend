import { Module } from '@nestjs/common';
import { StrategyService } from './strategy.service';
import { TradesModule } from '../trades/trades.module';

@Module({
  imports: [TradesModule],
  providers: [StrategyService],
  exports: [StrategyService],
})
export class StrategyModule {}
