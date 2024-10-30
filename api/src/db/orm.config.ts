import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

/* the service requires the connection parameters 
   should not be stored within the codebase, but instead placed as 
   an environment variable (as a security measure). 
   This is why i stored it on a different place
   also, with the extension of seeder option in which it is also 
   an essential to have sample data upon initialization
 */
export const ormConfig: TypeOrmModuleOptions & DataSourceOptions = {
  type: 'mysql',
  port: 3306,
  host: configService.get<string>('TYPEORM_DATABASE_HOST'),
  username: configService.get<string>('TYPEORM_DATABASE_USERNAME'),
  password: configService.get<string>('TYPEORM_DATABASE_PASSWORD'),
  database: configService.get<string>('TYPEORM_DATABASE_NAME'),
  logging: false,
  synchronize: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // maps all entities
  migrations: [__dirname + '/../db/migrations/**/*.ts'], // maps migrations path
  // migrationsRun: true, // executes pending migrations on run
  migrationsTableName: 'migrations',
  // ssl: configService.get<string>('TYPEORM_SSL_OPTIONS'),
};

const dataSource = new DataSource(ormConfig);

export default dataSource;
