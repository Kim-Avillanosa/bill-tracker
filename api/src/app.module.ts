import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { ConfigService, ConfigModule } from "@nestjs/config";
import { CliModule } from "./cli/cli.module";
import { ormConfig } from "./db/orm.config";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { JWTUtil } from "./jwt/jwt.service";

import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
  // add orm module to create persistence instance
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    CliModule,
    AuthModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get("THROTTLE_TTL"),
          limit: config.get("THROTTLE_LIMIT"),
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return ormConfig;
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "docs"),
      serveRoot: "/swagger",
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JWTUtil,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor(dataSource: DataSource) {}
}
