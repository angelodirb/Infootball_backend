// backend/src/matches/controllers/matches.controller.ts - VERSION FINAL CON TEST
import { Controller, Get, Query } from '@nestjs/common';
import { MatchesService } from '../services/matches.service';
import { FootballApiService } from '../services/football-api.service';

@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly footballApiService: FootballApiService,
  ) {}

  // ✅ NUEVO: Endpoint para testear conexión con API Football
  @Get('test-api')
  async testApiConnection() {
    try {
      const status = await this.footballApiService.testConnection();
      return {
        success: true,
        message: 'API Football connection successful',
        data: status
      };
    } catch (error) {
      return {
        success: false,
        message: 'API Football connection failed',
        error: error.message
      };
    }
  }

  // Obtener todos los partidos (con datos reales de API Football)
  @Get()
  async findAll() {
    try {
      const apiMatches = await this.footballApiService.getTodayMatches();
      
      const transformedMatches = apiMatches.map(match => 
        this.footballApiService.transformMatch(match)
      );

      return {
        success: true,
        data: transformedMatches,
        count: transformedMatches.length,
        source: 'API-Football'
      };
    } catch (error) {
      console.error('❌ Error fetching from API Football, using local data:', error);
      
      // Fallback a datos locales
      const localMatches = await this.matchesService.findAll();
      return {
        success: true,
        data: localMatches,
        count: localMatches.length,
        source: 'Local Database',
        warning: 'API Football unavailable, using local data'
      };
    }
  }

  // Obtener partidos en vivo (datos reales)
  @Get('live')
  async findLive() {
    try {
      const liveMatches = await this.footballApiService.getLiveMatches();
      
      const transformedMatches = liveMatches.map(match => 
        this.footballApiService.transformMatch(match)
      );

      return {
        success: true,
        data: transformedMatches,
        count: transformedMatches.length,
        source: 'API-Football'
      };
    } catch (error) {
      console.error('❌ Error fetching live matches from API Football:', error);
      return {
        success: false,
        data: [],
        count: 0,
        error: 'No se pudieron obtener partidos en vivo',
        message: error.message
      };
    }
  }

  // Obtener partidos por fecha
  @Get('date')
  async findByDate(@Query('date') date: string) {
    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }

    try {
      const apiMatches = await this.footballApiService.getMatchesByDate(date);
      
      const transformedMatches = apiMatches.map(match => 
        this.footballApiService.transformMatch(match)
      );

      return {
        success: true,
        data: transformedMatches,
        count: transformedMatches.length,
        date: date,
        source: 'API-Football'
      };
    } catch (error) {
      console.error('❌ Error fetching matches by date from API Football:', error);
      return {
        success: false,
        data: [],
        count: 0,
        date: date,
        error: 'No se pudieron obtener partidos para esta fecha',
        message: error.message
      };
    }
  }

  // Obtener partidos destacados (las grandes ligas)
  @Get('featured')
  async findFeatured() {
    try {
      const featuredMatches = await this.footballApiService.getFeaturedMatches();
      
      const transformedMatches = featuredMatches.map(match => 
        this.footballApiService.transformMatch(match)
      );

      return {
        success: true,
        data: transformedMatches,
        count: transformedMatches.length,
        source: 'API-Football'
      };
    } catch (error) {
      console.error('❌ Error fetching featured matches from API Football:', error);
      return {
        success: false,
        data: [],
        count: 0,
        error: 'No se pudieron obtener partidos destacados',
        message: error.message
      };
    }
  }

  // Obtener partidos por rango de fechas
  @Get('range')
  async findByDateRange(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!from || !to) {
      return {
        success: false,
        error: 'Se requieren parámetros "from" y "to" (YYYY-MM-DD)'
      };
    }

    try {
      const apiMatches = await this.footballApiService.getMatchesByDateRange(from, to);
      
      const transformedMatches = apiMatches.map(match => 
        this.footballApiService.transformMatch(match)
      );

      return {
        success: true,
        data: transformedMatches,
        count: transformedMatches.length,
        dateRange: { from, to },
        source: 'API-Football'
      };
    } catch (error) {
      console.error('❌ Error fetching matches by date range from API Football:', error);
      return {
        success: false,
        data: [],
        count: 0,
        dateRange: { from, to },
        error: 'No se pudieron obtener partidos para este rango de fechas',
        message: error.message
      };
    }
  }
}