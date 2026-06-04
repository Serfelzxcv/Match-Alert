import { Controller, Get } from '@nestjs/common';
import { ApiFootballService } from './api-football.service';

@Controller('football')
export class ApiFootballController {
  constructor(private readonly apiFootballService: ApiFootballService) {}

  @Get('odds/live')
  getLiveOdds() {
    return this.apiFootballService.getLiveOdds();
  }

  @Get('fixtures/live')
  getLiveFixtures() {
    return this.apiFootballService.getLiveFixtures();
  }
}
