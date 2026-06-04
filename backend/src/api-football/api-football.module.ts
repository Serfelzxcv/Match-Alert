import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiFootballController } from './api-football.controller';
import { ApiFootballService } from './api-football.service';

@Module({
  imports: [HttpModule],
  controllers: [ApiFootballController],
  providers: [ApiFootballService],
})
export class ApiFootballModule {}
