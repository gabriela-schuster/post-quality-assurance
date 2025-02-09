import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AppController } from './app.controller';

@Module({
  imports: [UsersModule],
  controllers: [UsersController, AppController],
  providers: [UsersService],
})
export class AppModule {}
