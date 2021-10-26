import { Controller, Get, Post, Body, HttpStatus } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOwnerDto } from './dto/owner.dto';
import { Owner as OwnerEntity } from './entities/owner.entity';

@ApiTags('OWNERS')
@Controller('owners')
export class OwnersController {
  constructor(private ownersService: OwnersService) {}

  @Get()
  @ApiOperation({ summary: 'List Owners' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [OwnerEntity],
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  getOwners(): Promise<OwnerEntity[]> {
    return this.ownersService.getOwners();
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create Owner' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OwnerEntity,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  createOwner(@Body() body: CreateOwnerDto): Promise<OwnerEntity> {
    return this.ownersService.createOwner(body);
  }
}
