// src/cli/cli.module.ts
import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';

@Module({
  imports: [ConsoleModule],
  providers: [],
})
export class CliModule {}
