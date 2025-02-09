import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersRepository {
    createOne(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
}
