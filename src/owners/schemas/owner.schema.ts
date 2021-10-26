import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Owner {
  @Prop()
  name: string;

  @Prop()
  purchaseDate: Date;
}

export type OwnerDocument = Owner & Document;
export const OwnerSchema = SchemaFactory.createForClass(Owner);
