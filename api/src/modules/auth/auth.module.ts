import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from "./auth.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from "./constants";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '1h', // for this sample i had changed the expiration to one hour
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
