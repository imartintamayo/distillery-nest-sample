import { Model } from 'mongoose';
import { CarDocument } from '../cars/schemas/car.schema';

export interface ApplyDiscountAndDeleteOlderCarsConfig {
  carModel: Model<CarDocument>;
  releaseDate: Date;
  discountPercent: number;
  applyToCarsWithReleaseDateMinusMonthsStart: number;
  applyToCarsWithReleaseDateMinusMonthsEnd: number;
}

export interface ReleaseDateFilter {
  $lt?: Date;
  $lte?: Date;
  $gte?: Date;
}

export interface DeleteWriteOpResult {
  n?: number;
  ok?: number;
  deletedCount?: number;
}

export interface UpdateWriteOpResult {
  n: number;
  ok: number;
  nModified: number;
}

export interface ApplyDiscountToCarsResult {
  carsBeforeUpdate: CarDocument[];
  carsAfterUpdate: CarDocument[];
  result: UpdateWriteOpResult;
}

export interface DeleteOlderCarsResult {
  deletedCars: CarDocument[];
  result: DeleteWriteOpResult;
}

export interface ApplyDiscountAndDeleteOlderCarsResult {
  deletedCars: DeleteOlderCarsResult;
  updatedCars: ApplyDiscountToCarsResult;
}
