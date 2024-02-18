import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MomentModule } from '@ccmos/nestjs-moment';
import { join } from 'path';

@Module({
  imports: [
    MomentModule.forRoot({
      tz: 'Asia/Jakarta'
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    UsersModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule { }
