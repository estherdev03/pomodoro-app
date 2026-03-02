import { Module } from '@nestjs/common';
import { PomodoroSessionController } from './pomodoro-session.controller';
import { PomodoroSessionService } from './pomodoro-session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PomodoroSession } from './pomodoro-session';

@Module({
  imports: [TypeOrmModule.forFeature([PomodoroSession])],
  controllers: [PomodoroSessionController],
  providers: [PomodoroSessionService],
})
export class PomodoroSessionModule {}
