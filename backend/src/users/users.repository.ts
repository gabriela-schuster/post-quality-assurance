import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  async createOne(createUserDto: CreateUserDto): Promise<User> {
    return {
      id: 1,
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      password: createUserDto.password,
    };
  }

  async findAll(): Promise<User[]> {
    return [
      {
        id: 1,
        fullName: 'John Doe',
        email: 'johndoe@gmail.com',
      },
      {
        id: 2,
        fullName: 'Jane Doe',
        email: 'janedoe@gmail.com',
      },
    ] as any; // This is a type hack to emit password
  }
}
