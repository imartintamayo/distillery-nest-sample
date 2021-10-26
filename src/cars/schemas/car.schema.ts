import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';
import {
  ManufacturerDocument,
  Manufacturer,
} from '../../manufacturers/schemas/manufacturer.schema';
import {
  OwnerDocument,
  Owner,
} from '../../owners/schemas/owner.schema';

@Schema()
export class Car {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Manufacturer.name })
  manufacturer: ManufacturerDocument;

  @Prop()
  price: number;

  @Prop()
  firstRegistrationDate: Date;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: Owner.name, default: [] })
  owners?: OwnerDocument[];
}

export type CarDocument = Car & Document;
export const CarSchema = SchemaFactory.createForClass(Car);
