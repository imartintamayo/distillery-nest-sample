import { ApiProperty } from '@nestjs/swagger';
import { Manufacturer } from '../../manufacturers/entities/manufacturer.entity';
import { CarDocument } from '../schemas/car.schema';
import { ManufacturerDocument } from '../../manufacturers/schemas/manufacturer.schema';
import { Manufacturer as ManufacturerEntity } from '../../manufacturers/entities/manufacturer.entity';

export class Car {
  constructor(car?: CarDocument, manufacturer?: ManufacturerDocument) {
    this.id = car?._id;
    this.manufacturer = new ManufacturerEntity(
      manufacturer ? manufacturer : car?.manufacturer,
    );
    this.price = car?.price;
    this.firstRegistrationDate = car?.firstRegistrationDate;
    this.owners = car?.owners;
  }

  @ApiProperty({ example: 'someId', description: 'The id of the Car' })
  id: string;

  @ApiProperty({
    example: { name: 'some name', siret: 1234, phone: 'some phone' },
    description: 'The Manufacturer of the Car',
  })
  manufacturer: Manufacturer;

  @ApiProperty({ example: 10, description: 'The price of the Car' })
  price: number;

  @ApiProperty({
    example: 'some registration date',
    description: 'The registration date of the Car',
  })
  firstRegistrationDate: Date;

  @ApiProperty({
    example: ['owner1', 'owner2'],
    description: 'The owners of the Car',
  })
  owners?: string[] = [];
}
