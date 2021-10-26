import { HttpException, HttpStatus } from '@nestjs/common';

export class ManufacturerConflictException extends HttpException {
  constructor(siret) {
    super(
      `A Manufacturer with siret: "${siret}" already exists`,
      HttpStatus.CONFLICT,
    );
    this.name = 'ManufacturerConflictException';
  }
}
