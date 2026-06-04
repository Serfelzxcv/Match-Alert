import { AuthProvider } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface OAuthProfile {
  provider: AuthProvider;
  providerId: string;
  email: string;
  name: string;
  image?: string | null;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
