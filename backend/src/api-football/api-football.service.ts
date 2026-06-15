import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, OnModuleDestroy, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import Redis from 'ioredis';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiFootballService implements OnModuleDestroy {
  private static readonly LIVE_FIXTURES_CACHE_KEY = 'api-football:fixtures:live';
  private static readonly LIVE_FIXTURES_TTL_SECONDS = 10 * 60;

  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly redis: Redis;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'API_FOOTBALL_BASE_URL',
      'https://v3.football.api-sports.io',
    );
    this.apiKey = this.configService.get<string>('API_FOOTBALL_KEY', '');
    this.redis = new Redis(
      this.configService.get<string>('REDIS_URL', 'redis://localhost:6379'),
      {
        maxRetriesPerRequest: 1,
        enableReadyCheck: false,
      },
    );
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  getLiveOdds() {
    return this.request('/odds/live');
  }

  async getLiveFixtures() {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('API_FOOTBALL_KEY is not configured');
    }

    const cachedFixtures = await this.getCachedValue(ApiFootballService.LIVE_FIXTURES_CACHE_KEY);

    if (cachedFixtures) {
      return JSON.parse(cachedFixtures);
    }

    const fixtures = await this.request('/fixtures', { live: 'all' });

    await this.setCachedValue(
      ApiFootballService.LIVE_FIXTURES_CACHE_KEY,
      JSON.stringify(fixtures),
      ApiFootballService.LIVE_FIXTURES_TTL_SECONDS,
    );

    return fixtures;
  }

  private async getCachedValue(key: string) {
    try {
      return await this.redis.get(key);
    } catch {
      return null;
    }
  }

  private async setCachedValue(key: string, value: string, ttlSeconds: number) {
    try {
      await this.redis.set(key, value, 'EX', ttlSeconds);
    } catch {
      return;
    }
  }

  private async request(path: string, params?: Record<string, string>) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}${path}`, {
          params,
          headers: {
            'x-apisports-key': this.apiKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const detail = axiosError.response?.data ?? axiosError.message;

      throw new BadGatewayException({
        message: 'API-Football request failed',
        detail,
      });
    }
  }
}
