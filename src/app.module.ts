import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './config/environment';

@Module({
  imports: [
    MongooseModule.forRoot(environment.mongoConnect),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
