import { Controller, Get, MessageEvent, Query, Sse, UseGuards } from '@nestjs/common';
import { catchError, from, interval, map, Observable, of, startWith, switchMap } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiFootballService } from './api-football.service';

const LIVE_FIXTURES_STREAM_INTERVAL_MS = 10 * 60 * 1000;

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

  @Get('fixtures/today')
  getTodayFixtures(@Query('date') date?: string) {
    return this.apiFootballService.getTodayFixtures(date);
  }

  @Sse('fixtures/live/stream')
  streamLiveFixtures(): Observable<MessageEvent> {
    return interval(LIVE_FIXTURES_STREAM_INTERVAL_MS).pipe(
      startWith(0),
      switchMap(() =>
        from(this.apiFootballService.getLiveFixtures()).pipe(
          map((fixtures) => ({
            type: 'live-fixtures',
            data: fixtures,
          })),
          catchError((error) =>
            of({
              type: 'live-fixtures-error',
              data: {
                message: error.response?.message || error.message || 'No se pudieron cargar los partidos en vivo.',
              },
            }),
          ),
        ),
      ),
    );
  }

  @Sse('fixtures/today/stream')
  streamTodayFixtures(@Query('date') date?: string): Observable<MessageEvent> {
    return interval(LIVE_FIXTURES_STREAM_INTERVAL_MS).pipe(
      startWith(0),
      switchMap(() =>
        from(this.apiFootballService.getTodayFixtures(date)).pipe(
          map((fixtures) => ({
            type: 'today-fixtures',
            data: fixtures,
          })),
          catchError((error) =>
            of({
              type: 'today-fixtures-error',
              data: {
                message: error.response?.message || error.message || 'No se pudieron cargar los partidos del dia.',
              },
            }),
          ),
        ),
      ),
    );
  }
}
