import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './config/environment';
import { CarsModule } from './cars/cars.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
@Module({
  imports: [
    CarsModule,
    MongooseModule.forRoot(environment.mongoConnect),
    ManufacturersModule,
  ],
})
export class AppModule {}
