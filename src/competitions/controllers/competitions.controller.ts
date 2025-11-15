import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompetitionsService } from '../services/competitions.service';
import { Competition } from '../entities/competition.entity';

@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Post()
  create(@Body() createCompetitionDto: Partial<Competition>): Promise<Competition> {
    return this.competitionsService.create(createCompetitionDto);
  }

  @Get()
  findAll(): Promise<Competition[]> {
    return this.competitionsService.findAll();
  }

  @Get('active')
  findActive(): Promise<Competition[]> {
    return this.competitionsService.findActive();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string): Promise<Competition> {
    return this.competitionsService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Competition> {
    return this.competitionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompetitionDto: Partial<Competition>,
  ): Promise<Competition> {
    return this.competitionsService.update(id, updateCompetitionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.competitionsService.remove(id);
  }
}
