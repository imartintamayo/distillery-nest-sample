import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturersController } from './manufacturers.controller';
import { ManufacturersService } from './manufacturers.service';
import { CreateManufacturerDto } from './dto/manufacturer.dto';

describe('ManufacturersController', () => {
  let controller: ManufacturersController;
  let manufacturersService: ManufacturersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManufacturersController],
      providers: [
        {
          provide: ManufacturersService,
          useValue: MockManufacturersService,
        },
      ],
    }).compile();

    manufacturersService = module.get<ManufacturersService>(ManufacturersService);
    controller = module.get<ManufacturersController>(ManufacturersController);
  });

  afterEach(() => {
    MockManufacturersService.getManufacturers.mockRestore();
    MockManufacturersService.createManufacturer.mockRestore();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get manufacturers list "/"', () => {
    it('200 OK', async () => {
      await controller.getManufacturers();
      expect(manufacturersService.getManufacturers).toBeCalledTimes(1);
    });
  });

  describe('post manufacturer "/create"', () => {
    it('201 OK', async () => {
      const manufacturerDto: CreateManufacturerDto = {
        name: 'some name',
        phone: 'some phone',
        siret: 1234,
      };

      await controller.createManufacturer(manufacturerDto);
      expect(manufacturersService.createManufacturer).toBeCalledTimes(1);
      expect(manufacturersService.createManufacturer).toBeCalledWith(manufacturerDto);
    });
  });
});

function MockManufacturersService() {}
MockManufacturersService.getManufacturers = jest.fn();
MockManufacturersService.createManufacturer = jest.fn();
