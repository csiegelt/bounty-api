import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  IsPositive,
} from 'class-validator';
import { BountyEstado } from '../enums/bounty-estado.enum';

export class CreateBountyDto {
  @IsNumber()
  @IsPositive()
  @Min(0)
  @IsNotEmpty()
  cantidadBellys: number;

  @IsOptional()
  @IsEnum(BountyEstado)
  estado?: BountyEstado;

  @IsMongoId()
  @IsNotEmpty()
  pirata: string;
}
