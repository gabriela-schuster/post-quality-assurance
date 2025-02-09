import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersModule } from './users.module';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  afterAll(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('Should create a new user and return 201 status', async () => {
      const createUserDto = {
        fullName: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'password123',
      };

      const response = await controller.create(createUserDto);

      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('fullName', createUserDto.fullName);
      expect(response).toHaveProperty('email', createUserDto.email);
    });

    it('Should throw when fullName is missing', async () => {
      const invalidDto = {
        email: 'johndoe@gmail.com',
        password: 'password123',
      };

      expect(controller.create(invalidDto as any)).rejects.toThrow(
        new BadRequestException('fullName is required'),
      );
    });

    it('Should throw when email is missing', async () => {
      const invalidDto = {
        fullName: 'John Doe',
        password: 'password123',
      };

      await expect(controller.create(invalidDto as any)).rejects.toThrow(
        new BadRequestException('email is required'),
      );
    });

    it('Should throw when password is missing', async () => {
      const invalidDto = {
        fullName: 'John Doe',
        email: 'johndoe@gmail.com',
      };

      await expect(controller.create(invalidDto as any)).rejects.toThrow(
        new BadRequestException('password is required'),
      );
    });

    it('Should throw when email format is invalid', async () => {
      const invalidDto = {
        fullName: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(controller.create(invalidDto)).rejects.toThrow(
        new BadRequestException('email is invalid'),
      );
    });

    it('Should return 500 when repository layer fails', async () => {
      const createUserDto = {
        fullName: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'password123',
      };

      jest
        .spyOn(repository, 'createOne')
        .mockRejectedValueOnce(new Error('Failed to connect to database'));

      await expect(controller.create(createUserDto)).rejects.toThrow();
    });

    it('Should throw when no body is provided', async () => {
      await expect(controller.create({} as any)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('Should return an array of users and 200 status', async () => {
      const response = await controller.findAll();

      expect(Array.isArray(response)).toBe(true);
      response.forEach((user) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('fullName');
        expect(user).toHaveProperty('email');
      });
    });

    it('Should verify all user properties in findAll response', async () => {
      const response = await controller.findAll();

      response.forEach((user) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('fullName');
        expect(user).toHaveProperty('email');
        expect(typeof user.id).toBe('number');
        expect(typeof user.fullName).toBe('string');
        expect(typeof user.email).toBe('string');
        expect(typeof user.password).toBe('undefined'); // Password should not be exposed
      });
    });

    it('Should return empty array when no users exist', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([]);
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const response = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(response).toEqual([]);
      expect(Array.isArray(response)).toBe(true);
      expect(response).toHaveLength(0);
    });

    it('Should return 500 if repository layer throws an error', async () => {
      jest
        .spyOn(repository, 'findAll')
        .mockRejectedValueOnce(new Error('Failed to connect to database'));

      await expect(controller.findAll()).rejects.toThrow();
    });
  });
});
