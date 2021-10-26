import { Controller, Get, Post, Body, HttpStatus } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManufacturerDto } from './dto/manufacturer.dto';
import { Manufacturer as ManufacturerEntity } from './entities/manufacturer.entity';

@ApiTags('MANUFACTURERS')
@Controller('manufacturers')
export class ManufacturersController {
  constructor(private manufacturersService: ManufacturersService) {}

  @Get()
  @ApiOperation({ summary: 'List Manufacturers' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ManufacturerEntity],
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  getManufacturers(): Promise<ManufacturerEntity[]> {
    return this.manufacturersService.getManufacturers();
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create Manufacturer' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ManufacturerEntity,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  createManufacturer(@Body() body: CreateManufacturerDto): Promise<ManufacturerEntity> {
    return this.manufacturersService.createManufacturer(body);
  }
}
