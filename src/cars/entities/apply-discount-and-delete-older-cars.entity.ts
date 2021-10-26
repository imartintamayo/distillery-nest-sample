import { Model } from 'mongoose';
import { CarDocument } from '../schemas/car.schema';

export class ApplyDiscountAndDeleteOlderCars {
  carModel: Model<CarDocument>;
  releaseDate: Date;
  discountPercent: number;
  applyToCarsWithReleaseDateMinusMonthsStart: number;
  applyToCarsWithReleaseDateMinusMonthsEnd: number;
}
