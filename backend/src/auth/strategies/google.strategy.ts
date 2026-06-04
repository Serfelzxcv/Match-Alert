import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '@prisma/client';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', 'your_google_client_id'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', 'your_google_client_secret'),
      callbackURL: configService.get<string>(
        'GOOGLE_CALLBACK_URL',
        'http://localhost:3001/auth/google/callback',
      ),
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      return done(new Error('Google profile does not include an email'), false);
    }

    return done(null, {
      provider: AuthProvider.GOOGLE,
      providerId: profile.id,
      email,
      name: profile.displayName || email,
      image: profile.photos?.[0]?.value,
    });
  }
}
