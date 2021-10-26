import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateManufacturerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNumber()
  siret: number;
}
