import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Manufacturer, ManufacturerDocument } from './schemas/manufacturer.schema';
import { Manufacturer as ManufacturerEntity } from './entities/manufacturer.entity';
import { CreateManufacturerDto } from './dto/manufacturer.dto';
import { ManufacturerConflictException } from './errors/ManufacturerConflictException.error';

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
  ) {}

  private _saveManufacturer(manufacturer: Manufacturer): Promise<ManufacturerDocument> {
    const createdManufacturer = new this.manufacturerModel(manufacturer);
    return createdManufacturer.save();
  }

  private _findManufacturers(): Promise<ManufacturerDocument[]> {
    return this.manufacturerModel.find().exec();
  }

  findManufacturerBySiret(siret: number): Promise<ManufacturerDocument> {
    return this.manufacturerModel
      .findOne({
        siret,
      })
      .exec();
  }

  async getManufacturers(): Promise<ManufacturerEntity[]> {
    const manufacturers = await this._findManufacturers();
    return manufacturers.map((manufacturer) => new ManufacturerEntity(manufacturer));
  }

  async createManufacturer(
    manufacturerDto: CreateManufacturerDto,
  ): Promise<ManufacturerEntity> {
    const siret = manufacturerDto.siret;
    let manufacturer = await this.findManufacturerBySiret(siret);

    if (manufacturer) {
      throw new ManufacturerConflictException(siret);
    }

    const createdManufacturer = await this._saveManufacturer(manufacturerDto);
    return new ManufacturerEntity(createdManufacturer);
  }
}
