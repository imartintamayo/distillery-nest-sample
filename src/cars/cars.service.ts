import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument } from './schemas/car.schema';
import { CreateCarDto, UpdateCarDto } from './dto/car.dto';
import { Car as CarEntity } from './entities/car.entity';
import {
  ApplyDiscountAndDeleteOlderCarsConfig,
  ApplyDiscountAndDeleteOlderCarsResult,
  DeleteWriteOpResult,
  UpdateWriteOpResult,
} from '../types/types';
import { ApplyDiscountAndDeleteOlderCars } from './entities/apply-discount-and-delete-older-cars.entity';
import { applyDiscountAndDeleteOlderCarsProcess } from '../utils/apply-discount-and-delete-older-cars-process-execute';
import { CarNotFoundException } from './errors/CarNotFoundException.error';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { Manufacturer as ManufacturerEntity } from '../manufacturers/entities/manufacturer.entity';
import { ManufacturerNotFoundException } from '../manufacturers/errors/ManufacturerNotFoundException.error';
import { OwnersService } from '../owners/owners.service';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    private manufacturerService: ManufacturersService,
    private ownersService: OwnersService,
  ) {}

  private _findCarById(carId: string): Promise<CarDocument> {
    return this.carModel.findById(carId).populate(['manufacturer', 'owners']).exec();
  }

  private _findCars(): Promise<CarDocument[]> {
    return this.carModel.find().populate(['manufacturer', 'owners']).exec();
  }

  private _saveCar(car: Car): Promise<CarDocument> {
    const createdCar = new this.carModel(car);
    return createdCar.save();
  }

  private _updateCarById(
    carId: string,
    dataToSet: any,
  ): Promise<any> {
    return this.carModel
      .updateOne(
        {
          _id: carId,
        },
        {
          $set: dataToSet,
        },
      )
      .exec();
  }

  private _deleteCarById(carId: string): Promise<DeleteWriteOpResult> {
    return this.carModel
      .deleteOne({
        _id: carId,
      })
      .exec();
  }

  async getCars(): Promise<CarEntity[]> {
    const cars = await this._findCars();
    return cars.map((car) => new CarEntity(car));
  }

  async getCarById(carId: string): Promise<CarEntity> {
    const car = await this._findCarById(carId);

    if (!car) {
      throw new CarNotFoundException(carId);
    }

    return new CarEntity(car);
  }

  async getCarManufacturerByCarId(carId: string): Promise<ManufacturerEntity> {
    const car = await this._findCarById(carId);

    if (!car) {
      throw new CarNotFoundException(carId);
    }

    return new ManufacturerEntity(car?.manufacturer);
  }

  async createCar(createCarDto: CreateCarDto): Promise<CarEntity> {
    const { manufacturer: siret, owners: ownerIds, ...dataToSet } = createCarDto;
    const manufacturer = await this.manufacturerService.findManufacturerBySiret(siret);

    if (!manufacturer) {
      throw new ManufacturerNotFoundException(siret);
    }

    if (ownerIds) {
      const owners = await Promise.all(ownerIds.map(ownerId => this.ownersService.getOwnerById(ownerId)));
      Object.assign(dataToSet, { owners: owners.map(owner => owner._id) });
    }

    let car = await this._saveCar({
      ...dataToSet,
      manufacturer: manufacturer._id,
    });
    car = await this._findCarById(car._id);
    return new CarEntity(car);
  }

  async updateCarById(
    carId: string,
    updateCarDto: UpdateCarDto,
  ): Promise<CarEntity> {
    let car = await this._findCarById(carId);

    if (!car) {
      throw new CarNotFoundException(carId);
    }

    const { manufacturer: siret, owners: ownerIds, ...dataToSet } = updateCarDto;
    const manufacturer = await this.manufacturerService.findManufacturerBySiret(siret);

    if (siret && !manufacturer) {
      throw new ManufacturerNotFoundException(siret);
    }

    if (manufacturer) {
      Object.assign(dataToSet, { manufacturer: manufacturer._id });
    }

    if (ownerIds) {
      const owners = await Promise.all(ownerIds.map(ownerId => this.ownersService.getOwnerById(ownerId)));
      Object.assign(dataToSet, { owners: owners.map(owner => owner._id) });
    }

    await this._updateCarById(carId, dataToSet);
    car = await this._findCarById(carId);

    return new CarEntity(car);
  }

  async deleteCarById(carId: string): Promise<CarEntity> {
    const car = await this._findCarById(carId);

    if (!car) {
      throw new CarNotFoundException(carId);
    }

    await this._deleteCarById(carId);
    return new CarEntity(car);
  }

  async triggerApplyDiscountAndDeleteOlderCarsProcess() {
    const config: ApplyDiscountAndDeleteOlderCarsConfig = {
      carModel: this.carModel,
      releaseDate: new Date(),
      discountPercent: 20,
      applyToCarsWithReleaseDateMinusMonthsStart: 12,
      applyToCarsWithReleaseDateMinusMonthsEnd: 18,
    };
    const result: ApplyDiscountAndDeleteOlderCarsResult = await applyDiscountAndDeleteOlderCarsProcess(
      config,
    );
    return result;
  }
}
