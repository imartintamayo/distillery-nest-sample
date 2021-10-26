import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { Car, CarSchema } from './schemas/car.schema';
import {
  Manufacturer,
  ManufacturerSchema,
} from '../manufacturers/schemas/manufacturer.schema';
import { ManufacturersService } from '../manufacturers/manufacturers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Car.name, schema: CarSchema },
      { name: Manufacturer.name, schema: ManufacturerSchema },
    ]),
  ],
  controllers: [CarsController],
  providers: [CarsService, ManufacturersService],
})
export class CarsModule {}
