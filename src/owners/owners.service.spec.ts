import { Test, TestingModule } from '@nestjs/testing';
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/owner.dto';
import { Owner, OwnerDocument } from './schemas/owner.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OwnerNotFoundException } from './errors/ownerNotFoundException.error';

// this is to create a reference to this method out of the Owner model instance
const save = jest.fn();

describe('OwnersService', () => {
  let ownersService: OwnersService;
  let ownerModel: Model<OwnerDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnersService,
        {
          provide: getModelToken(Owner.name),
          useValue: MockOwnersModel,
        },
      ],
    }).compile();

    ownersService = module.get<OwnersService>(OwnersService);
    ownerModel = module.get<Model<OwnerDocument>>(
      getModelToken(Owner.name),
    );
  });

  afterEach(() => {
    MockOwnersModel.findById.mockRestore();
    MockOwnersModel.find.mockRestore();
    save.mockRestore();
  });

  it('should be defined', () => {
    expect(ownersService).toBeDefined();
  });

  describe('getOwners', () => {
    it('should return Owners list', async () => {
      MockOwnersModel.find.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue([]),
      }));

      await ownersService.getOwners();
      expect(ownerModel.find).toBeCalledTimes(1);
    });
  });

  describe('CreateOwner', () => {
    it('should create a new Owner on db', async () => {
      const ownerDto: CreateOwnerDto = {
        name: 'some name',
        purchaseDate: new Date(),
      };

      await ownersService.createOwner(ownerDto);
      expect(save).toBeCalledTimes(1);
      expect(save).toBeCalledWith();
    });
  });

  describe('getOwnerById', () => {
    it('should return the found owner', async () => {
      const sampleOwner = {
        name: 'some name',
        purchaseDate: new Date()
      };

      MockOwnersModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(sampleOwner),
      }));

      const ownerId = 'some owner id';
      await ownersService.getOwnerById(ownerId);
      expect(ownerModel.findById).toBeCalledTimes(1);
      expect(ownerModel.findById).toBeCalledWith(ownerId);
    });

    it('should throw an error if owner is NOT found', async () => {
      MockOwnersModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      const ownerId = 'some owner id';
      let error;

      try {
        await ownersService.getOwnerById(ownerId);
      } catch (e) {
        error = e;
      }

      expect(ownerModel.findById).toBeCalledTimes(1);
      expect(ownerModel.findById).toBeCalledWith(ownerId);

      expect(error).toBeInstanceOf(OwnerNotFoundException);
    });
  });
});

function MockOwnersModel() {
  this.save = save;
}

MockOwnersModel.find = jest.fn();
MockOwnersModel.findById = jest.fn();
