import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { JWTUtil } from "../../jwt/jwt.service";
import { Client } from "./entities/client.entity";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Client])],
  controllers: [ClientController],
  providers: [ClientService, JWTUtil],
})
export class ClientModule {}
