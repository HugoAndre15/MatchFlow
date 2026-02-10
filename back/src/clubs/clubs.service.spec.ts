import { Test, TestingModule } from '@nestjs/testing';
import { ClubsService } from './clubs.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createMockPrisma } from '../common/test/prisma-mock.helper';
import { ForbiddenException, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { club_role } from '@prisma/client';

describe('ClubsService', () => {
  let service: ClubsService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ClubsService>(ClubsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== CREATE ====================
  describe('create', () => {
    it('devrait créer un club et ajouter le créateur comme PRESIDENT', async () => {
      // Arrange
      const createDto = { name: 'FC Test' };
      const userId = 'user-1';
      const club = {
        id: 'club-1',
        name: 'FC Test',
        created_at: new Date(),
        updated_at: new Date(),
      };

      prisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          club: {
            create: jest.fn().mockResolvedValue(club),
          },
          clubUser: {
            create: jest.fn().mockResolvedValue({
              club_id: club.id,
              user_id: userId,
              role: club_role.PRESIDENT,
            }),
          },
        });
      });

      // Act
      const result = await service.create(createDto, userId);

      // Assert
      expect(result).toEqual(club);
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  // ==================== FIND ALL ====================
  describe('findAll', () => {
    it('devrait retourner les clubs dont l\'utilisateur est membre avec pagination', async () => {
      // Arrange
      const userId = 'user-1';
      const clubUsers = [
        {
          club: {
            id: 'club-1',
            name: 'FC Test 1',
            created_at: new Date(),
            updated_at: new Date(),
            _count: { teams: 2, clubUsers: 5 },
          },
          role: club_role.PRESIDENT,
        },
        {
          club: {
            id: 'club-2',
            name: 'FC Test 2',
            created_at: new Date(),
            updated_at: new Date(),
            _count: { teams: 1, clubUsers: 3 },
          },
          role: club_role.COACH,
        },
      ];

      prisma.clubUser.count.mockResolvedValue(2);
      prisma.clubUser.findMany.mockResolvedValue(clubUsers);

      // Act
      const result = await service.findAll(userId);

      // Assert
      expect(result.data).toHaveLength(2);
      expect(result.data[0].myRole).toBe(club_role.PRESIDENT);
      expect(result.meta.total).toBe(2);
    });

    it('devrait filtrer par recherche de nom', async () => {
      // Arrange
      const userId = 'user-1';
      prisma.clubUser.count.mockResolvedValue(1);
      prisma.clubUser.findMany.mockResolvedValue([]);

      // Act
      await service.findAll(userId, { search: 'FC' });

      // Assert
      expect(prisma.clubUser.count).toHaveBeenCalledWith({
        where: {
          user_id: userId,
          club: {
            name: { contains: 'FC', mode: 'insensitive' },
          },
        },
      });
    });
  });

  // ==================== FIND ONE ====================
  describe('findOne', () => {
    it('devrait retourner un club avec les détails complets', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';
      const club = {
        id: clubId,
        name: 'FC Test',
        created_at: new Date(),
        updated_at: new Date(),
        clubUsers: [
          {
            user_id: userId,
            role: club_role.PRESIDENT,
            user: {
              id: userId,
              email: 'test@test.com',
              first_name: 'John',
              last_name: 'Doe',
            },
          },
        ],
        teams: [],
      };

      prisma.clubUser.findFirst.mockResolvedValue({
        club_id: clubId,
        user_id: userId,
        role: club_role.PRESIDENT,
      });
      prisma.club.findUnique.mockResolvedValue(club);

      // Act
      const result = await service.findOne(clubId, userId);

      // Assert
      expect(result.id).toBe(clubId);
      expect(result.myRole).toBe(club_role.PRESIDENT);
    });

    it('devrait lancer ForbiddenException si non membre', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('club-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });

    it('devrait lancer NotFoundException si club inexistant', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.COACH });
      prisma.club.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('invalid', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== UPDATE ====================
  describe('update', () => {
    it('devrait permettre au PRESIDENT de modifier le club', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';
      const updateDto = { name: 'Nouveau nom' };
      const updatedClub = { id: clubId, name: 'Nouveau nom', created_at: new Date(), updated_at: new Date() };

      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT });
      prisma.club.findUnique.mockResolvedValue({ id: clubId, name: 'Ancien nom', created_at: new Date(), updated_at: new Date() });
      prisma.club.update.mockResolvedValue(updatedClub);

      // Act
      const result = await service.update(clubId, userId, updateDto);

      // Assert
      expect(result.name).toBe('Nouveau nom');
      expect(prisma.club.update).toHaveBeenCalledWith({
        where: { id: clubId },
        data: updateDto,
      });
    });

    it('devrait refuser la modification si non PRESIDENT', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.COACH });

      // Act & Assert
      await expect(service.update('club-1', 'user-1', { name: 'Test' })).rejects.toThrow(ForbiddenException);
    });
  });

  // ==================== REMOVE ====================
  describe('remove', () => {
    it('devrait permettre au PRESIDENT de supprimer le club', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';
      const club = { id: clubId, name: 'FC Test', created_at: new Date(), updated_at: new Date() };

      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT });
      prisma.club.findUnique.mockResolvedValue(club);
      prisma.club.delete.mockResolvedValue(club);

      // Act
      const result = await service.remove(clubId, userId);

      // Assert
      expect(result).toEqual(club);
      expect(prisma.club.delete).toHaveBeenCalledWith({ where: { id: clubId } });
    });

    it('devrait refuser la suppression si non PRESIDENT', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.RESPONSABLE });

      // Act & Assert
      await expect(service.remove('club-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  // ==================== GET MEMBERS ====================
  describe('getMembers', () => {
    it('devrait retourner la liste des membres du club', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';
      const members = [
        {
          club_id: clubId,
          user_id: 'user-1',
          role: club_role.PRESIDENT,
          user: { id: 'user-1', email: 'pres@test.com', first_name: 'John', last_name: 'Doe' },
        },
        {
          club_id: clubId,
          user_id: 'user-2',
          role: club_role.COACH,
          user: { id: 'user-2', email: 'coach@test.com', first_name: 'Jane', last_name: 'Smith' },
        },
      ];

      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT });
      prisma.clubUser.findMany.mockResolvedValue(members);

      // Act
      const result = await service.getMembers(clubId, userId);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].role).toBe(club_role.PRESIDENT);
    });

    it('devrait refuser l\'accès si non membre', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getMembers('club-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  // ==================== ADD MEMBER ====================
  describe('addMember', () => {
    it('devrait permettre au PRESIDENT d\'ajouter un membre', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';
      const addDto = { userId: 'user-2', role: club_role.COACH };
      const newMember = {
        club_id: clubId,
        user_id: 'user-2',
        role: club_role.COACH,
        user: { id: 'user-2', email: 'new@test.com', first_name: 'New', last_name: 'Member' },
      };

      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT });
      prisma.club.findUnique.mockResolvedValue({ id: clubId, name: 'FC Test', created_at: new Date(), updated_at: new Date() });
      prisma.user.findUnique.mockResolvedValue({ id: 'user-2', email: 'new@test.com', password_hash: 'hash', first_name: 'New', last_name: 'Member', created_at: new Date(), updated_at: new Date() });
      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.PRESIDENT }).mockResolvedValueOnce(null);
      prisma.clubUser.create.mockResolvedValue(newMember);

      // Act
      const result = await service.addMember(clubId, userId, addDto);

      // Assert
      expect(result.user_id).toBe('user-2');
      expect(result.role).toBe(club_role.COACH);
    });

    it('devrait permettre au RESPONSABLE d\'ajouter un membre', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';
      const addDto = { userId: 'user-2', role: club_role.COACH };

      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.RESPONSABLE });
      prisma.club.findUnique.mockResolvedValue({ id: clubId, name: 'FC Test', created_at: new Date(), updated_at: new Date() });
      prisma.user.findUnique.mockResolvedValue({ id: 'user-2', email: 'new@test.com', password_hash: 'hash', first_name: 'New', last_name: 'Member', created_at: new Date(), updated_at: new Date() });
      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.RESPONSABLE }).mockResolvedValueOnce(null);
      prisma.clubUser.create.mockResolvedValue({
        club_id: clubId,
        user_id: 'user-2',
        role: club_role.COACH,
        user: { id: 'user-2', email: 'new@test.com', first_name: 'New', last_name: 'Member' },
      });

      // Act
      const result = await service.addMember(clubId, userId, addDto);

      // Assert
      expect(result).toBeDefined();
    });

    it('devrait refuser si l\'utilisateur est COACH', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.COACH });

      // Act & Assert
      await expect(service.addMember('club-1', 'user-1', { userId: 'user-2', role: club_role.COACH })).rejects.toThrow(ForbiddenException);
    });

    it('devrait refuser d\'ajouter un 2ème PRESIDENT', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';
      const addDto = { userId: 'user-2', role: club_role.PRESIDENT };

      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.PRESIDENT });
      prisma.club.findUnique.mockResolvedValue({ id: clubId, name: 'FC Test', created_at: new Date(), updated_at: new Date() });
      prisma.user.findUnique.mockResolvedValue({ id: 'user-2', email: 'new@test.com', password_hash: 'hash', first_name: 'New', last_name: 'Member', created_at: new Date(), updated_at: new Date() });
      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.PRESIDENT }).mockResolvedValueOnce({ role: club_role.PRESIDENT }); // Un président existe déjà

      // Act & Assert
      await expect(service.addMember(clubId, userId, addDto)).rejects.toThrow(BadRequestException);
    });

    it('devrait refuser si l\'utilisateur est déjà membre', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';
      const addDto = { userId: 'user-2', role: club_role.COACH };

      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.PRESIDENT });
      prisma.club.findUnique.mockResolvedValue({ id: clubId, name: 'FC Test', created_at: new Date(), updated_at: new Date() });
      prisma.user.findUnique.mockResolvedValue({ id: 'user-2', email: 'new@test.com', password_hash: 'hash', first_name: 'New', last_name: 'Member', created_at: new Date(), updated_at: new Date() });
      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.PRESIDENT }).mockResolvedValueOnce(null).mockResolvedValueOnce({ role: club_role.COACH }); // Déjà membre

      // Act & Assert
      await expect(service.addMember(clubId, userId, addDto)).rejects.toThrow(ConflictException);
    });
  });

  // ==================== REMOVE MEMBER ====================
  describe('removeMember', () => {
    it('devrait permettre au PRESIDENT de retirer un COACH', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';
      const memberToRemove = 'user-2';

      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.PRESIDENT }).mockResolvedValueOnce({ role: club_role.COACH });
      prisma.clubUser.deleteMany.mockResolvedValue({ count: 1 });

      // Act
      const result = await service.removeMember(clubId, userId, memberToRemove);

      // Assert
      expect(result.message).toBe('Membre retiré avec succès');
    });

    it('devrait permettre au RESPONSABLE de retirer un COACH', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';
      const memberToRemove = 'user-2';

      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.RESPONSABLE }).mockResolvedValueOnce({ role: club_role.COACH });
      prisma.clubUser.deleteMany.mockResolvedValue({ count: 1 });

      // Act
      const result = await service.removeMember(clubId, userId, memberToRemove);

      // Assert
      expect(result.message).toBe('Membre retiré avec succès');
    });

    it('devrait refuser de retirer le PRESIDENT', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.PRESIDENT }).mockResolvedValueOnce({ role: club_role.PRESIDENT });

      // Act & Assert
      await expect(service.removeMember('club-1', 'user-1', 'user-2')).rejects.toThrow(BadRequestException);
    });

    it('devrait refuser au RESPONSABLE de retirer un autre RESPONSABLE', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.RESPONSABLE }).mockResolvedValueOnce({ role: club_role.RESPONSABLE });

      // Act & Assert
      await expect(service.removeMember('club-1', 'user-1', 'user-2')).rejects.toThrow(ForbiddenException);
    });
  });

  // ==================== UPDATE MEMBER ROLE ====================
  describe('updateMemberRole', () => {
    it('devrait permettre au PRESIDENT de changer un COACH en RESPONSABLE', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';
      const memberToUpdate = 'user-2';
      const updateDto = { role: club_role.RESPONSABLE };

      // getUserRoleInClub: user-1 est PRESIDENT
      // findFirst pour vérifier que user-2 existe avec role COACH  
      // findFirst après update pour retourner le nouveau rôle
      prisma.clubUser.findFirst
        .mockResolvedValueOnce({ role: club_role.PRESIDENT } as any) // getUserRoleInClub
        .mockResolvedValueOnce({ role: club_role.COACH } as any) // membre existe
        .mockResolvedValueOnce({ // après update
          club_id: clubId,
          user_id: memberToUpdate,
          role: club_role.RESPONSABLE,
          user: { id: memberToUpdate, email: 'test@test.com', first_name: 'Test', last_name: 'User' },
        } as any);
      prisma.clubUser.updateMany.mockResolvedValue({ count: 1 });

      // Act
      const result:any = await service.updateMemberRole(clubId, userId, memberToUpdate, updateDto);

      // Assert
      expect(result.role).toBe(club_role.RESPONSABLE);
    });

    it('devrait permettre au RESPONSABLE de changer un COACH', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';
      const memberToUpdate = 'user-2';
      const updateDto = { role: club_role.COACH };

      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.RESPONSABLE }).mockResolvedValueOnce({ role: club_role.COACH });
      prisma.clubUser.updateMany.mockResolvedValue({ count: 1 });
      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.RESPONSABLE }).mockResolvedValueOnce({ role: club_role.COACH }).mockResolvedValueOnce({
        club_id: clubId,
        user_id: memberToUpdate,
        role: club_role.COACH,
        user: { id: memberToUpdate, email: 'test@test.com', first_name: 'Test', last_name: 'User' },
      });

      // Act
      const result = await service.updateMemberRole(clubId, userId, memberToUpdate, updateDto);

      // Assert
      expect(result).toBeDefined();
    });

    it('devrait refuser au RESPONSABLE de nommer un RESPONSABLE', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.RESPONSABLE });

      // Act & Assert
      await expect(service.updateMemberRole('club-1', 'user-1', 'user-2', { role: club_role.RESPONSABLE })).rejects.toThrow(ForbiddenException);
    });

    it('devrait refuser de créer un 2ème PRESIDENT', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT } as any);

      // Act & Assert
      // Le PRESIDENT ne peut pas définir un autre PRESIDENT car canChangeRole() retourne false
      // Cela lance ForbiddenException avant d'atteindre le code qui vérifie le 2ème PRESIDENT
      await expect(service.updateMemberRole('club-1', 'user-1', 'user-2', { role: club_role.PRESIDENT })).rejects.toThrow(ForbiddenException);
    });

    it('devrait refuser de changer le rôle du PRESIDENT', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.PRESIDENT }).mockResolvedValueOnce({ role: club_role.PRESIDENT });

      // Act & Assert
      await expect(service.updateMemberRole('club-1', 'user-1', 'user-2', { role: club_role.RESPONSABLE })).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== TRANSFER PRESIDENCY ====================
  describe('transferPresidency', () => {
    it('devrait transférer la présidence et l\'ancien président devient RESPONSABLE', async () => {
      // Arrange
      const clubId = 'club-1';
      const currentPresidentId = 'user-1';
      const newPresidentId = 'user-2';
      const transferDto = { new_president_user_id: newPresidentId };

      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.PRESIDENT }).mockResolvedValueOnce({ role: club_role.COACH });

      prisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          clubUser: {
            updateMany: jest.fn().mockResolvedValue({ count: 1 }),
          },
        });
      });

      // Act
      const result = await service.transferPresidency(clubId, currentPresidentId, transferDto);

      // Assert
      expect(result.message).toBe('Présidence transférée avec succès');
    });

    it('devrait refuser si l\'utilisateur n\'est pas PRESIDENT', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.RESPONSABLE });

      // Act & Assert
      await expect(service.transferPresidency('club-1', 'user-1', { new_president_user_id: 'user-2' })).rejects.toThrow(ForbiddenException);
    });

    it('devrait refuser si le nouveau président n\'est pas membre', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValueOnce({ role: club_role.PRESIDENT }).mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.transferPresidency('club-1', 'user-1', { new_president_user_id: 'user-2' })).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== LEAVE CLUB ====================
  describe('leaveClub', () => {
    it('devrait permettre à un COACH de quitter le club', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';

      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.COACH });
      prisma.clubUser.deleteMany.mockResolvedValue({ count: 1 });

      // Act
      const result = await service.leaveClub(clubId, userId);

      // Assert
      expect(result.message).toBe('Vous avez quitté le club avec succès');
    });

    it('devrait permettre à un RESPONSABLE de quitter le club', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';

      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.RESPONSABLE });
      prisma.clubUser.deleteMany.mockResolvedValue({ count: 1 });

      // Act
      const result = await service.leaveClub(clubId, userId);

      // Assert
      expect(result.message).toBe('Vous avez quitté le club avec succès');
    });

    it('devrait refuser au PRESIDENT de quitter sans transférer', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT });

      // Act & Assert
      await expect(service.leaveClub('club-1', 'user-1')).rejects.toThrow(BadRequestException);
    });

    it('devrait lancer NotFoundException si non membre', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.leaveClub('club-1', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });
});
