import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudentProfile } from '../students/entities/student-profile.entity'
import { GraduateSurveyResponse } from './entities/graduate-survey-response.entity'
import { GraduatesController } from './graduates.controller'
import { GraduatesService } from './graduates.service'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentProfile, GraduateSurveyResponse]),
    NotificationsModule,
  ],
  controllers: [GraduatesController],
  providers: [GraduatesService],
})
export class GraduatesModule {}
