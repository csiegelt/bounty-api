import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BountyEstado } from '../enums/bounty-estado.enum';
import { Pirate } from '../../pirates/schemas/pirate.schema';

export type BountyDocument = HydratedDocument<Bounty>;

@Schema({ timestamps: true })
export class Bounty {
  @Prop({ required: true })
  cantidadBellys: number;

  @Prop({ type: String, enum: BountyEstado, default: BountyEstado.WANTED })
  estado: BountyEstado;

  @Prop({ type: Types.ObjectId, ref: Pirate.name, required: true })
  pirata: Types.ObjectId;
}

export const BountySchema = SchemaFactory.createForClass(Bounty);
