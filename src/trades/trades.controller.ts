import { Controller, Get, Param, Post } from '@nestjs/common';
import { TradesService } from './trades.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('trades')
@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post(':symbol')
  @ApiOperation({ summary: 'Fetch and store recent trades' })
  @ApiParam({ name: 'symbol', type: String, example: 'BTCUSDT' })
  async fetchAndStoreTrades(@Param('symbol') symbol: string) {
    await this.tradesService.fetchAndStoreTrades(symbol);
    return { message: `Trades for ${symbol} stored successfully` };
  }

  @Get(':symbol')
  @ApiOperation({ summary: 'Get stored trades' })
  @ApiParam({ name: 'symbol', type: String, example: 'BTCUSDT' })
  async getTrades(@Param('symbol') symbol: string) {
    return this.tradesService.getTrades(symbol);
  }
}
