import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { IS_PUBLIC_KEY } from './auth.decorator';
import { AUTH_COOKIE_NAME } from './auth.constants';
import { hashSessionToken, parseCookieHeader } from './auth.utils';
import type { AuthenticatedUser } from './auth.types';

type AuthenticatedRequest = Request & {
  authUser?: AuthenticatedUser;
  authSessionId?: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const path = request.path || request.url || '';

    if (isPublic || path === '/api' || path.startsWith('/api/docs')) {
      return true;
    }

    const cookies = parseCookieHeader(request.headers.cookie);
    const token = cookies[AUTH_COOKIE_NAME];

    if (!token) {
      throw new UnauthorizedException('请先登录');
    }

    const tokenHash = hashSessionToken(token);
    const session = await this.prisma.userSession.findFirst({
      where: {
        tokenHash,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      throw new UnauthorizedException('登录状态已失效，请重新登录');
    }

    if (session.expiresAt <= new Date()) {
      await this.prisma.userSession.delete({ where: { id: session.id } });
      throw new UnauthorizedException('登录状态已过期，请重新登录');
    }

    if (session.user.status !== 'active') {
      throw new UnauthorizedException('账号已被停用');
    }

    request.authUser = {
      id: session.user.id,
      username: session.user.username,
      email: session.user.email,
      name: session.user.name,
      status: session.user.status,
      lastLoginAt: session.user.lastLoginAt,
      createdAt: session.user.createdAt,
      updatedAt: session.user.updatedAt,
    };
    request.authSessionId = session.id;

    await this.prisma.userSession.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() },
    });

    return true;
  }
}
