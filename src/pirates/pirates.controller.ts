import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PiratesService } from './pirates.service';
import { CreatePirateDto } from './dto/create-pirate.dto';

@Controller('pirates')
export class PiratesController {
  constructor(private readonly piratesService: PiratesService) {}

  @Post()
  create(@Body() createPirateDto: CreatePirateDto) {
    return this.piratesService.create(createPirateDto);
  }

  @Get()
  findAll() {
    return this.piratesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.piratesService.findOne(id);
  }
}
