import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PiratesController } from './pirates.controller';
import { PiratesService } from './pirates.service';
import { Pirate, PirateSchema } from './schemas/pirate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pirate.name, schema: PirateSchema }]),
  ],
  controllers: [PiratesController],
  providers: [PiratesService],
  exports: [MongooseModule],
})
export class PiratesModule {}
