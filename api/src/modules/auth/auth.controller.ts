import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Get,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { SignInDto } from './signin-dto';
  import { ApiTags } from '@nestjs/swagger';
  import { SkipThrottle } from '@nestjs/throttler';
  
  @SkipThrottle()
  @Controller('auth')
  @ApiTags('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
      return this.authService.signIn(signInDto.email, signInDto.password);
    }
  }
  