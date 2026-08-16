import { IsString, IsEnum, IsOptional, IsInt, Min, Max, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { SkillCategory } from '../entities/skill.entity'

export class CreateSkillDto {
  @ApiProperty() @IsString() @MaxLength(100) name: string
  @ApiProperty({ enum: SkillCategory }) @IsEnum(SkillCategory) category: SkillCategory
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Max(5) level?: number
}

export class ValidateSkillDto {
  @ApiProperty() @IsString() studentId: string
  @ApiProperty() @IsString() skillId: string
  @ApiProperty({ enum: ['VALIDADA', 'RECHAZADA'] })
  @IsEnum(['VALIDADA', 'RECHAZADA'])
  status: 'VALIDADA' | 'RECHAZADA'
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) notes?: string
}
