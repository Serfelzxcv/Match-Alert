import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiFootballService } from './api-football.service';

@UseGuards(JwtAuthGuard)
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
