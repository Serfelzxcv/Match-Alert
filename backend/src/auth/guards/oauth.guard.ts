import { ExecutionContext, mixin } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function OAuthGuard(strategy: 'google' | 'facebook') {
  class MixinOAuthGuard extends AuthGuard(strategy) {
    getAuthenticateOptions(context: ExecutionContext) {
      if (strategy === 'google') {
        return { scope: ['email', 'profile'] };
      }

      return { scope: ['email'] };
    }
  }

  return mixin(MixinOAuthGuard);
}
