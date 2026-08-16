import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SetGraduateStatusDto {
  @ApiProperty()
  @IsBoolean()
  isGraduate: boolean
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
