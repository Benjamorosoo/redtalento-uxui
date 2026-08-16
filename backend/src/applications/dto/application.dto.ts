import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationStatus } from '../entities/application.entity'

export class CreateApplicationDto {
  @ApiProperty()  @IsString() opportunityId: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(1000) coverLetter?: string
}

export class UpdateApplicationStatusDto {
  @ApiProperty({ enum: ApplicationStatus })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) notes?: string
}
