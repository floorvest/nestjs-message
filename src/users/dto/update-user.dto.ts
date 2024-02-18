import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsNotEmpty, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TimezoneExist } from '../../global/validator/timezone-exists';

export class UpdateUserDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    @Type(() => Date)
    @IsDate()
    birthDate: Date;

    @ApiProperty()
    @Validate(TimezoneExist)
    timezone: string;

    @ApiProperty()
    location: string;
}
