import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturersService } from './manufacturers.service';
import { CreateManufacturerDto } from './dto/manufacturer.dto';
import { Manufacturer, ManufacturerDocument } from './schemas/manufacturer.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ManufacturerConflictException } from './errors/ManufacturerConflictException.error';

// this is to create a reference to this method out of the Manufacturer model instance
const save = jest.fn();

describe('ManufacturersService', () => {
  let manufacturersService: ManufacturersService;
  let manufacturerModel: Model<ManufacturerDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManufacturersService,
        {
          provide: getModelToken(Manufacturer.name),
          useValue: MockManufacturersModel,
        },
      ],
    }).compile();

    manufacturersService = module.get<ManufacturersService>(ManufacturersService);
    manufacturerModel = module.get<Model<ManufacturerDocument>>(
      getModelToken(Manufacturer.name),
    );
  });

  afterEach(() => {
    MockManufacturersModel.findOne.mockRestore();
    MockManufacturersModel.find.mockRestore();
    save.mockRestore();
  });

  it('should be defined', () => {
    expect(manufacturersService).toBeDefined();
  });

  describe('getManufacturers', () => {
    it('should return Manufacturers list', async () => {
      MockManufacturersModel.find.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue([]),
      }));

      await manufacturersService.getManufacturers();
      expect(manufacturerModel.find).toBeCalledTimes(1);
    });
  });

  describe('createManufacturer', () => {
    it('should create a new Manufacturer on db', async () => {
      MockManufacturersModel.findOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const manufacturerDto: CreateManufacturerDto = {
        name: 'some name',
        phone: 'some phone',
        siret: 1234,
      };

      await manufacturersService.createManufacturer(manufacturerDto);
      expect(manufacturerModel.findOne).toBeCalledTimes(1);
      expect(manufacturerModel.findOne).toBeCalledWith({
        siret: manufacturerDto.siret,
      });

      expect(save).toBeCalledTimes(1);
      expect(save).toBeCalledWith();
    });

    it('should NOT create a new Manufacturer on db and throw a ManufacturerConflictException', async () => {
      const manufacturerDto: CreateManufacturerDto = {
        name: 'some name',
        phone: 'some phone',
        siret: 1234,
      };

      MockManufacturersModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(manufacturerDto),
      }));

      let error;
      try {
        await manufacturersService.createManufacturer(manufacturerDto);
      } catch (e) {
        error = e;
      }

      expect(manufacturerModel.findOne).toBeCalledTimes(1);
      expect(manufacturerModel.findOne).toBeCalledWith({
        siret: manufacturerDto.siret,
      });

      expect(error).toBeInstanceOf(ManufacturerConflictException);

      expect(save).not.toBeCalledTimes(1);
      expect(save).not.toBeCalledWith();
    });
  });

  describe('findManufacturerBySiret', () => {
    it('should find a Manufacturer by its siret number', async () => {
      MockManufacturersModel.findOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));
      const siret = 1234;

      await manufacturersService.findManufacturerBySiret(siret);
      expect(manufacturerModel.findOne).toBeCalledTimes(1);
      expect(manufacturerModel.findOne).toBeCalledWith({
        siret,
      });
    });
  });
});

function MockManufacturersModel() {
  this.save = save;
}

MockManufacturersModel.find = jest.fn();
MockManufacturersModel.findOne = jest.fn();
