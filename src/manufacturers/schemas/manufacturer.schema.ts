import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Manufacturer {
  @Prop()
  name: string;

  @Prop()
  siret: number;

  @Prop()
  phone: string;
}

export type ManufacturerDocument = Manufacturer & Document;
export const ManufacturerSchema = SchemaFactory.createForClass(Manufacturer);
