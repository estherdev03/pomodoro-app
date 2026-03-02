import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PomodoroSessionService } from './pomodoro-session.service';
import { AuthGuard } from '@nestjs/passport';
import { StartSessionDTO } from './dto/start-session.dto';

@Controller('pomodoro-session')
export class PomodoroSessionController {
  constructor(private readonly pomodoroService: PomodoroSessionService) {}
  @Post('start')
  @UseGuards(AuthGuard('jwt'))
  async startSession(
    @Body() dto: StartSessionDTO,
    @Req() req: Request & { user: { id: number } },
  ) {
    return await this.pomodoroService.start(dto, req.user.id);
  }

  @Patch(':id/end')
  @UseGuards(AuthGuard('jwt'))
  async endSession(
    @Param('id', ParseIntPipe) sessionId: number,
    @Req() req: Request & { user: { id: number } },
  ) {
    return await this.pomodoroService.end(sessionId, req.user.id);
  }

  @Get('current')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentSession(@Req() req: Request & { user: { id: number } }) {
    return await this.pomodoroService.getCurrentSession(req.user.id);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  async getSessionHistory(
    @Req() req: Request & { user: { id: number } },
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return await this.pomodoroService.getSessionHistory(req.user.id, limitNum);
  }
}
