import { HttpStatus } from './http-status';

export class CustomError {
  statusCode: number;
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class BadRequestException extends CustomError {
  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.BAD_REQUEST;
  }
}

export class UnauthorizedException extends CustomError {
  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.UNAUTHORIZED;
  }
}

export class NotFoundException extends CustomError {
  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.NOT_FOUND;
  }
}

export class ForbiddenException extends CustomError {
  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.FORBIDDEN;
  }
}
