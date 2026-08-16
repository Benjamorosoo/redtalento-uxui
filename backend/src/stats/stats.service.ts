import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, UserRole } from '../users/entities/user.entity'
import { Application, ApplicationStatus } from '../applications/entities/application.entity'

export interface PublicStats {
  studentsCount: number
  companiesCount: number
  schoolsCount: number
  employabilityRate: number
}

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Application)
    private readonly applicationsRepo: Repository<Application>,
  ) {}

  async getPublicStats(): Promise<PublicStats> {
    const [studentsCount, companiesCount, schoolsCount, acceptedStudents] = await Promise.all([
      this.usersRepo.count({ where: { role: UserRole.STUDENT } }),
      this.usersRepo.count({ where: { role: UserRole.EMPRESA } }),
      this.usersRepo.count({ where: { role: UserRole.COLEGIO } }),
      this.applicationsRepo
        .createQueryBuilder('a')
        .select('COUNT(DISTINCT a.studentId)', 'count')
        .where('a.status = :status', { status: ApplicationStatus.ACEPTADO })
        .getRawOne<{ count: string }>(),
    ])

    const employabilityRate = studentsCount > 0
      ? Math.round((Number(acceptedStudents?.count ?? 0) / studentsCount) * 100)
      : 0

    return { studentsCount, companiesCount, schoolsCount, employabilityRate }
  }
}
