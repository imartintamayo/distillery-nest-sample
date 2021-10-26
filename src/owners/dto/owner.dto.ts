import { IsNotEmpty, IsDateString, IsString } from 'class-validator';

export class CreateOwnerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  purchaseDate: Date;
}
