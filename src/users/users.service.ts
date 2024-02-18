import axios from 'axios';
import { randomUUID } from 'crypto';
import * as moment from 'moment-timezone';

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../global/entities/job.entity';
import { FailedJob } from '../global/entities/failed-job.entity';
import { EmailTemplates } from '../global/entities/email-template.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Job)
    private jobRepository: Repository<Job>,

    @InjectRepository(FailedJob)
    private failedJobRepository: Repository<FailedJob>,

    @InjectRepository(EmailTemplates)
    private emailTemplateRepository: Repository<EmailTemplates>
  ) { }

  // create user
  async create(createUserDto: CreateUserDto) {

    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email
      }
    })

    if (existUser) {
      throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST)
    }

    const user = this.userRepository.create()

    user.firstName = createUserDto.firstName
    user.lastName = createUserDto.lastName
    user.email = createUserDto.email
    user.birthDate = createUserDto.birthDate
    user.timezone = createUserDto.timezone
    user.location = createUserDto.location

    await this.userRepository.save(user)

    return {
      'message': 'user created',
      data: user
    };
  }


  // find all users
  async findAll() {
    return {
      'message': 'fetch all users success',
      data: await this.userRepository.find()
    };
  }

  // find one user
  async findOne(id: number) {
    return {
      'message': 'fetch user by id success',
      'data': await this.userRepository.findOne({
        where: {
          id,
        }
      })
    };
  }

  // update user
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      }
    })

    if (!user) {
      throw new HttpException('User is not exists', HttpStatus.BAD_REQUEST)
    }

    user.firstName = updateUserDto.firstName
    user.lastName = updateUserDto.lastName
    user.birthDate = updateUserDto.birthDate
    user.timezone = updateUserDto.timezone
    user.location = updateUserDto.location

    await this.userRepository.save(user)

    return {
      'message': 'user updated',
      data: user
    };
  }

  // remove user
  async remove(id: number) {

    const user = await this.userRepository.findOneBy({
      id
    });

    if (!user) {
      return {
        'message': 'user not found'
      };
    }

    await this.userRepository.remove(user)

    return {
      'message': 'user removed'
    };
  }


  // helper to replace placeholders at email template
  private replacePlaceholders(originalString: string, data: Record<string, string>): string {
    // Use a regular expression to find all placeholders in the string
    const regex = /{([^}]+)}/g;

    // Replace each placeholder with the corresponding value from the data object
    const replacedString = originalString.replace(regex, (match, placeholder) => {
      const replacement = data[placeholder.trim()];
      // If the placeholder is found in the data object, use the replacement, otherwise, keep the original placeholder
      return replacement !== undefined ? replacement : match;
    });

    return replacedString;
  }

  /**
   * Get email templated based by name
   * 
   * @param name 
   * @param data 
   * @returns Promise<string>
   */
  private async getEmailBasedByName(name: string, data: any): Promise<string> {
    // find email template from database
    const template = await this.emailTemplateRepository.findOne({
      where: {
        name,
      }
    })

    if (template) {
      return this.replacePlaceholders(template.message, data)
    }

    return '';
  }

  /**
   * Send an email for birthday message
   * 
   * @param userId 
   * @param email 
   * @param message 
   * @returns Promise<boolean>
   */
  private async sendBirthdayMessage(userId: number, email: string, message: string): Promise<boolean> {
    try {

      const apiUrl = 'https://email-service.digitalenvision.com.au/send-email';

      const res = await axios.post(apiUrl, {
        email,
        message
      });

      if (res.data.status == 'sent') {
        const user = await this.userRepository.findOneBy({
          id: userId
        });
        user.lastAnnounceBirthday = parseInt(moment().format('YYYY'));
        this.userRepository.save(user);
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Cron to check all users birthday this month
   * filtering by empty jobs and failed jobs with lastAnnounceBirthday
   * 
   * Run everyday
   * 
   * @returns void
   */
  @Cron('0 0 * * *')
  async getUsersBirthday() {
    const startMonth = moment().startOf('month').toDate();
    const endMonth = moment().endOf('month').toDate();

    const currentYear = moment().format('YYYY')

    // find this month user birthday and plan to congratulate them
    const users = await this.userRepository.createQueryBuilder('users')
      .leftJoin(Job, 'job', 'job.userId = users.id')
      .leftJoin(FailedJob, 'failjob', 'failjob.userId = users.id')
      .where('users.birthDate BETWEEN :startMonth AND :endMonth', {
        startMonth,
        endMonth
      })
      .andWhere('(users.lastAnnounceBirthday < :currentYear)', {
        currentYear: parseInt(currentYear)
      })
      .andWhere('job.userId IS NULL')
      .andWhere('failjob.userId IS NULL')
      .getMany()

    /**
     * plan job for each timezone for users
     * Since we need to send message per user timezone, we need
     * to convert the date to backend compatible
     */
    users.forEach(element => {
      const trigerredAt = moment(element.birthDate).startOf('day').tz(element.timezone).add(9, 'hour')
      const job = this.jobRepository.create()
      job.userId = element.id
      job.jobKey = randomUUID()
      job.information = JSON.stringify({
        job: 'send_happy_birthday',
        data: {
          'full_name': `${element.firstName} ${element.lastName}`
        },
        email: element.email,
      })
      job.triggeredAt = new Date(trigerredAt.format('YYYY-MM-DD H:mm:ss'));
      this.jobRepository.save(job);
    });


    return users;
  }

  /**
   * Cron to check all jobs and send the jobs to prepare function
   * Run every hour
   * 
   * @returns void
   */
  @Cron('0 * * * *')
  async triggerJobs() {
    const jobs = await this.jobRepository.createQueryBuilder('job')
      .where('triggered_at <= :currentDate', {
        currentDate: new Date()
      })
      .getMany()

    // loop all jobs
    jobs.forEach(element => {
      this.prepareJob(element);
      element.attempt += 1;
      this.jobRepository.save(element);
    });

    return jobs;
  }

  /**
   * Helper implementation to delay the promise.
   * 
   * @param ms | number 
   * @returns Promise
   */
  private wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  /**
   * Helper for retry operation on promise, make sure all Promise based will keep trying
   * until the limit is reach and send failure flag to database.
   * 
   * 
   * @param operation 
   * @param delay 
   * @param retries 
   * @returns Promise<any>
   */
  private retryOperation(operation, delay, retries) {
    return new Promise((resolve, reject) => {
      return operation()
        .then(resolve)
        .catch((reason) => {
          if (retries > 0) {
            return this.wait(delay)
              .then(this.retryOperation.bind(null, operation, delay, retries - 1))
              .then(resolve)
              .catch(reject);
          }
          return reject(reason);
        });
    })
  };

  /**
   * Prepare the job based on jobName, can add new job here as needed.
   * 
   * @param job 
   */
  async prepareJob(job: Job) {
    try {
      // parsing all passed information
      const information = JSON.parse(job.information)

      switch (information.job) {

        // sending happy birthday feature
        case 'send_happy_birthday':
          // send happy birthday and adding retry if there any issue on sending email
          await this.retryOperation(async () => {
            return this.sendBirthdayMessage(job.userId, information.email, await this.getEmailBasedByName('send_happy_birthday', information.data))

            // retry the send message if failed, then retry until 10 time
          }, 1000, 10)
          break;

        // you can add more case for any job you need
        // case 'send_happy_anniversary':
        //   break;
      }
    } catch (error) {

      // save failed job at the table
      const fJob = this.failedJobRepository.create();
      fJob.jobKey = job.jobKey
      fJob.failedReason = error.message
      fJob.userId = job.userId
      fJob.information = job.information

      this.failedJobRepository.save(fJob)
    }

    // remove job regarding success or not, as if failed then it will save at failed jobs
    this.jobRepository.remove(job);
  }

}
