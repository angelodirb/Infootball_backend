import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competition } from '../entities/competition.entity';

@Injectable()
export class CompetitionsService {
  constructor(
    @InjectRepository(Competition)
    private competitionsRepository: Repository<Competition>,
  ) {}

  async create(competitionData: Partial<Competition>): Promise<Competition> {
    const competition = this.competitionsRepository.create(competitionData);
    return await this.competitionsRepository.save(competition);
  }

  async findAll(): Promise<Competition[]> {
    return await this.competitionsRepository.find({
      relations: ['teams', 'matches'],
    });
  }

  async findActive(): Promise<Competition[]> {
    return await this.competitionsRepository.find({
      where: { isActive: true },
      relations: ['teams'],
    });
  }

  async findOne(id: string): Promise<Competition> {
    const competition = await this.competitionsRepository.findOne({
      where: { id },
      relations: ['teams', 'matches'],
    });

    if (!competition) {
      throw new NotFoundException(`Competición con ID ${id} no encontrada`);
    }

    return competition;
  }

  async findBySlug(slug: string): Promise<Competition> {
    const competition = await this.competitionsRepository.findOne({
      where: { slug },
      relations: ['teams', 'matches'],
    });

    if (!competition) {
      throw new NotFoundException(`Competición con slug ${slug} no encontrada`);
    }

    return competition;
  }

  async update(
    id: string,
    competitionData: Partial<Competition>,
  ): Promise<Competition> {
    await this.competitionsRepository.update(id, competitionData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.competitionsRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Competición con ID ${id} no encontrada`);
    }
  }
}
