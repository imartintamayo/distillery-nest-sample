import {
  IsDateString,
  IsNumber,
  IsString,
  Min,
  IsOptional,
} from 'class-validator';
export class CreateCarDto {
  @IsNumber()
  manufacturer: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsDateString()
  firstRegistrationDate: Date;

  @IsString({
    each: true,
  })
  owners?: string[] = [];
}

export class UpdateCarDto {
  @IsOptional()
  @IsNumber()
  manufacturer?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsDateString()
  firstRegistrationDate?: Date;

  @IsOptional()
  @IsString({
    each: true,
  })
  owners?: string[];
}
