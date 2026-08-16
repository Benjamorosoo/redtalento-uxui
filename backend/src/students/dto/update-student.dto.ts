import { IsString, IsOptional, IsInt, IsUrl, Min, Max, IsEnum, IsArray, IsBoolean, MaxLength, Matches, ValidateIf } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { EvidenceType } from '../entities/portfolio-evidence.entity'

const PHONE_REGEX = /^\+?[0-9\s-]{6,20}$/

export class UpdateStudentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) firstName?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) lastName?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(150) headline?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) bio?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) specialty?: string
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Max(4) year?: number
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20)
  @ValidateIf((o) => !!o.phone)
  @Matches(PHONE_REGEX, { message: 'Teléfono inválido — usa solo números, espacios, guiones y "+" al inicio' })
  phone?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(150) location?: string
  @ApiPropertyOptional() @IsOptional() @IsString() avatar?: string
  @ApiPropertyOptional() @IsOptional() @IsString() coverImage?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(300)
  @ValidateIf((o) => !!o.linkedinUrl)
  @IsUrl({}, { message: 'URL de LinkedIn inválida' })
  linkedinUrl?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(300)
  @ValidateIf((o) => !!o.githubUrl)
  @IsUrl({}, { message: 'URL de GitHub inválida' })
  githubUrl?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(300)
  @ValidateIf((o) => !!o.portfolioUrl)
  @IsUrl({}, { message: 'URL de portafolio inválida' })
  portfolioUrl?: string
  @ApiPropertyOptional() @IsOptional() @IsString() schoolUserId?: string
}

export class CreateEvidenceDto {
  @ApiProperty()  @IsString()  @MaxLength(150) title: string
  @ApiProperty()  @IsString()  @MaxLength(500) description: string
  @ApiProperty({ enum: EvidenceType }) @IsEnum(EvidenceType) type: EvidenceType
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(300)
  @ValidateIf((o) => !!o.url)
  @IsUrl({}, { message: 'URL inválida' })
  url?: string
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) @MaxLength(30, { each: true }) tags?: string[]
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPublic?: boolean
}

export class StudentSearchDto {
  @ApiPropertyOptional() @IsOptional() @IsString()  specialty?: string
  @ApiPropertyOptional() @IsOptional() @IsArray()   @IsString({ each: true }) skills?: string[]
  @ApiPropertyOptional() @IsOptional() @IsInt()     @Min(0) @Max(100) minScore?: number
  @ApiPropertyOptional() @IsOptional() @IsInt()     @Min(1) @Max(4) year?: number
  @ApiPropertyOptional() @IsOptional() @IsInt()     @Min(1) page?: number
  @ApiPropertyOptional() @IsOptional() @IsInt()     @Min(1) @Max(100) limit?: number
}
