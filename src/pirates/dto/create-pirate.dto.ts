import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePirateDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  tripulacion: string;

  @IsOptional()
  @IsBoolean()
  tieneFrutaDelDiablo?: boolean;
}
