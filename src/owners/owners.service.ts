import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Owner, OwnerDocument } from './schemas/owner.schema';
import { Owner as OwnerEntity } from './entities/owner.entity';
import { CreateOwnerDto } from './dto/owner.dto';
import { OwnerNotFoundException } from './errors/ownerNotFoundException.error';

@Injectable()
export class OwnersService {
  constructor(
    @InjectModel(Owner.name)
    private ownerModel: Model<OwnerDocument>,
  ) {}

  private _saveOwner(owner: Owner): Promise<OwnerDocument> {
    const createdOwner = new this.ownerModel(owner);
    return createdOwner.save();
  }

  private _findOwners(): Promise<OwnerDocument[]> {
    return this.ownerModel.find().exec();
  }

  private _findOwnerById(ownerId: string): Promise<OwnerDocument> {
    return this.ownerModel.findById(ownerId).exec();
  }

  async getOwnerById(ownerId: string): Promise<OwnerEntity> {
    const owner = await this._findOwnerById(ownerId);

    if (!owner) {
      throw new OwnerNotFoundException(ownerId);
    }

    return new OwnerEntity(owner);
  }

  async getOwners(): Promise<OwnerEntity[]> {
    const owners = await this._findOwners();
    return owners.map((owner) => new OwnerEntity(owner));
  }

  async createOwner(
    ownerDto: CreateOwnerDto,
  ): Promise<OwnerEntity> {
    const createdOwner = await this._saveOwner(ownerDto);
    return new OwnerEntity(createdOwner);
  }
}
