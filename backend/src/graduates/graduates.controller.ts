import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { GraduatesService } from './graduates.service'
import { SetGraduateStatusDto, SubmitGraduateSurveyDto } from './dto/graduate.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/public.decorator'
import { UserRole } from '../users/entities/user.entity'

@ApiTags('Graduates')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller()
export class GraduatesController {
  constructor(private readonly graduatesService: GraduatesService) {}

  @Patch('schools/me/students/:studentId/graduate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLEGIO)
  @ApiOperation({ summary: 'Marcar/desmarcar a un estudiante como egresado' })
  setGraduateStatus(
    @CurrentUser() user: any,
    @Param('studentId') studentId: string,
    @Body() dto: SetGraduateStatusDto,
  ) {
    return this.graduatesService.setGraduateStatus(user.id, studentId, dto.isGraduate)
  }

  @Post('schools/me/graduates/survey')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLEGIO)
  @ApiOperation({ summary: 'Enviar la encuesta de seguimiento a todos los egresados marcados' })
  sendSurvey(@CurrentUser() user: any) {
    return this.graduatesService.sendSurvey(user.id)
  }

  @Get('students/me/graduate-survey')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Ver mi respuesta a la encuesta de seguimiento (si ya respondí)' })
  getMyResponse(@CurrentUser() user: any) {
    return this.graduatesService.getMyResponse(user.id)
  }

  @Post('students/me/graduate-survey')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Responder la encuesta de seguimiento de egresados' })
  submitResponse(@CurrentUser() user: any, @Body() dto: SubmitGraduateSurveyDto) {
    return this.graduatesService.submitResponse(user.id, dto)
  }
}
