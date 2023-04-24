import { Module } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { UserController } from '@app/user/user.controller';

@Module({
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
