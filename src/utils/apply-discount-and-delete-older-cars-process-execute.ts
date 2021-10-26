import { CarDocument } from 'src/cars/schemas/car.schema';
import {
  ApplyDiscountAndDeleteOlderCarsConfig,
  ReleaseDateFilter,
  UpdateWriteOpResult,
  DeleteWriteOpResult,
  ApplyDiscountToCarsResult,
  DeleteOlderCarsResult,
  ApplyDiscountAndDeleteOlderCarsResult,
} from '../types/types';

const substracMonths = (date: Date, months: number) => {
  const nDate = new Date(date);
  nDate.setMonth(nDate.getMonth() - months);
  return nDate;
};

const dateToStartOfDay = (date: Date) => {
  const nDate = new Date(date);
  nDate.setHours(0);
  nDate.setMinutes(0);
  nDate.setSeconds(0);
  nDate.setMilliseconds(0);
  return nDate;
};

const dateToEndOfDay = (date: Date) => {
  const nDate = new Date(date);
  nDate.setHours(23);
  nDate.setMinutes(59);
  nDate.setSeconds(59);
  nDate.setMilliseconds(999);
  return nDate;
};

const getDiscountToApply = (discountPercent: number) => {
  return (100 - discountPercent) / 100;
};

const findCarsByReleaseDate = (
  carModel,
  releaseDateFilter: ReleaseDateFilter,
): Promise<CarDocument[]> => {
  return carModel
    .find({
      releaseDate: releaseDateFilter,
    })
    .populate('publisher')
    .exec();
};

const deleteCarsByReleaseDate = (
  carModel,
  releaseDateFilter: ReleaseDateFilter,
): Promise<DeleteWriteOpResult> => {
  return carModel
    .deleteMany({
      releaseDate: releaseDateFilter,
    })
    .exec();
};

const updateCarsByReleaseDate = (
  carModel,
  releaseDateFilter: ReleaseDateFilter,
  discount: number,
): Promise<UpdateWriteOpResult> => {
  return carModel
    .updateMany(
      {
        releaseDate: releaseDateFilter,
      },
      {
        $mul: {
          price: discount,
        },
      },
    )
    .exec();
};

const deleteCarsWithReleaseDateOlderThan = async ({
  carModel,
  releaseDate,
  applyToCarsWithReleaseDateMinusMonthsEnd,
}: ApplyDiscountAndDeleteOlderCarsConfig): Promise<DeleteOlderCarsResult> => {
  let date: Date = substracMonths(
    releaseDate,
    applyToCarsWithReleaseDateMinusMonthsEnd,
  );
  date = dateToStartOfDay(date);

  const releaseDateFilter: ReleaseDateFilter = { $lt: date };
  const carsToDelete: CarDocument[] = await findCarsByReleaseDate(
    carModel,
    releaseDateFilter,
  );
  const result: DeleteWriteOpResult = await deleteCarsByReleaseDate(
    carModel,
    releaseDateFilter,
  );

  return {
    deletedCars: carsToDelete,
    result,
  };
};

const applyDiscountToCarsWithReleaseDateBetween = async ({
  carModel,
  releaseDate,
  discountPercent,
  applyToCarsWithReleaseDateMinusMonthsStart,
  applyToCarsWithReleaseDateMinusMonthsEnd,
}: ApplyDiscountAndDeleteOlderCarsConfig): Promise<ApplyDiscountToCarsResult> => {
  let startDate: Date = substracMonths(
    releaseDate,
    applyToCarsWithReleaseDateMinusMonthsEnd,
  );
  startDate = dateToStartOfDay(startDate);

  let endDate: Date = substracMonths(
    releaseDate,
    applyToCarsWithReleaseDateMinusMonthsStart,
  );
  endDate = dateToEndOfDay(endDate);

  const discount = getDiscountToApply(discountPercent);
  const releaseDateFilter: ReleaseDateFilter = {
    $gte: startDate,
    $lte: endDate,
  };

  const carsBeforeUpdate: CarDocument[] = await findCarsByReleaseDate(
    carModel,
    releaseDateFilter,
  );
  const result: UpdateWriteOpResult = await updateCarsByReleaseDate(
    carModel,
    releaseDateFilter,
    discount,
  );
  const carsAfterUpdate: CarDocument[] = await findCarsByReleaseDate(
    carModel,
    releaseDateFilter,
  );

  return {
    carsBeforeUpdate,
    carsAfterUpdate,
    result,
  };
};

export const applyDiscountAndDeleteOlderCarsProcess = async (
  config: ApplyDiscountAndDeleteOlderCarsConfig,
): Promise<ApplyDiscountAndDeleteOlderCarsResult> => {
  const deletedCars = await deleteCarsWithReleaseDateOlderThan(config);
  const updatedCars = await applyDiscountToCarsWithReleaseDateBetween(config);

  return {
    deletedCars,
    updatedCars,
  };
};
