import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StudentProfile } from '../students/entities/student-profile.entity'
import { GraduateSurveyResponse } from './entities/graduate-survey-response.entity'
import { NotificationsService } from '../notifications/notifications.service'
import { NotificationType } from '../notifications/entities/notification.entity'
import { SubmitGraduateSurveyDto } from './dto/graduate.dto'

const DEFAULT_QUESTIONS = [
  '¿Estás trabajando?',
  '¿Trabajas en tu especialidad?',
  '¿Cuánto tardaste en encontrar trabajo?',
]

@Injectable()
export class GraduatesService {
  constructor(
    @InjectRepository(StudentProfile)
    private readonly studentsRepo: Repository<StudentProfile>,
    @InjectRepository(GraduateSurveyResponse)
    private readonly responsesRepo: Repository<GraduateSurveyResponse>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async setGraduateStatus(schoolUserId: string, studentId: string, isGraduate: boolean): Promise<StudentProfile> {
    const student = await this.studentsRepo.findOne({ where: { id: studentId, schoolUserId } })
    if (!student) throw new NotFoundException('Estudiante no encontrado')
    student.isGraduate = isGraduate
    return this.studentsRepo.save(student)
  }

  /** Sends the follow-up survey as an in-app notification to every student this school marked as graduate. */
  async sendSurvey(schoolUserId: string, questions?: string[]): Promise<{ sent: number }> {
    const graduates = await this.studentsRepo.find({
      where: { schoolUserId, isGraduate: true },
    })

    const finalQuestions = questions?.filter(q => q.trim()).length ? questions : DEFAULT_QUESTIONS
    const body = `Tu colegio quiere saber cómo te está yendo tras egresar:\n${finalQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`

    for (const student of graduates) {
      await this.notificationsService.create({
        userId: student.userId,
        type: NotificationType.GRADUATE_SURVEY,
        title: 'Encuesta de seguimiento',
        body,
        link: '/student/encuesta-egresado',
      })
    }

    return { sent: graduates.length }
  }

  async getMyResponse(userId: string): Promise<GraduateSurveyResponse | null> {
    const student = await this.studentsRepo.findOne({ where: { userId } })
    if (!student) return null
    return this.responsesRepo.findOne({ where: { studentId: student.id } })
  }

  async submitResponse(userId: string, dto: SubmitGraduateSurveyDto): Promise<GraduateSurveyResponse> {
    const student = await this.studentsRepo.findOne({ where: { userId } })
    if (!student) throw new NotFoundException('Perfil de estudiante no encontrado')

    let response = await this.responsesRepo.findOne({ where: { studentId: student.id } })
    if (!response) response = this.responsesRepo.create({ studentId: student.id })

    response.isWorking = dto.isWorking
    response.worksInSpecialty = dto.isWorking ? dto.worksInSpecialty : undefined
    response.timeToFindJob = dto.timeToFindJob

    return this.responsesRepo.save(response)
  }
}
