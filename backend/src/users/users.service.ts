import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.fullName) {
      throw new BadRequestException('fullName is required');
    }

    if (!createUserDto.email) {
      throw new BadRequestException('email is required');
    }

    if (createUserDto.email.includes('@') === false) {
      throw new BadRequestException('email is invalid');
    }

    if (!createUserDto.password) {
      throw new BadRequestException('password is required');
    }

    return this.usersRepository.createOne(createUserDto);
  }

  async findAll() {
    return this.usersRepository.findAll();
  }
}
