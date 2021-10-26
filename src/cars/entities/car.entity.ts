import { ApiProperty } from '@nestjs/swagger';
import { CarDocument } from '../schemas/car.schema';
import { Manufacturer } from '../../manufacturers/entities/manufacturer.entity';
import { Owner } from '../../owners/entities/owner.entity';

export class Car {
  constructor(car?: CarDocument) {
    this.id = car?._id;
    this.manufacturer = new Manufacturer(car?.manufacturer);
    this.price = car?.price;
    this.firstRegistrationDate = car?.firstRegistrationDate;
    this.owners = car?.owners.map(owner => new Owner(owner));
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
    example: [{ id: 'some id1', name: 'some owner name1', purchaseDate: 'some date' }, { id: 'some id2', name: 'some owner name2', purchaseDate: 'some date' }],
    description: 'The owners of the Car',
  })
  owners?: Owner[] = [];
}
