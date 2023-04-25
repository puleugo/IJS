import { Module } from '@nestjs/common';
import { UserModule } from '@app/user/user.module';
import { AuthenticationController } from '@app/auth/authentication/authentication.controller';
import { AuthenticationService } from '@app/auth/authentication/authentication.service';

@Module({
  imports: [UserModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
