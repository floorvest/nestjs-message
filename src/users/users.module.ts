import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Job } from 'src/global/entities/job.entity';
import { FailedJob } from 'src/global/entities/failed-job.entity';
import { EmailTemplates } from 'src/global/entities/email-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    User,
    Job,
    FailedJob,
    EmailTemplates
  ])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
