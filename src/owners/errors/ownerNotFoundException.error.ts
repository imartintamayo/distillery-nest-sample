import { HttpException, HttpStatus } from '@nestjs/common';

export class OwnerNotFoundException extends HttpException {
  constructor(ownerId) {
    super(`Owner with ownerId: "${ownerId}" not found`, HttpStatus.NOT_FOUND);
    this.name = 'OwnerNotFoundException';
  }
}
