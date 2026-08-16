import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CompanyProfile } from './entities/company-profile.entity'
import { IsString, IsOptional, MaxLength, IsUrl, ValidateIf } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateCompanyDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200) name?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) description?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) industry?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50) size?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(150) location?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(300)
  @ValidateIf((o) => !!o.website)
  @IsUrl({}, { message: 'Sitio web inválido' })
  website?: string
  @ApiPropertyOptional() @IsOptional() @IsString() logo?: string
  @ApiPropertyOptional() @IsOptional() @IsString() coverImage?: string
}

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyProfile)
    private readonly companiesRepo: Repository<CompanyProfile>,
  ) {}

  async findByUserId(userId: string): Promise<CompanyProfile> {
    const profile = await this.companiesRepo.findOne({
      where: { userId },
      relations: ['opportunities'],
    })
    if (!profile) throw new NotFoundException('Perfil de empresa no encontrado')
    return profile
  }

  async findById(id: string): Promise<CompanyProfile> {
    const profile = await this.companiesRepo.findOne({ where: { id } })
    if (!profile) throw new NotFoundException('Empresa no encontrada')
    return profile
  }

  async update(userId: string, dto: UpdateCompanyDto): Promise<CompanyProfile> {
    const profile = await this.findByUserId(userId)
    Object.assign(profile, dto)
    return this.companiesRepo.save(profile)
  }
}
