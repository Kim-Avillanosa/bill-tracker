import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

interface JwtResponse {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JWTUtil {
  constructor(private readonly jwtService: JwtService) {}

  decode(auth: string): JwtResponse {
    const jwt = auth.replace('Bearer ', '');
    return this.jwtService.decode(jwt, { json: true }) as JwtResponse;
  }
}
