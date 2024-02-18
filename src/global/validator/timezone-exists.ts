import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

import timezone from '../helper/timezone';

@ValidatorConstraint({
    name: 'TimezoneExist',
    async: true
})
@Injectable()
export class TimezoneExist implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        return timezone.findIndex(element => element.zone == value) != -1
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        return 'Timezone is not registered'
    }

}