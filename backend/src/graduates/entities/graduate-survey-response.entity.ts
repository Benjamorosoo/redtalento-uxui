import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm'

@Entity('graduate_survey_responses')
export class GraduateSurveyResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** StudentProfile.id — one response per student, upserted on resubmission */
  @Column({ unique: true })
  studentId: string

  @Column()
  isWorking: boolean

  @Column({ nullable: true })
  worksInSpecialty?: boolean

  @Column({ nullable: true })
  timeToFindJob?: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
