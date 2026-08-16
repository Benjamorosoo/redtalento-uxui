import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SetGraduateStatusDto {
  @ApiProperty()
  @IsBoolean()
  isGraduate: boolean
}

export class SendGraduateSurveyDto {
  @ApiPropertyOptional({ type: [String], description: 'Preguntas personalizadas — si se omite, se usan las 3 por defecto' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questions?: string[]
}

export class SubmitGraduateSurveyDto {
  @ApiProperty()
  @IsBoolean()
  isWorking: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  worksInSpecialty?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timeToFindJob?: string
}
