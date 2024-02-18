import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, Validate } from "class-validator";
import { TimezoneExist } from "../../global/validator/timezone-exists";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    birthDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    @Validate(TimezoneExist)
    timezone: string;

    @ApiProperty()
    @IsNotEmpty()
    location: string;
}
