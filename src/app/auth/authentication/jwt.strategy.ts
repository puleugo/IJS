import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@app/user/user.service';
import {
  JwtDecodedData,
  JwtSubjectType,
} from '@infrastructure/types/jwt.types';
import { UserProfileResponse } from '@app/user/dto/user-profile.response';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('APP_SECRET', ''),
      ignoreExpiration: false,
    });
  }

  async validate(data: JwtDecodedData): Promise<UserProfileResponse> {
    if (data.sub !== JwtSubjectType.ACCESS) {
      throw new UnauthorizedException();
    }

    console.log(data);
    const user = await this.userService.findUserById(data.user_id, {
      // relations: ['profile'],
    });
    console.log(user);
    return new UserProfileResponse(user);
  }
}
