import { Controller, Get, Post, Patch, Param, Body, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { SchoolsService, UpdateSchoolDto, CreateStudentDto } from './schools.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser, Public } from '../auth/decorators/public.decorator'
import { UserRole } from '../users/entities/user.entity'

@ApiTags('Schools')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar todos los colegios (público)' })
  findAll() {
    return this.schoolsService.findAll()
  }

  @Get('me')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLEGIO)
  @ApiOperation({ summary: 'Ver mi perfil de colegio' })
  getMyProfile(@CurrentUser() user: any) {
    return this.schoolsService.findByUserId(user.id)
  }

  @Patch('me')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLEGIO)
  @ApiOperation({ summary: 'Actualizar perfil del colegio' })
  update(@CurrentUser() user: any, @Body() dto: UpdateSchoolDto) {
    return this.schoolsService.update(user.id, dto)
  }

  @Get('me/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLEGIO)
  @ApiOperation({ summary: 'Estadísticas generales del colegio' })
  getStats(@CurrentUser() user: any) {
    return this.schoolsService.getStats(user.id)
  }

  @Get('me/students')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLEGIO)
  @ApiOperation({ summary: 'Listar estudiantes vinculados al colegio' })
  getStudents(@CurrentUser() user: any) {
    return this.schoolsService.getStudents(user.id)
  }

  @Post('me/students')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLEGIO)
  @ApiOperation({ summary: 'Crear cuenta de estudiante vinculada al colegio' })
  createStudent(@CurrentUser() user: any, @Body() dto: CreateStudentDto) {
    return this.schoolsService.createStudent(user.id, dto)
  }

  @Get('me/students/export')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLEGIO)
  @ApiOperation({ summary: 'Exportar reporte CSV de evidencia de empleabilidad de los estudiantes' })
  async exportStudents(@CurrentUser() user: any, @Res() res: Response) {
    const csv = await this.schoolsService.exportStudentsCsv(user.id)
    const date = new Date().toISOString().slice(0, 10)
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="reporte-empleabilidad-${date}.csv"`)
    res.send(csv)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver perfil público del colegio' })
  findOne(@Param('id') id: string) {
    return this.schoolsService.findById(id)
  }
}
