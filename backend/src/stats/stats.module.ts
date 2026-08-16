import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'
import { Application } from '../applications/entities/application.entity'
import { StatsController } from './stats.controller'
import { StatsService } from './stats.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Application])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
