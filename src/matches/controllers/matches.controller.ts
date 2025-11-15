import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MatchesService } from '../services/matches.service';
import { Match } from '../entities/match.entity';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  create(@Body() createMatchDto: Partial<Match>): Promise<Match> {
    return this.matchesService.create(createMatchDto);
  }

  @Get()
  findAll(): Promise<Match[]> {
    return this.matchesService.findAll();
  }

  @Get('live')
  findLive(): Promise<Match[]> {
    return this.matchesService.findLive();
  }

  @Get('date')
  findByDate(
    @Query('start') startDate: string,
    @Query('end') endDate: string,
  ): Promise<Match[]> {
    return this.matchesService.findByDate(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('team/:teamId')
  findByTeam(@Param('teamId') teamId: string): Promise<Match[]> {
    return this.matchesService.findByTeam(teamId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Match> {
    return this.matchesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMatchDto: Partial<Match>,
  ): Promise<Match> {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.matchesService.remove(id);
  }
}
