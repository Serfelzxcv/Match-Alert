import { Injectable } from '@nestjs/common';
import { AuthProvider, Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async upsertOAuthUser(input: {
    email: string;
    name: string;
    image?: string | null;
    provider: AuthProvider;
    providerId: string;
  }) {
    const existingUser = await this.findByEmail(input.email);

    if (existingUser) {
      return this.update(existingUser.id, {
        name: existingUser.name || input.name,
        image: input.image ?? existingUser.image,
        provider: input.provider,
        providerId: input.providerId,
      });
    }

    return this.create({
      email: input.email,
      name: input.name,
      image: input.image,
      provider: input.provider,
      providerId: input.providerId,
      passwordHash: null,
    });
  }

  toSafeUser(user: User): SafeUser {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
