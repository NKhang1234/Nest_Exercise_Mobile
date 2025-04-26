import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
      ignoreNotBefore: true,
    });
  }

  async validate(payload: { sub: number; name: string }) {
    try {
      if (!payload || !payload.sub) {
        console.error('Invalid JWT payload:', payload);
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.prisma.userProfile.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        console.error(`No user found with id: ${payload.sub}`);
        throw new UnauthorizedException('User not found');
      }

      // Remove password from response
      const { password, ...result } = user;

      console.log('JWT validation successful:', result);

      return result;
    } catch (error) {
      console.error('JWT validation error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
