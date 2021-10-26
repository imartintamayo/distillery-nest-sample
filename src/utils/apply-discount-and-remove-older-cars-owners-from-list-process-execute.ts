import { CarDocument } from 'src/cars/schemas/car.schema';
import {
  ApplyDiscountAndRemoveOlderCarsOwnersFromListConfig,
  FirstRegistrationDateFilter,
  UpdateWriteOpResult,
  DeleteWriteOpResult,
  ApplyDiscountToCarsResult,
  DeleteOlderCarsResult,
  ApplyDiscountAndRemoveOlderCarsOwnersFromListResult,
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

const findCarsByFirstRegistrationDate = (
  carModel,
  firstRegistrationDateFilter: FirstRegistrationDateFilter,
): Promise<CarDocument[]> => {
  return carModel
    .find({
      firstRegistrationDate: firstRegistrationDateFilter,
    })
    .populate(['manufacturer', 'owners'])
    .exec();
};

const removeCarsOwnersByPurchaseDate = (
  carModel,
  purchaseDateFilter: FirstRegistrationDateFilter,
): Promise<DeleteWriteOpResult> => {
  return carModel
    .updateMany({
      purchaseDate: purchaseDateFilter,
    })
    .exec();
};

const updateCarsByFirstRegistrationDate = (
  carModel,
  firstRegistrationDateFilter: FirstRegistrationDateFilter,
  discount: number,
): Promise<UpdateWriteOpResult> => {
  return carModel
    .updateMany(
      {
        firstRegistrationDate: firstRegistrationDateFilter,
      },
      {
        $mul: {
          price: discount,
        },
      },
    )
    .exec();
};

const removeCarsOwnersWithPurchaseDateOlderThan = async ({
  carModel,
  firstRegistrationDate,
  applyToCarsWithFirstRegistrationDateMinusMonthsEnd,
}: ApplyDiscountAndRemoveOlderCarsOwnersFromListConfig): Promise<DeleteOlderCarsResult> => {
  let date: Date = substracMonths(
    firstRegistrationDate,
    applyToCarsWithFirstRegistrationDateMinusMonthsEnd,
  );
  date = dateToStartOfDay(date);

  const purchaseDateFilter: FirstRegistrationDateFilter = { $lt: date };
  const ownersToRemove: CarDocument[] = await findCarsByFirstRegistrationDate( //
    carModel,
    purchaseDateFilter,
  );
  const result: DeleteWriteOpResult = await removeCarsOwnersByPurchaseDate(
    carModel,
    purchaseDateFilter,
  );

  return {
    removedOwners: ownersToRemove,
    result,
  };
};

const applyDiscountToCarsWithFirstRegistrationDateBetween = async ({
  carModel,
  firstRegistrationDate,
  discountPercent,
  applyToCarsWithFirstRegistrationDateMinusMonthsStart,
  applyToCarsWithFirstRegistrationDateMinusMonthsEnd,
}: ApplyDiscountAndRemoveOlderCarsOwnersFromListConfig): Promise<ApplyDiscountToCarsResult> => {
  let startDate: Date = substracMonths(
    firstRegistrationDate,
    applyToCarsWithFirstRegistrationDateMinusMonthsEnd,
  );
  startDate = dateToStartOfDay(startDate);

  let endDate: Date = substracMonths(
    firstRegistrationDate,
    applyToCarsWithFirstRegistrationDateMinusMonthsStart,
  );
  endDate = dateToEndOfDay(endDate);

  const discount = getDiscountToApply(discountPercent);
  const firstRegistrationDateFilter: FirstRegistrationDateFilter = {
    $gte: startDate,
    $lte: endDate,
  };

  const carsBeforeUpdate: CarDocument[] = await findCarsByFirstRegistrationDate(
    carModel,
    firstRegistrationDateFilter,
  );
  const result: UpdateWriteOpResult = await updateCarsByFirstRegistrationDate(
    carModel,
    firstRegistrationDateFilter,
    discount,
  );
  const carsAfterUpdate: CarDocument[] = await findCarsByFirstRegistrationDate(
    carModel,
    firstRegistrationDateFilter,
  );

  return {
    carsBeforeUpdate,
    carsAfterUpdate,
    result,
  };
};

export const applyDiscountAndRemoveOlderCarsOwnersFromListProcess = async (
  config: ApplyDiscountAndRemoveOlderCarsOwnersFromListConfig,
): Promise<ApplyDiscountAndRemoveOlderCarsOwnersFromListResult> => {
  // const removedOwners = await removeCarsOwnersWithPurchaseDateOlderThan(config);
  const updatedCars = await applyDiscountToCarsWithFirstRegistrationDateBetween(config);

  return {
    // removedOwners,
    updatedCars,
  };
};
