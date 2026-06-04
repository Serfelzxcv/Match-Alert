import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '@prisma/client';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID', 'your_facebook_client_id'),
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET', 'your_facebook_client_secret'),
      callbackURL: configService.get<string>(
        'FACEBOOK_CALLBACK_URL',
        'http://localhost:3001/auth/facebook/callback',
      ),
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      return done(new Error('Facebook profile does not include an email'), false);
    }

    return done(null, {
      provider: AuthProvider.FACEBOOK,
      providerId: profile.id,
      email,
      name: profile.displayName || email,
      image: profile.photos?.[0]?.value,
    });
  }
}
