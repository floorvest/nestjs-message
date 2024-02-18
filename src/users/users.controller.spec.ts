import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Job } from '../global/entities/job.entity';
import { FailedJob } from '../global/entities/failed-job.entity';
import { EmailTemplates } from '../global/entities/email-template.entity';
import { ConfigModule } from '@nestjs/config';
describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.example'],
        }),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASS,
          database: process.env.DATABASE_NAME,
          entities: ['src/**/*.entity.{ts,js}'],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([
          User,
          Job,
          FailedJob,
          EmailTemplates
        ])],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be return list users', async () => {
    const userList = await controller.findAll();

    expect(userList).toHaveProperty('data')
  });
});
