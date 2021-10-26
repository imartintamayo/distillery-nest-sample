import { Test, TestingModule } from '@nestjs/testing';
import { OwnersController } from './owners.controller';
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/owner.dto';

describe('OwnersController', () => {
  let controller: OwnersController;
  let service: OwnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnersController],
      providers: [
        {
          provide: OwnersService,
          useValue: MockOwnersService,
        },
      ],
    }).compile();

    service = module.get<OwnersService>(OwnersService);
    controller = module.get<OwnersController>(OwnersController);
  });

  afterEach(() => {
    MockOwnersService.getOwners.mockRestore();
    MockOwnersService.createOwner.mockRestore();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get manufacturers list "/"', () => {
    it('200 OK', async () => {
      await controller.getOwners();
      expect(service.getOwners).toBeCalledTimes(1);
    });
  });

  describe('post manufacturer "/create"', () => {
    it('201 OK', async () => {
      const ownerDto: CreateOwnerDto = {
        name: 'some name',
        purchaseDate: new Date(),
      };

      await controller.createOwner(ownerDto);
      expect(service.createOwner).toBeCalledTimes(1);
      expect(service.createOwner).toBeCalledWith(ownerDto);
    });
  });
});

function MockOwnersService() {}
MockOwnersService.getOwners = jest.fn();
MockOwnersService.createOwner = jest.fn();
