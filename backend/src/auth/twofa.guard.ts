import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class TwoFaGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const pendingUser = request.cookies['pending_user'];
    if (pendingUser) {
      request.user = { id: pendingUser, twoFAEnabled: true };
    }
    if (!request.user) {
      throw new UnauthorizedException('No user found.');
    }
    if (!request.user.twoFAEnabled) {
      throw new UnauthorizedException('2FA is not enabled for this user.');
    }
    return true;
  }
}
