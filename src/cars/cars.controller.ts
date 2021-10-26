import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCarDto, UpdateCarDto } from './dto/car.dto';
import { Car as CarEntity } from './entities/car.entity';
import { Manufacturer as ManufacturerEntity } from '../manufacturers/entities/manufacturer.entity';
@ApiTags('CARS')
@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Get()
  @ApiOperation({ summary: 'List Cars' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [CarEntity],
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  getCars(): Promise<CarEntity[]> {
    return this.carsService.getCars();
  }

  @Get(':carId')
  @ApiOperation({ summary: 'Find Car by carId' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CarEntity,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  getCar(@Param('carId') carId: string): Promise<CarEntity> {
    return this.carsService.getCarById(carId);
  }

  @Get(':carId/manufacturer')
  @ApiOperation({ summary: 'Get Car manufacturer info by carId' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ManufacturerEntity,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  getManufacturer(@Param('carId') carId: string): Promise<ManufacturerEntity> {
    return this.carsService.getCarManufacturerByCarId(carId);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create Car' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CarEntity,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  createCar(@Body() body: CreateCarDto): Promise<CarEntity> {
    return this.carsService.createCar(body);
  }

  @Put(':carId/update')
  @ApiOperation({ summary: 'Update Car by carId' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CarEntity,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  updateCar(
    @Param('carId') carId: string,
    @Body() body: UpdateCarDto,
  ): Promise<CarEntity> {
    return this.carsService.updateCarById(carId, body);
  }

  @Delete(':carId/delete')
  @ApiOperation({ summary: 'Delete Car by carId' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CarEntity,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  deleteCar(@Param('carId') carId: string): Promise<CarEntity> {
    return this.carsService.deleteCarById(carId);
  }

  @Post('trigger-apply-discount-and-remove-older-cars-owners--from-list-process')
  @ApiOperation({
    summary: `Trigger a process which will automatically remove the owners who bought their cars before the last 
    18 months and apply a discount of 20% to all cars having a date of first registration between 12 and 18 months.`,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  triggerApplyDiscountAndRemoveOlderCarsOwnersFromListProcess() {
    return this.carsService.triggerApplyDiscountAndRemoveOlderCarsOwnersFromListProcess();
  }
}
