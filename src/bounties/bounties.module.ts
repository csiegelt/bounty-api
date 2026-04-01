import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BountiesController } from './bounties.controller';
import { BountiesService } from './bounties.service';
import { Bounty, BountySchema } from './schemas/bounty.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bounty.name, schema: BountySchema }]),
  ],
  controllers: [BountiesController],
  providers: [BountiesService],
})
export class BountiesModule {}
