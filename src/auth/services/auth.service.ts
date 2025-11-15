// backend/src/auth/services/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userData: {
    email: string;
    password: string;
    firstName: string;  // ✅ CAMBIAR
    lastName: string;   // ✅ CAMBIAR
  }) {
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const user = await this.usersService.create(userData);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      token,  // ✅ CAMBIAR de access_token a token
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,  // ✅ CAMBIAR
        lastName: user.lastName,    // ✅ CAMBIAR
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      token,  // ✅ CAMBIAR de access_token a token
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,  // ✅ CAMBIAR
        lastName: user.lastName,    // ✅ CAMBIAR
      },
    };
  }

  async validateUser(userId: string) {
    return await this.usersService.findOne(userId);
  }
}