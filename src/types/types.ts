import { Model } from 'mongoose';
import { CarDocument } from '../cars/schemas/car.schema';

export interface ApplyDiscountAndRemoveOlderCarsOwnersFromListConfig {
  carModel: Model<CarDocument>;
  firstRegistrationDate: Date;
  discountPercent: number;
  applyToCarsWithFirstRegistrationDateMinusMonthsStart: number;
  applyToCarsWithFirstRegistrationDateMinusMonthsEnd: number;
}

export interface FirstRegistrationDateFilter {
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
  removedOwners: CarDocument[];
  result: DeleteWriteOpResult;
}

export interface ApplyDiscountAndRemoveOlderCarsOwnersFromListResult {
  deletedCars: DeleteOlderCarsResult;
  updatedCars: ApplyDiscountToCarsResult;
}
