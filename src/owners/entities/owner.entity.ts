import { ApiProperty } from '@nestjs/swagger';
import { OwnerDocument } from '../schemas/owner.schema';

export class Owner {
  constructor(owner?: OwnerDocument) {
    this.id = owner?._id;
    this.name = owner?.name;
    this.purchaseDate = owner?.purchaseDate;
  }

  @ApiProperty({
    example: 'some id',
    description: 'The Owner\'s id',
  })
  id: string;

  @ApiProperty({
    example: 'some name',
    description: 'The Owner\'s name',
  })
  name: string;

  @ApiProperty({ example: 'some purchaseDate', description: 'The Owner\'s purchaseDate' })
  purchaseDate: Date;
}
