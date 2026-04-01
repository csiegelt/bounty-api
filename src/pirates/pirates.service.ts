import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pirate, PirateDocument } from './schemas/pirate.schema';
import { CreatePirateDto } from './dto/create-pirate.dto';

@Injectable()
export class PiratesService {
  constructor(
    @InjectModel(Pirate.name) private pirateModel: Model<PirateDocument>,
  ) {}

  async create(createPirateDto: CreatePirateDto): Promise<Pirate> {
    try {
      const pirate = new this.pirateModel(createPirateDto);
      return await pirate.save();
    } catch (error) {
      if ((error as any).code === 11000) {
        throw new ConflictException(
          `Ya existe un pirata con el nombre "${createPirateDto.nombre}"`,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Pirate[]> {
    return this.pirateModel.find().exec();
  }

  async findOne(id: string): Promise<Pirate> {
    const pirate = await this.pirateModel.findById(id).exec();
    if (!pirate) {
      throw new NotFoundException(`Pirata con ID "${id}" no encontrado`);
    }
    return pirate;
  }
}
