import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bounty, BountyDocument } from './schemas/bounty.schema';
import { BountyEstado } from './enums/bounty-estado.enum';
import { CreateBountyDto } from './dto/create-bounty.dto';
import { UpdateBountyDto } from './dto/update-bounty.dto';

@Injectable()
export class BountiesService {
  constructor(
    @InjectModel(Bounty.name) private bountyModel: Model<BountyDocument>,
  ) {}

  async create(createBountyDto: CreateBountyDto): Promise<Bounty> {
    const bounty = new this.bountyModel(createBountyDto);
    return bounty.save();
  }

  async findAll(): Promise<Bounty[]> {
    return this.bountyModel.find().populate('pirata').exec();
  }

  async findActive(): Promise<Bounty[]> {
    return this.bountyModel
      .find({ estado: BountyEstado.WANTED })
      .populate('pirata')
      .exec();
  }

  async findOne(id: string): Promise<Bounty> {
    const bounty = await this.bountyModel
      .findById(id)
      .populate('pirata')
      .exec();
    if (!bounty) {
      throw new NotFoundException(`Bounty con ID "${id}" no encontrada`);
    }
    return bounty;
  }

  async update(id: string, updateBountyDto: UpdateBountyDto): Promise<Bounty> {
    const bounty = await this.bountyModel
      .findByIdAndUpdate(id, updateBountyDto, { new: true })
      .populate('pirata')
      .exec();
    if (!bounty) {
      throw new NotFoundException(`Bounty con ID "${id}" no encontrada`);
    }
    return bounty;
  }

  async remove(id: string): Promise<Bounty> {
    const bounty = await this.bountyModel.findByIdAndDelete(id).exec();
    if (!bounty) {
      throw new NotFoundException(`Bounty con ID "${id}" no encontrada`);
    }
    return bounty;
  }
}
