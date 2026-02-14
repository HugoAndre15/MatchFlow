import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createMockPrisma } from '../common/test/prisma-mock.helper';

// Mock bcrypt au niveau du module
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let prisma: any;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmailWithPassword: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  // Tests register()
  describe('register', () => {
    it('devrait créer un utilisateur et retourner un JWT', async () => {
      // Arrange
      const registerDto = { 
        email: 'test@test.com', 
        password: 'password123', 
        first_name: 'John', 
        last_name: 'Doe' 
      };
      const createdUser = { 
        id: 'user-1', 
        email: 'test@test.com', 
        first_name: 'John', 
        last_name: 'Doe',
      };
      
      jest.spyOn(usersService, 'create').mockResolvedValue(createdUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-jwt-token');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: createdUser,
      });
      expect(usersService.create).toHaveBeenCalledWith(registerDto);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: createdUser.id,
        email: createdUser.email,
      });
    });

    it('devrait propager les erreurs de création (ex: email déjà utilisé)', async () => {
      // Arrange
      const registerDto = { 
        email: 'existing@test.com', 
        password: 'password123', 
        first_name: 'John', 
        last_name: 'Doe' 
      };
      const prismaError = new Error('Unique constraint failed');
      
      jest.spyOn(usersService, 'create').mockRejectedValue(prismaError);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(prismaError);
    });
  });

  // Tests login()
  describe('login', () => {
    it('devrait retourner un JWT avec des identifiants valides', async () => {
      // Arrange
      const loginDto = { email: 'test@test.com', password: 'password123' };
      const userWithPassword = {
        id: 'user-1',
        email: 'test@test.com',
        password_hash: 'hashedPassword',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(usersService, 'findByEmailWithPassword').mockResolvedValue(userWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-jwt-token');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toHaveProperty('access_token', 'mock-jwt-token');
      expect(result.user).not.toHaveProperty('password_hash'); // Password doit être exclu
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    });

    it('devrait lancer UnauthorizedException si email inexistant', async () => {
      // Arrange
      jest.spyOn(usersService, 'findByEmailWithPassword').mockResolvedValue(null);

      // Act & Assert
      await expect(service.login({ email: 'wrong@test.com', password: 'password' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('devrait lancer UnauthorizedException si mot de passe incorrect', async () => {
      // Arrange
      const userWithPassword = { 
        id: 'user-1', 
        email: 'test@test.com', 
        password_hash: 'hashedPassword',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      jest.spyOn(usersService, 'findByEmailWithPassword').mockResolvedValue(userWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.login({ email: 'test@test.com', password: 'wrongpass' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('ne devrait PAS appeler jwtService.sign si authentification échoue', async () => {
      // Arrange
      const userWithPassword = { 
        id: 'user-1', 
        email: 'test@test.com', 
        password_hash: 'hashedPassword',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      jest.spyOn(usersService, 'findByEmailWithPassword').mockResolvedValue(userWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const jwtSignSpy = jest.spyOn(jwtService, 'sign');

      // Act & Assert
      await expect(service.login({ email: 'test@test.com', password: 'wrong' }))
        .rejects.toThrow();
      expect(jwtSignSpy).not.toHaveBeenCalled();
    });
  });

  // Tests validateUser()
  describe('validateUser', () => {
    it('devrait déléguer à usersService.findOne', async () => {
      // Arrange
      const user = { 
        id: 'user-1', 
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      // Act
      const result = await service.validateUser('user-1');

      // Assert
      expect(result).toEqual(user);
      expect(usersService.findOne).toHaveBeenCalledWith('user-1');
    });

    it('devrait retourner null si utilisateur non trouvé', async () => {
      // Arrange
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      // Act
      const result = await service.validateUser('invalid-id');

      // Assert
      expect(result).toBeNull();
    });
  });
});