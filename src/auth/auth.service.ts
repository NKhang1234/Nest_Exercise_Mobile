import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    // Check if user exists
    const existingUser = await this.prisma.userProfile.findUnique({
      where: { name: signUpDto.name },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    // Create a new user
    const user = await this.prisma.userProfile.create({
      data: {
        name: signUpDto.name,
        password: hashedPassword,
        avatar: signUpDto.avatar,
      },
    });

    // Generate JWT token
    const token = this.generateToken(user.id, user.name);

    // Return user (excluding password) and token
    const { password, ...result } = user;
    return { user: result, token };
  }

  async signIn(signInDto: SignInDto) {
    // Find user
    const user = await this.prisma.userProfile.findUnique({
      where: { name: signInDto.name },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.name);

    // Return user (excluding password) and token
    const { password, ...result } = user;
    return { user: result, token };
  }

  private generateToken(userId: number, username: string) {
    const payload = { sub: userId, name: username };
    return this.jwtService.sign(payload);
  }
}
