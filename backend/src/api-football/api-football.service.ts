import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiFootballService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'API_FOOTBALL_BASE_URL',
      'https://v3.football.api-sports.io',
    );
    this.apiKey = this.configService.get<string>('API_FOOTBALL_KEY', '');
  }

  getLiveOdds() {
    return this.request('/odds/live');
  }

  getLiveFixtures() {
    return this.request('/fixtures', { live: 'all' });
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
