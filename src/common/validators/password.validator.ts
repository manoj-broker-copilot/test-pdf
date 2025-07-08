import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: string, args: ValidationArguments) {
          // Password must be at least 8 characters long
          if (value.length < 8) {
            return false;
          }
          // Password must contain at least one uppercase letter
          if (!/[A-Z]/.test(value)) {
            return false;
          }
          // Password must contain at least one number
          if (!/[0-9]/.test(value)) {
            return false;
          }
          // Password must contain at least one special character
          if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return false;
          }
          return true;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultMessage(args: ValidationArguments) {
          return `Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.`;
        },
      },
    });
  };
}
