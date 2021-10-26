import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManufacturersController } from './manufacturers.controller';
import { ManufacturersService } from './manufacturers.service';
import { Manufacturer, ManufacturerSchema } from './schemas/manufacturer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Manufacturer.name, schema: ManufacturerSchema },
    ]),
  ],
  controllers: [ManufacturersController],
  providers: [ManufacturersService],
})
export class ManufacturersModule {}
