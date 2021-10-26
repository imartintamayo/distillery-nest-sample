import { HttpException, HttpStatus } from '@nestjs/common';

export class ManufacturerNotFoundException extends HttpException {
  constructor(siret) {
    super(`Manufacturer with siret: "${siret}" not found`, HttpStatus.NOT_FOUND);
    this.name = 'ManufacturerNotFoundException';
  }
}
