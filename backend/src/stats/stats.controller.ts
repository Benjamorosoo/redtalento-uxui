import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { Public } from '../auth/decorators/public.decorator'
import { StatsService } from './stats.service'

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Métricas públicas reales para la landing page' })
  getPublicStats() {
    return this.statsService.getPublicStats()
  }
}
