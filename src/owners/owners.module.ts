import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnersController } from './owners.controller';
import { OwnersService } from './owners.service';
import { Owner, OwnerSchema } from './schemas/owner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Owner.name, schema: OwnerSchema },
    ]),
  ],
  controllers: [OwnersController],
  providers: [OwnersService],
})
export class OwnersModule {}
