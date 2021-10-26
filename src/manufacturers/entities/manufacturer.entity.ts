import { ApiProperty } from '@nestjs/swagger';
import { ManufacturerDocument } from '../schemas/manufacturer.schema';

export class Manufacturer {
  constructor(manufacturer?: ManufacturerDocument) {
    this.name = manufacturer?.name;
    this.siret = manufacturer?.siret;
    this.phone = manufacturer?.phone;
  }

  @ApiProperty({
    example: 'some name',
    description: 'The name of the Manufacturer',
  })
  name: string;

  @ApiProperty({ example: 10, description: 'The siret of the Manufacturer' })
  siret: number;

  @ApiProperty({
    example: 'some phone',
    description: 'The phone of the Manufacturer',
  })
  phone: string;
}
