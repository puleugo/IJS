import { PassportStrategy, } from '@nestjs/passport';
import { ExtractJwt, Strategy, } from 'passport-jwt';
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { UserService, } from '@app/user/user.service';
import { JwtDecodedData, JwtSubjectType, } from '@common/type/jwt.type';
import { UserProfileResponse, } from '@app/user/dto/user-profile.response';
import { UserTokenInValidate, } from '@app/user/exception/user.error';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService
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

		const user = await this.userService.findById(data.user_id, { relations: { major: true, }, });
		if (!user) throw new UserTokenInValidate();

		return new UserProfileResponse({
			...user,
			majorName: user.major?.name,
		});
	}
}
