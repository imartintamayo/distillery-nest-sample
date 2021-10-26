import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service';
import { Car, CarDocument } from './schemas/car.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { CarNotFoundException } from './errors/CarNotFoundException.error';
import { CreateCarDto, UpdateCarDto } from './dto/car.dto';
import { ManufacturerNotFoundException } from '../manufacturers/errors/ManufacturerNotFoundException.error';

// this is to create a reference to this method out of the manufacturer model instance
const save = jest.fn();

describe('CarsService', () => {
  let carService: CarsService;
  let carModel: Model<CarDocument>;
  let manufacturersService: ManufacturersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsService,
        {
          provide: ManufacturersService,
          useValue: MockManufacturersService,
        },
        {
          provide: getModelToken(Car.name),
          useValue: MockCarsModel,
        },
      ],
    }).compile();

    carService = module.get<CarsService>(CarsService);
    manufacturersService = module.get<ManufacturersService>(ManufacturersService);
    carModel = module.get<Model<CarDocument>>(getModelToken(Car.name));
  });

  afterEach(() => {
    MockCarsModel.find.mockRestore();
    MockCarsModel.findById.mockRestore();
    MockCarsModel.updateOne.mockRestore();
    MockCarsModel.deleteOne.mockRestore();
    MockManufacturersService.findManufacturerBySiret.mockRestore();
    save.mockRestore();
  });

  it('should be defined', () => {
    expect(carService).toBeDefined();
  });

  describe('getCars', () => {
    it('should return cars list', async () => {
      MockCarsModel.find.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue([]),
        })),
      }));

      await carService.getCars();
      expect(carModel.find).toBeCalledTimes(1);
    });
  });

  describe('getCarById', () => {
    it('should return the found car', async () => {
      const sampleCar = {
        price: 10,
        manufacturer: {
          name: 'some name',
          siret: 1234,
          phone: 'some phone',
        },
        firstRegistrationDate: new Date(),
        owners: [],
      };

      MockCarsModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleCar),
        })),
      }));

      const carId = 'some car id';
      await carService.getCarById(carId);
      expect(carModel.findById).toBeCalledTimes(1);
      expect(carModel.findById).toBeCalledWith(carId);
    });

    it('should throw an error if car is NOT found', async () => {
      MockCarsModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(null),
        })),
      }));

      const carId = 'some car id';
      let error;

      try {
        await carService.getCarById(carId);
      } catch (e) {
        error = e;
      }

      expect(carModel.findById).toBeCalledTimes(1);
      expect(carModel.findById).toBeCalledWith(carId);

      expect(error).toBeInstanceOf(CarNotFoundException);
    });
  });

  describe('getCarManufacturerByCarId', () => {
    it('should return the found car manufacturer info', async () => {
      const sampleCar = {
        price: 10,
        manufacturer: {
          name: 'some name',
          siret: 1234,
          phone: 'some phone',
        },
        firstRegistrationDate: new Date(),
        owners: [],
      };

      MockCarsModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleCar),
        })),
      }));

      const carId = 'some car id';
      const result = await carService.getCarManufacturerByCarId(carId);
      expect(carModel.findById).toBeCalledTimes(1);
      expect(carModel.findById).toBeCalledWith(carId);
      expect(result).toEqual(sampleCar.manufacturer);
    });

    it('should throw an error if car is NOT found', async () => {
      MockCarsModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(null),
        })),
      }));

      const carId = 'some car id';
      let error;

      try {
        await carService.getCarManufacturerByCarId(carId);
      } catch (e) {
        error = e;
      }

      expect(carModel.findById).toBeCalledTimes(1);
      expect(carModel.findById).toBeCalledWith(carId);

      expect(error).toBeInstanceOf(CarNotFoundException);
    });
  });

  describe('createCar', () => {
    it('should return the found car manufacturer info', async () => {
      const carDto: CreateCarDto = {
        price: 10,
        manufacturer: 1234,
        firstRegistrationDate: new Date(),
        owners: [],
      };

      MockManufacturersService.findManufacturerBySiret.mockResolvedValue({
        _id: 'some manufacturer id',
      });

      await carService.createCar(carDto);

      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledTimes(1);
      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledWith(
        carDto.manufacturer,
      );

      expect(save).toBeCalledTimes(1);
      expect(save).toBeCalledWith();
    });

    it('should throw an error if manufacturer by siret is NOT found', async () => {
      const carDto: CreateCarDto = {
        price: 10,
        manufacturer: 1234,
        firstRegistrationDate: new Date(),
        owners: [],
      };

      MockManufacturersService.findManufacturerBySiret.mockResolvedValue(null);

      let error;
      try {
        await carService.createCar(carDto);
      } catch (e) {
        error = e;
      }

      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledTimes(1);
      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledWith(
        carDto.manufacturer,
      );

      expect(error).toBeInstanceOf(ManufacturerNotFoundException);

      expect(save).not.toBeCalled();
    });
  });

  describe('updateCarById', () => {
    const sampleCar = {
      price: 10,
      manufacturer: {
        name: 'some name',
        siret: 1234,
        phone: 'some phone',
      },
      firstRegistrationDate: new Date(),
      owners: [],
    };

    it('should update car by id - all fields', async () => {
      const carDto: UpdateCarDto = {
        price: 10,
        manufacturer: 1234,
        firstRegistrationDate: new Date(),
        owners: ['owner1', 'owner2'],
      };

      MockCarsModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleCar),
        })),
      }));

      MockCarsModel.updateOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const manufacturerId = 'some manufacturer id';
      MockManufacturersService.findManufacturerBySiret.mockResolvedValue({
        _id: manufacturerId,
      });

      const carId = 'some car id';
      await carService.updateCarById(carId, carDto);

      expect(MockCarsModel.findById).toBeCalledTimes(2);
      expect(MockCarsModel.findById).toBeCalledWith(carId);

      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledTimes(1);
      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledWith(
        carDto.manufacturer,
      );

      const dataToSet = {
        ...carDto,
        manufacturer: manufacturerId,
      };
      expect(MockCarsModel.updateOne).toBeCalledTimes(1);
      expect(MockCarsModel.updateOne).toBeCalledWith(
        { _id: carId },
        { $set: dataToSet },
      );
    });

    it('should update car by id - manufacturer', async () => {
      const carDto: UpdateCarDto = {
        manufacturer: 1234,
      };

      MockCarsModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleCar),
        })),
      }));

      MockCarsModel.updateOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const manufacturerId = 'some manufacturer id';
      MockManufacturersService.findManufacturerBySiret.mockResolvedValue({
        _id: manufacturerId,
      });

      const carId = 'some car id';
      await carService.updateCarById(carId, carDto);

      expect(MockCarsModel.findById).toBeCalledTimes(2);
      expect(MockCarsModel.findById).toBeCalledWith(carId);

      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledTimes(1);
      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledWith(
        carDto.manufacturer,
      );

      const dataToSet = {
        ...carDto,
        manufacturer: manufacturerId,
      };
      expect(MockCarsModel.updateOne).toBeCalledTimes(1);
      expect(MockCarsModel.updateOne).toBeCalledWith(
        { _id: carId },
        { $set: dataToSet },
      );
    });

    it('should update car by id - price', async () => {
      const carDto: UpdateCarDto = {
        price: 10,
      };

      MockCarsModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleCar),
        })),
      }));

      MockCarsModel.updateOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const carId = 'some car id';
      await carService.updateCarById(carId, carDto);

      expect(MockCarsModel.findById).toBeCalledTimes(2);
      expect(MockCarsModel.findById).toBeCalledWith(carId);

      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledTimes(1);
      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledWith(
        carDto.manufacturer,
      );

      const dataToSet = {
        ...carDto,
      };
      expect(MockCarsModel.updateOne).toBeCalledTimes(1);
      expect(MockCarsModel.updateOne).toBeCalledWith(
        { _id: carId },
        { $set: dataToSet },
      );
    });

    it('should update car by id - firstRegistrationDate', async () => {
      const carDto: UpdateCarDto = {
        firstRegistrationDate: new Date(),
      };

      MockCarsModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleCar),
        })),
      }));

      MockCarsModel.updateOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const carId = 'some car id';
      await carService.updateCarById(carId, carDto);

      expect(MockCarsModel.findById).toBeCalledTimes(2);
      expect(MockCarsModel.findById).toBeCalledWith(carId);

      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledTimes(1);
      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledWith(
        carDto.manufacturer,
      );

      const dataToSet = {
        ...carDto,
      };
      expect(MockCarsModel.updateOne).toBeCalledTimes(1);
      expect(MockCarsModel.updateOne).toBeCalledWith(
        { _id: carId },
        { $set: dataToSet },
      );
    });

    it('should update car by id - owners', async () => {
      const carDto: UpdateCarDto = {
        owners: ['owner1', 'owner2'],
      };

      MockCarsModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleCar),
        })),
      }));

      MockCarsModel.updateOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const carId = 'some car id';
      await carService.updateCarById(carId, carDto);

      expect(MockCarsModel.findById).toBeCalledTimes(2);
      expect(MockCarsModel.findById).toBeCalledWith(carId);

      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledTimes(1);
      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledWith(
        carDto.manufacturer,
      );

      const dataToSet = {
        ...carDto,
      };
      expect(MockCarsModel.updateOne).toBeCalledTimes(1);
      expect(MockCarsModel.updateOne).toBeCalledWith(
        { _id: carId },
        { $set: dataToSet },
      );
    });

    it('should throw an error if car is NOT found', async () => {
      MockCarsModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(null),
        })),
      }));

      const carId = 'some car id';
      let error;
      const carDto: UpdateCarDto = {
        owners: ['owner1', 'owner2'],
      };

      try {
        await carService.updateCarById(carId, carDto);
      } catch (e) {
        error = e;
      }

      expect(carModel.findById).toBeCalledTimes(1);
      expect(carModel.findById).toBeCalledWith(carId);

      expect(error).toBeInstanceOf(CarNotFoundException);

      expect(MockManufacturersService.findManufacturerBySiret).not.toBeCalled();
      expect(MockCarsModel.updateOne).not.toBeCalled();
    });

    it('should throw an error if manufacturer by siret is NOT found', async () => {
      const carDto: UpdateCarDto = {
        price: 10,
        manufacturer: 1234,
        firstRegistrationDate: new Date(),
        owners: [],
      };

      MockCarsModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleCar),
        })),
      }));

      MockManufacturersService.findManufacturerBySiret.mockResolvedValue(null);

      const carId = 'some car id';
      let error;

      try {
        await carService.updateCarById(carId, carDto);
      } catch (e) {
        error = e;
      }

      expect(carModel.findById).toBeCalledTimes(1);
      expect(carModel.findById).toBeCalledWith(carId);

      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledTimes(1);
      expect(MockManufacturersService.findManufacturerBySiret).toBeCalledWith(
        carDto.manufacturer,
      );

      expect(error).toBeInstanceOf(ManufacturerNotFoundException);

      expect(MockCarsModel.updateOne).not.toBeCalled();
    });
  });

  describe('deleteCarById', () => {
    it('should delete the found car', async () => {
      const sampleCar = {
        price: 10,
        manufacturer: {
          name: 'some name',
          siret: 1234,
          phone: 'some phone',
        },
        firstRegistrationDate: new Date(),
        owners: [],
      };

      MockCarsModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleCar),
        })),
      }));

      MockCarsModel.deleteOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const carId = 'some car id';
      await carService.deleteCarById(carId);

      expect(carModel.findById).toBeCalledTimes(1);
      expect(carModel.findById).toBeCalledWith(carId);

      expect(carModel.deleteOne).toBeCalledTimes(1);
      expect(carModel.deleteOne).toBeCalledWith({ _id: carId });
    });

    it('should throw an error if car is NOT found', async () => {
      MockCarsModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(null),
        })),
      }));

      const carId = 'some car id';
      let error;

      try {
        await carService.deleteCarById(carId);
      } catch (e) {
        error = e;
      }

      expect(carModel.findById).toBeCalledTimes(1);
      expect(carModel.findById).toBeCalledWith(carId);

      expect(error).toBeInstanceOf(CarNotFoundException);

      expect(carModel.deleteOne).not.toBeCalled();
    });
  });
});

function MockManufacturersService() {}
MockManufacturersService.findManufacturerBySiret = jest.fn();

function MockCarsModel() {
  this.save = save;
}

MockCarsModel.find = jest.fn();
MockCarsModel.findById = jest.fn();
MockCarsModel.updateOne = jest.fn();
MockCarsModel.deleteOne = jest.fn();
