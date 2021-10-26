import { Test, TestingModule } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto } from './dto/car.dto';

describe('CarsController', () => {
  let controller: CarsController;
  let carsService: CarsService;
  const carId = 'someCarId';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [
        {
          provide: CarsService,
          useValue: MockCarService,
        },
      ],
    }).compile();

    carsService = module.get<CarsService>(CarsService);
    controller = module.get<CarsController>(CarsController);
  });

  afterEach(() => {
    MockCarService.getCars.mockRestore();
    MockCarService.getCarById.mockRestore();
    MockCarService.getCarManufacturerByCarId.mockRestore();
    MockCarService.createCar.mockRestore();
    MockCarService.updateCarById.mockRestore();
    MockCarService.deleteCarById.mockRestore();
    MockCarService.triggerApplyDiscountAndDeleteOlderCarsProcess.mockRestore();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get cars list "/"', () => {
    it('200 OK', async () => {
      await controller.getCars();
      expect(carsService.getCars).toBeCalledTimes(1);
    });
  });

  describe('get car "/:carId"', () => {
    it('200 OK', async () => {
      await controller.getCar(carId);
      expect(carsService.getCarById).toBeCalledTimes(1);
      expect(carsService.getCarById).toBeCalledWith(carId);
    });
  });

  describe('get car manufaturer "/:carId/manufacturer"', () => {
    it('200 OK', async () => {
      await controller.getManufacturer(carId);
      expect(carsService.getCarManufacturerByCarId).toBeCalledTimes(1);
      expect(carsService.getCarManufacturerByCarId).toBeCalledWith(carId);
    });
  });

  describe('post car "/create"', () => {
    it('201 OK', async () => {
      const carDto: CreateCarDto = {
        price: 10.2,
        manufacturer: 1234,
        firstRegistrationDate: new Date(),
      };

      await controller.createCar(carDto);
      expect(carsService.createCar).toBeCalledTimes(1);
      expect(carsService.createCar).toBeCalledWith(carDto);
    });

    it('201 OK with owner', async () => {
      const carDto: CreateCarDto = {
        price: 10.2,
        manufacturer: 1234,
        firstRegistrationDate: new Date(),
        owners: ['owner1'],
      };

      await controller.createCar(carDto);
      expect(carsService.createCar).toBeCalledTimes(1);
      expect(carsService.createCar).toBeCalledWith(carDto);
    });
  });

  describe('put car "/:carId/update"', () => {
    it('200 OK - set price', async () => {
      const carDto: UpdateCarDto = {
        price: 10.2,
      };

      await controller.updateCar(carId, carDto);
      expect(carsService.updateCarById).toBeCalledTimes(1);
      expect(carsService.updateCarById).toBeCalledWith(carId, carDto);
    });

    it('200 OK - set manufacturer', async () => {
      const carDto: UpdateCarDto = {
        manufacturer: 1234,
      };

      await controller.updateCar(carId, carDto);
      expect(carsService.updateCarById).toBeCalledTimes(1);
      expect(carsService.updateCarById).toBeCalledWith(carId, carDto);
    });

    it('200 OK - set firstRegistrationDate', async () => {
      const carDto: UpdateCarDto = {
        firstRegistrationDate: new Date(),
      };

      await controller.updateCar(carId, carDto);
      expect(carsService.updateCarById).toBeCalledTimes(1);
      expect(carsService.updateCarById).toBeCalledWith(carId, carDto);
    });

    it('200 OK - set owners', async () => {
      const carDto: UpdateCarDto = {
        owners: ['owner1', 'owner2'],
      };

      await controller.updateCar(carId, carDto);
      expect(carsService.updateCarById).toBeCalledTimes(1);
      expect(carsService.updateCarById).toBeCalledWith(carId, carDto);
    });

    it('200 OK - set all fields', async () => {
      const carDto: UpdateCarDto = {
        price: 10.2,
        manufacturer: 1234,
        firstRegistrationDate: new Date(),
        owners: ['owner1', 'owner2'],
      };

      await controller.updateCar(carId, carDto);
      expect(carsService.updateCarById).toBeCalledTimes(1);
      expect(carsService.updateCarById).toBeCalledWith(carId, carDto);
    });
  });

  describe('delete car "/:carId/delete"', () => {
    it('200 OK', async () => {
      await controller.deleteCar(carId);
      expect(carsService.deleteCarById).toBeCalledTimes(1);
      expect(carsService.deleteCarById).toBeCalledWith(carId);
    });
  });

  describe('post trigger apply discount and delete older cars process "/trigger-apply-discount-and-delete-older-cars-process"', () => {
    it('201 OK', async () => {
      await controller.triggerApplyDiscountAndDeleteOlderCarsProcess();
      expect(
        carsService.triggerApplyDiscountAndDeleteOlderCarsProcess,
      ).toBeCalledTimes(1);
    });
  });
});

function MockCarService() {}
MockCarService.getCars = jest.fn();
MockCarService.getCarById = jest.fn();
MockCarService.getCarManufacturerByCarId = jest.fn();
MockCarService.createCar = jest.fn();
MockCarService.updateCarById = jest.fn();
MockCarService.deleteCarById = jest.fn();
MockCarService.triggerApplyDiscountAndDeleteOlderCarsProcess = jest.fn();
