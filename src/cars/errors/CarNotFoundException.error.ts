import { HttpException, HttpStatus } from '@nestjs/common';

export class CarNotFoundException extends HttpException {
  constructor(carId) {
    super(`Car not found with carId: "${carId}"`, HttpStatus.NOT_FOUND);
    this.name = 'CarNotFoundException';
  }
}
