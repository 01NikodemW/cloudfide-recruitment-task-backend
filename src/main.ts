import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { StrategyService } from './strategy/strategy.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Trading Bot API')
    .setDescription('API for Binance trading bot')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableShutdownHooks();

  await app.listen(3000);

  const strategyService = app.get(StrategyService);
  setInterval(() => {
    strategyService.executeStrategy(process.env.SYMBOL || 'BTCUSDT');
  }, 5000);
}

bootstrap();
