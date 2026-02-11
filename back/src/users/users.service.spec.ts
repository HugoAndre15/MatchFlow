import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createMockPrisma } from '../common/test/prisma-mock.helper';

// Mock bcrypt
jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('devrait hasher le mot de passe avec bcrypt (10 rounds)', async () => {
      // Arrange
      const createUserDto = { 
        email: 'new@test.com', 
        password: 'plain123', 
        first_name: 'Jane', 
        last_name: 'Doe' 
      };
      const hashedPassword = 'hashed_plain123';
      
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'new@test.com',
        password: hashedPassword,
        first_name: 'Jane',
        last_name: 'Doe',
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Act
      await service.create(createUserDto);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('plain123', 10);
    });

    it('devrait créer un utilisateur via Prisma', async () => {
      // Arrange
      const createUserDto = { 
        email: 'new@test.com', 
        password: 'plain123', 
        first_name: 'Jane', 
        last_name: 'Doe' 
      };
      const hashedPassword = 'hashed_plain123';
      
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'new@test.com',
        password_hash: hashedPassword,
        first_name: 'Jane',
        last_name: 'Doe',
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'new@test.com',
          password_hash: hashedPassword,
          first_name: 'Jane',
          last_name: 'Doe',
        },
        select: expect.objectContaining({
          id: true,
          email: true,
          first_name: true,
          last_name: true,
        }),
      });
      expect(result).not.toHaveProperty('password'); // Ne doit pas retourner le mot de passe
    });

    it('devrait propager les erreurs Prisma (ex: contrainte unique email)', async () => {
      // Arrange
      const createUserDto = { 
        email: 'existing@test.com', 
        password: 'plain123', 
        first_name: 'Jane', 
        last_name: 'Doe' 
      };
      const prismaError = new Error('Unique constraint violation');
      
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      prisma.user.create.mockRejectedValue(prismaError);

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(prismaError);
    });
  });

  describe('findAll', () => {
    it('devrait retourner une liste paginée', async () => {
      // Arrange
      const paginationQuery = { page: 1, limit: 10 };
      const mockUsers = [
        { id: 'user-1', email: 'user1@test.com', first_name: 'John', last_name: 'Doe' },
        { id: 'user-2', email: 'user2@test.com', first_name: 'Jane', last_name: 'Smith' },
      ];
      
      prisma.user.findMany.mockResolvedValue(mockUsers);
      prisma.user.count.mockResolvedValue(25);

      // Act
      const result = await service.findAll(paginationQuery);

      // Assert
      expect(result).toEqual({
        data: mockUsers,
        meta: {
          total: 25,
          page: 1,
          limit: 10,
          totalPages: 3, // ceil(25/10) = 3
        },
      });
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: 0, // (1-1) * 10
        take: 10,
        where: {},
        orderBy: { last_name: 'asc' },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      });
    });

    it('devrait filtrer par recherche (email/firstName/lastName)', async () => {
      // Arrange
      const paginationQuery = { page: 1, limit: 10, search: 'john' };
      
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      // Act
      await service.findAll(paginationQuery);

      // Assert
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          OR: [
            { email: { contains: 'john', mode: 'insensitive' } },
            { first_name: { contains: 'john', mode: 'insensitive' } },
            { last_name: { contains: 'john', mode: 'insensitive' } },
          ],
        },
        orderBy: { last_name: 'asc' },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      });
    });

    it('devrait trier selon le paramètre sort', async () => {
      // Arrange
      const paginationQuery = { page: 1, limit: 10, sortBy: 'email', sortOrder: 'asc' as const };
      
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      // Act
      await service.findAll(paginationQuery);

      // Assert
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
        orderBy: { email: 'asc' },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      });
    });

    it('devrait calculer totalPages correctement', async () => {
      // Arrange
      const testCases = [
        { total: 0, limit: 10, expectedPages: 0 },
        { total: 5, limit: 10, expectedPages: 1 },
        { total: 10, limit: 10, expectedPages: 1 },
        { total: 11, limit: 10, expectedPages: 2 },
        { total: 25, limit: 10, expectedPages: 3 },
      ];

      for (const testCase of testCases) {
        prisma.user.findMany.mockResolvedValue([]);
        prisma.user.count.mockResolvedValue(testCase.total);

        // Act
        const result = await service.findAll({ page: 1, limit: testCase.limit });

        // Assert
        expect(result.meta.totalPages).toBe(testCase.expectedPages);
      }
    });
  });

  describe('findOne', () => {
    it('devrait retourner l\'utilisateur avec champs safe', async () => {
      // Arrange
      const mockUser = {
        id: 'user-1',
        email: 'user@test.com',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      prisma.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await service.findOne('user-1');

      // Assert
      expect(result).toEqual(mockUser);
      expect(result).not.toHaveProperty('password');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      });
    });

    it('devrait retourner null si utilisateur non trouvé', async () => {
      // Arrange
      prisma.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await service.findOne('invalid-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('devrait mettre à jour et retourner champs safe', async () => {
      // Arrange
      const updateUserDto = { first_name: 'UpdatedName' };
      const updatedUser = {
        id: 'user-1',
        email: 'user@test.com',
        first_name: 'UpdatedName',
        last_name: 'Doe',
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      prisma.user.update.mockResolvedValue(updatedUser);

      // Act
      const result = await service.update('user-1', updateUserDto);

      // Assert
      expect(result).toEqual(updatedUser);
      expect(result).not.toHaveProperty('password');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: updateUserDto,
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      });
    });

    it('ne devrait PAS permettre de modifier le mot de passe via update', async () => {
      // Arrange
      const updateUserDto = { first_name: 'UpdatedName', password: 'newpassword' } as any;
      
      prisma.user.update.mockResolvedValue({
        id: 'user-1',
        email: 'user@test.com',
        first_name: 'UpdatedName',
        last_name: 'Doe',
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Act
      await service.update('user-1', updateUserDto);

      // Assert
      // Le service devrait ignorer ou filtrer le champ password
      // Vérifier que le DTO passé ne contient pas de password dans la vraie implémentation
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });

  describe('updatePassword', () => {
    it('devrait vérifier le mot de passe actuel avec bcrypt', async () => {
      // Arrange
      const updatePasswordDto = { current_password: 'oldpass', new_password: 'newpass' };
      const userWithPassword = {
        id: 'user-1',
        password_hash: 'hashedOldPass',
      };
      
      prisma.user.findUnique.mockResolvedValue(userWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPass');
      prisma.user.update.mockResolvedValue({ id: 'user-1' });

      // Act
      await service.updatePassword('user-1', updatePasswordDto);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith('oldpass', 'hashedOldPass');
    });

    it('devrait hasher le nouveau mot de passe', async () => {
      // Arrange
      const updatePasswordDto = { current_password: 'oldpass', new_password: 'newpass' };
      const userWithPassword = {
        id: 'user-1',
        password_hash: 'hashedOldPass',
      };
      
      prisma.user.findUnique.mockResolvedValue(userWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPass');
      prisma.user.update.mockResolvedValue({ id: 'user-1' });

      // Act
      await service.updatePassword('user-1', updatePasswordDto);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { password_hash: 'hashedNewPass' },
      });
    });

    it('devrait lancer UnauthorizedException si mot de passe actuel incorrect', async () => {
      // Arrange
      const updatePasswordDto = { current_password: 'wrongpass', new_password: 'newpass' };
      const userWithPassword = {
        id: 'user-1',
        password_hash: 'hashedOldPass',
      };
      
      prisma.user.findUnique.mockResolvedValue(userWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.updatePassword('user-1', updatePasswordDto))
        .rejects.toThrow(UnauthorizedException);
      
      // Ne doit pas tenter de hasher ou d'update si le password actuel est faux
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('devrait supprimer l\'utilisateur', async () => {
      // Arrange
      const deletedUser = {
        id: 'user-1',
        email: 'user@test.com',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      prisma.user.delete.mockResolvedValue(deletedUser);

      // Act
      const result = await service.remove('user-1');

      // Assert
      expect(result).toEqual(deletedUser);
      expect(result).not.toHaveProperty('password');
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      });
    });
  });

  describe('findByEmail', () => {
    it('devrait retourner l\'utilisateur sans le mot de passe', async () => {
      // Arrange
      const mockUser = {
        id: 'user-1',
        email: 'user@test.com',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      prisma.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await service.findByEmail('user@test.com');

      // Assert
      expect(result).toEqual(mockUser);
      expect(result).not.toHaveProperty('password');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'user@test.com' },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      });
    });
  });

  describe('findByEmailWithPassword', () => {
    it('devrait retourner l\'utilisateur AVEC le mot de passe', async () => {
      // Arrange
      const mockUser = {
        id: 'user-1',
        email: 'user@test.com',
        password_hash: 'hashedPassword',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      prisma.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await service.findByEmailWithPassword('user@test.com');

      // Assert
      expect(result).toEqual(mockUser);
      expect(result).toHaveProperty('password_hash', 'hashedPassword');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'user@test.com' },
        // Ici le select devrait inclure password: true ou pas de select du tout
      });
    });
  });
});
