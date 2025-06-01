import { JwtService } from '@nestjs/jwt';

export function extractUserIdFromToken(
  token: string,
  jwtService: JwtService,
): string | null {
  try {
    const payload = jwtService.verify(token);
    return payload.sub;
  } catch {
    return null;
  }
}
