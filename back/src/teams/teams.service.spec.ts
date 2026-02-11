import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createMockPrisma } from '../common/test/prisma-mock.helper';
import { ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { club_role, team_role, match_event_type, match_location, match_status } from '@prisma/client';

describe('TeamsService', () => {
  let service: TeamsService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== CREATE ====================
  describe('create', () => {
    it('devrait créer une team et ajouter le créateur comme COACH', async () => {
      // Arrange
      const createDto = {
        name: 'U19 Garçons',
        category: 'U19',
        club_id: 'club-1',
      };
      const userId = 'user-1';
      const club = { id: 'club-1', name: 'FC Test', created_at: new Date(), updated_at: new Date() };
      const team = {
        id: 'team-1',
        name: 'U19 Garçons',
        category: 'U19',
        club_id: 'club-1',
        created_at: new Date(),
        updated_at: new Date(),
      };

      prisma.club.findUnique.mockResolvedValue(club);
      prisma.clubUser.findFirst.mockResolvedValue({ club_id: 'club-1', user_id: userId, role: club_role.PRESIDENT });

      prisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          team: {
            create: jest.fn().mockResolvedValue(team),
          },
          teamUser: {
            create: jest.fn().mockResolvedValue({
              team_id: team.id,
              user_id: userId,
              role: team_role.COACH,
            }),
          },
        });
      });

      // Act
      const result = await service.create(createDto, userId);

      // Assert
      expect(result).toEqual(team);
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('devrait créer une team avec un coach spécifié', async () => {
      // Arrange
      const createDto = {
        name: 'U19 Garçons',
        category: 'U19',
        club_id: 'club-1',
        coach_user_id: 'user-2',
      };
      const userId = 'user-1';

      prisma.club.findUnique.mockResolvedValue({ id: 'club-1', name: 'FC Test', created_at: new Date(), updated_at: new Date() });
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT });
      prisma.user.findUnique.mockResolvedValue({ id: 'user-2', email: 'coach@test.com', password_hash: 'hash', first_name: 'Coach', last_name: 'Test', created_at: new Date(), updated_at: new Date() });

      prisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          team: {
            create: jest.fn().mockResolvedValue({
              id: 'team-1',
              name: 'U19 Garçons',
              category: 'U19',
              club_id: 'club-1',
              created_at: new Date(),
              updated_at: new Date(),
            }),
          },
          teamUser: {
            create: jest.fn().mockResolvedValue({
              team_id: 'team-1',
              user_id: 'user-2',
              role: team_role.COACH,
            }),
          },
        });
      });

      // Act
      const result = await service.create(createDto, userId);

      // Assert
      expect(result).toBeDefined();
    });

    it('devrait refuser si l\'utilisateur n\'est pas membre du club', async () => {
      // Arrange
      prisma.club.findUnique.mockResolvedValue({ id: 'club-1', name: 'FC Test', created_at: new Date(), updated_at: new Date() });
      prisma.clubUser.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create({ name: 'Test', category: 'U19', club_id: 'club-1' }, 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  // ==================== FIND ALL ====================
  describe('findAll', () => {
    it('devrait retourner les teams d\'un club avec pagination', async () => {
      // Arrange
      const clubId = 'club-1';
      const userId = 'user-1';
      const teams = [
        {
          id: 'team-1',
          name: 'U19 Garçons',
          category: 'U19',
          club_id: clubId,
          created_at: new Date(),
          updated_at: new Date(),
          _count: { players: 15, teamUsers: 2 },
        },
        {
          id: 'team-2',
          name: 'Seniors',
          category: 'Seniors',
          club_id: clubId,
          created_at: new Date(),
          updated_at: new Date(),
          _count: { players: 20, teamUsers: 3 },
        },
      ];

      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT });
      prisma.team.count.mockResolvedValue(2);
      prisma.team.findMany.mockResolvedValue(teams);
      prisma.teamUser.findFirst.mockResolvedValueOnce({ role: team_role.COACH }).mockResolvedValueOnce(null);

      // Act
      const result = await service.findAll(clubId, userId);

      // Assert
      expect(result.data).toHaveLength(2);
      expect(result.data[0].myRole).toBe(team_role.COACH);
      expect(result.data[1].myRole).toBeNull();
      expect(result.meta.total).toBe(2);
    });

    it('devrait refuser si non membre du club', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findAll('club-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });

    it('devrait filtrer par recherche de nom ou catégorie', async () => {
      // Arrange
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.COACH });
      prisma.team.count.mockResolvedValue(0);
      prisma.team.findMany.mockResolvedValue([]);

      // Act
      await service.findAll('club-1', 'user-1', { search: 'U19' });

      // Assert
      expect(prisma.team.count).toHaveBeenCalledWith({
        where: {
          club_id: 'club-1',
          OR: [
            { name: { contains: 'U19', mode: 'insensitive' } },
            { category: { contains: 'U19', mode: 'insensitive' } },
          ],
        },
      });
    });
  });

  // ==================== FIND ONE ====================
  describe('findOne', () => {
    it('devrait retourner les détails d\'une team avec rôles', async () => {
      // Arrange
      const teamId = 'team-1';
      const userId = 'user-1';
      const team = {
        id: teamId,
        name: 'U19 Garçons',
        category: 'U19',
        club_id: 'club-1',
        created_at: new Date(),
        updated_at: new Date(),
        teamUsers: [],
        players: [],
        club: { id: 'club-1', name: 'FC Test' },
      };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT });
      prisma.teamUser.findFirst.mockResolvedValue({ role: team_role.COACH });

      // Act
      const result = await service.findOne(teamId, userId);

      // Assert
      expect(result.id).toBe(teamId);
      expect(result.myTeamRole).toBe(team_role.COACH);
      expect(result.myClubRole).toBe(club_role.PRESIDENT);
    });

    it('devrait lancer NotFoundException si team inexistante', async () => {
      // Arrange
      prisma.team.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('invalid', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('devrait refuser si non membre du club', async () => {
      // Arrange
      const team = {
        id: 'team-1',
        name: 'Test',
        category: 'U19',
        club_id: 'club-1',
        created_at: new Date(),
        updated_at: new Date(),
        teamUsers: [],
        players: [],
        club: { id: 'club-1', name: 'FC Test' },
      };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.clubUser.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('team-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  // ==================== UPDATE ====================
  describe('update', () => {
    it('devrait permettre au COACH de modifier la team', async () => {
      // Arrange
      const teamId = 'team-1';
      const userId = 'user-1';
      const updateDto = { name: 'Nouveau nom' };
      const team = { id: teamId, name: 'Ancien', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValue({ role: team_role.COACH });
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.COACH });
      prisma.team.update.mockResolvedValue({ ...team, name: 'Nouveau nom' });

      // Act
      const result = await service.update(teamId, userId, updateDto);

      // Assert
      expect(result.name).toBe('Nouveau nom');
    });

    it('devrait permettre au PRESIDENT du club de modifier la team', async () => {
      // Arrange
      const teamId = 'team-1';
      const userId = 'user-1';
      const updateDto = { name: 'Nouveau nom' };
      const team = { id: teamId, name: 'Ancien', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValue(null); // Pas COACH de la team
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT }); // Mais PRESIDENT du club
      prisma.team.update.mockResolvedValue({ ...team, name: 'Nouveau nom' });

      // Act
      const result = await service.update(teamId, userId, updateDto);

      // Assert
      expect(result.name).toBe('Nouveau nom');
    });

    it('devrait refuser si ni COACH ni PRESIDENT', async () => {
      // Arrange
      const team = { id: 'team-1', name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValue({ role: team_role.ASSISTANT_COACH });
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.COACH });

      // Act & Assert
      await expect(service.update('team-1', 'user-1', { name: 'Test' })).rejects.toThrow(ForbiddenException);
    });
  });

  // ==================== REMOVE ====================
  describe('remove', () => {
    it('devrait permettre au COACH de supprimer la team', async () => {
      // Arrange
      const teamId = 'team-1';
      const userId = 'user-1';
      const team = { id: teamId, name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValue({ role: team_role.COACH });
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.COACH });
      prisma.team.delete.mockResolvedValue(team);

      // Act
      const result = await service.remove(teamId, userId);

      // Assert
      expect(result).toEqual(team);
    });

    it('devrait permettre au PRESIDENT du club de supprimer la team', async () => {
      // Arrange
      const teamId = 'team-1';
      const userId = 'user-1';
      const team = { id: teamId, name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValue(null);
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT });
      prisma.team.delete.mockResolvedValue(team);

      // Act
      const result = await service.remove(teamId, userId);

      // Assert
      expect(result).toEqual(team);
    });

    it('devrait refuser si ni COACH ni PRESIDENT', async () => {
      // Arrange
      const team = { id: 'team-1', name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValue({ role: team_role.ASSISTANT_COACH });
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.RESPONSABLE });

      // Act & Assert
      await expect(service.remove('team-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  // ==================== GET MEMBERS ====================
  describe('getMembers', () => {
    it('devrait retourner la liste des membres de la team', async () => {
      // Arrange
      const teamId = 'team-1';
      const userId = 'user-1';
      const team = { id: teamId, name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };
      const members = [
        { team_id: teamId, user_id: 'user-1', role: team_role.COACH, user: { id: 'user-1', email: 'coach@test.com', first_name: 'Coach', last_name: 'Test' } },
        { team_id: teamId, user_id: 'user-2', role: team_role.ASSISTANT_COACH, user: { id: 'user-2', email: 'assist@test.com', first_name: 'Assistant', last_name: 'Test' } },
      ];

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.COACH });
      prisma.teamUser.findMany.mockResolvedValue(members);

      // Act
      const result = await service.getMembers(teamId, userId);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].role).toBe(team_role.COACH);
    });

    it('devrait refuser si non membre du club', async () => {
      // Arrange
      const team = { id: 'team-1', name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.clubUser.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getMembers('team-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  // ==================== ADD MEMBER ====================
  describe('addMember', () => {
    it('devrait permettre au COACH d\'ajouter un membre', async () => {
      // Arrange
      const teamId = 'team-1';
      const userId = 'user-1';
      const addDto = { user_id: 'user-2', role: team_role.ASSISTANT_COACH };
      const team = { id: teamId, name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };
      const newMember = {
        team_id: teamId,
        user_id: 'user-2',
        role: team_role.ASSISTANT_COACH,
        user: { id: 'user-2', email: 'new@test.com', first_name: 'New', last_name: 'Member' },
      };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValueOnce({ role: team_role.COACH }).mockResolvedValueOnce(null);
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.COACH });
      prisma.user.findUnique.mockResolvedValue({ id: 'user-2', email: 'new@test.com', password_hash: 'hash', first_name: 'New', last_name: 'Member', created_at: new Date(), updated_at: new Date() });
      prisma.teamUser.create.mockResolvedValue(newMember);

      // Act
      const result = await service.addMember(teamId, userId, addDto);

      // Assert
      expect(result.user_id).toBe('user-2');
      expect(result.role).toBe(team_role.ASSISTANT_COACH);
    });

    it('devrait permettre au PRESIDENT du club d\'ajouter un membre', async () => {
      // Arrange
      const teamId = 'team-1';
      const userId = 'user-1';
      const addDto = { user_id: 'user-2', role: team_role.ASSISTANT_COACH };
      const team = { id: teamId, name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT });
      prisma.user.findUnique.mockResolvedValue({ id: 'user-2', email: 'new@test.com', password_hash: 'hash', first_name: 'New', last_name: 'Member', created_at: new Date(), updated_at: new Date() });
      prisma.teamUser.create.mockResolvedValue({
        team_id: teamId,
        user_id: 'user-2',
        role: team_role.ASSISTANT_COACH,
        user: { id: 'user-2', email: 'new@test.com', first_name: 'New', last_name: 'Member' },
      });

      // Act
      const result = await service.addMember(teamId, userId, addDto);

      // Assert
      expect(result).toBeDefined();
    });

    it('devrait refuser si ni COACH ni PRESIDENT', async () => {
      // Arrange
      const team = { id: 'team-1', name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValue({ role: team_role.ASSISTANT_COACH });
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.RESPONSABLE });

      // Act & Assert
      await expect(service.addMember('team-1', 'user-1', { user_id: 'user-2', role: team_role.ASSISTANT_COACH })).rejects.toThrow(ForbiddenException);
    });

    it('devrait refuser si l\'utilisateur est déjà membre', async () => {
      // Arrange
      const team = { id: 'team-1', name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValueOnce({ role: team_role.COACH }).mockResolvedValueOnce({ role: team_role.ASSISTANT_COACH });
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.COACH });
      prisma.user.findUnique.mockResolvedValue({ id: 'user-2', email: 'new@test.com', password_hash: 'hash', first_name: 'New', last_name: 'Member', created_at: new Date(), updated_at: new Date() });

      // Act & Assert
      await expect(service.addMember('team-1', 'user-1', { user_id: 'user-2', role: team_role.ASSISTANT_COACH })).rejects.toThrow(ConflictException);
    });
  });

  // ==================== REMOVE MEMBER ====================
  describe('removeMember', () => {
    it('devrait permettre au COACH de retirer un ASSISTANT_COACH', async () => {
      // Arrange
      const teamId = 'team-1';
      const userId = 'user-1';
      const memberToRemove = 'user-2';
      const team = { id: teamId, name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValueOnce({ role: team_role.COACH }).mockResolvedValueOnce({ role: team_role.ASSISTANT_COACH });
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.COACH });
      prisma.teamUser.deleteMany.mockResolvedValue({ count: 1 });

      // Act
      const result = await service.removeMember(teamId, userId, memberToRemove);

      // Assert
      expect(result.message).toBe('Membre retiré avec succès');
    });

    it('devrait permettre au PRESIDENT de retirer un membre', async () => {
      // Arrange
      const teamId = 'team-1';
      const userId = 'user-1';
      const memberToRemove = 'user-2';
      const team = { id: teamId, name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({ role: team_role.COACH });
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT });
      prisma.teamUser.deleteMany.mockResolvedValue({ count: 1 });

      // Act
      const result = await service.removeMember(teamId, userId, memberToRemove);

      // Assert
      expect(result.message).toBe('Membre retiré avec succès');
    });

    it('devrait refuser à l\'ASSISTANT_COACH de retirer un COACH', async () => {
      // Arrange
      const team = { id: 'team-1', name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValueOnce({ role: team_role.ASSISTANT_COACH }).mockResolvedValueOnce({ role: team_role.COACH });
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.COACH });

      // Act & Assert
      await expect(service.removeMember('team-1', 'user-1', 'user-2')).rejects.toThrow(ForbiddenException);
    });
  });

  // ==================== UPDATE MEMBER ROLE ====================
  describe('updateMemberRole', () => {
    it('devrait permettre au COACH de changer un rôle', async () => {
      // Arrange
      const teamId = 'team-1';
      const userId = 'user-1';
      const memberToUpdate = 'user-2';
      const updateDto = { role: team_role.COACH };
      const team = { id: teamId, name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValueOnce({ role: team_role.COACH }).mockResolvedValueOnce({ role: team_role.ASSISTANT_COACH });
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.COACH });
      prisma.teamUser.updateMany.mockResolvedValue({ count: 1 });
      prisma.teamUser.findFirst.mockResolvedValueOnce({ role: team_role.COACH }).mockResolvedValueOnce({ role: team_role.ASSISTANT_COACH }).mockResolvedValueOnce({
        team_id: teamId,
        user_id: memberToUpdate,
        role: team_role.COACH,
        user: { id: memberToUpdate, email: 'test@test.com', first_name: 'Test', last_name: 'User' },
      });

      // Act
      const result:any = await service.updateMemberRole(teamId, userId, memberToUpdate, updateDto);

      // Assert
      expect(result.role).toBe(team_role.COACH);
    });

    it('devrait permettre au PRESIDENT du club de changer un rôle', async () => {
      // Arrange
      const teamId = 'team-1';
      const userId = 'user-1';
      const memberToUpdate = 'user-2';
      const updateDto = { role: team_role.ASSISTANT_COACH };
      const team = { id: teamId, name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      // getUserRoleInTeam: user-1 n'est pas COACH de team-1
      // isClubPresident: user-1 est PRESIDENT de club-1
      // findFirst pour vérifier que user-2 existe dans team-1 avec role COACH
      // findFirst après update pour retourner le nouveau rôle
      prisma.teamUser.findFirst
        .mockResolvedValueOnce(null) // getUserRoleInTeam
        .mockResolvedValueOnce({ role: team_role.COACH } as any) // membre existe
        .mockResolvedValueOnce({ // après update
          team_id: teamId,
          user_id: memberToUpdate,
          role: team_role.ASSISTANT_COACH,
          user: { id: memberToUpdate, email: 'test@test.com', first_name: 'Test', last_name: 'User' },
        } as any);
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT } as any);
      prisma.teamUser.updateMany.mockResolvedValue({ count: 1 });

      // Act
      const result:any = await service.updateMemberRole(teamId, userId, memberToUpdate, updateDto);

      // Assert
      expect(result.role).toBe(team_role.ASSISTANT_COACH);
    });

    it('devrait refuser si ni COACH ni PRESIDENT', async () => {
      // Arrange
      const team = { id: 'team-1', name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValue({ role: team_role.ASSISTANT_COACH });
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.RESPONSABLE });

      // Act & Assert
      await expect(service.updateMemberRole('team-1', 'user-1', 'user-2', { role: team_role.COACH })).rejects.toThrow(ForbiddenException);
    });
  });

  // ==================== LEAVE TEAM ====================
  describe('leaveTeam', () => {
    it('devrait permettre à un COACH de quitter la team', async () => {
      // Arrange
      const teamId = 'team-1';
      const userId = 'user-1';
      const team = { id: teamId, name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValue({ role: team_role.COACH });
      prisma.teamUser.deleteMany.mockResolvedValue({ count: 1 });

      // Act
      const result = await service.leaveTeam(teamId, userId);

      // Assert
      expect(result.message).toBe('Vous avez quitté l\'équipe avec succès');
    });

    it('devrait permettre à un ASSISTANT_COACH de quitter la team', async () => {
      // Arrange
      const teamId = 'team-1';
      const userId = 'user-1';
      const team = { id: teamId, name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValue({ role: team_role.ASSISTANT_COACH });
      prisma.teamUser.deleteMany.mockResolvedValue({ count: 1 });

      // Act
      const result = await service.leaveTeam(teamId, userId);

      // Assert
      expect(result.message).toBe('Vous avez quitté l\'équipe avec succès');
    });

    it('devrait lancer NotFoundException si non membre', async () => {
      // Arrange
      const team = { id: 'team-1', name: 'Test', category: 'U19', club_id: 'club-1', created_at: new Date(), updated_at: new Date() };

      prisma.team.findUnique.mockResolvedValue(team);
      prisma.teamUser.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.leaveTeam('team-1', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== GET TEAM STATISTICS ====================

  describe('getTeamStatistics', () => {
    const teamId = 'team-1';
    const userId = 'user-1';
    const clubId = 'club-1';

    const mockTeamWithMatches = {
      id: teamId,
      name: 'U19 Garçons',
      category: 'U19',
      club_id: clubId,
      created_at: new Date(),
      updated_at: new Date(),
      matches: [
        {
          id: 'match-1',
          opponent: 'FC Alpha',
          match_date: new Date('2025-03-01'),
          location: match_location.HOME,
          status: match_status.FINISHED,
          matchEvents: [
            {
              id: 'evt-1',
              player_id: 'player-1',
              event_type: match_event_type.GOAL,
              player: { id: 'player-1', first_name: 'John', last_name: 'Doe', jersey_number: 9, position: 'FORWARD' },
            },
            {
              id: 'evt-2',
              player_id: 'player-1',
              event_type: match_event_type.GOAL,
              player: { id: 'player-1', first_name: 'John', last_name: 'Doe', jersey_number: 9, position: 'FORWARD' },
            },
            {
              id: 'evt-3',
              player_id: 'player-2',
              event_type: match_event_type.ASSIST,
              player: { id: 'player-2', first_name: 'Jane', last_name: 'Smith', jersey_number: 10, position: 'MIDFIELDER' },
            },
          ],
        },
        {
          id: 'match-2',
          opponent: 'FC Beta',
          match_date: new Date('2025-03-08'),
          location: match_location.AWAY,
          status: match_status.FINISHED,
          matchEvents: [
            {
              id: 'evt-4',
              player_id: 'player-2',
              event_type: match_event_type.GOAL,
              player: { id: 'player-2', first_name: 'Jane', last_name: 'Smith', jersey_number: 10, position: 'MIDFIELDER' },
            },
            {
              id: 'evt-5',
              player_id: 'player-1',
              event_type: match_event_type.YELLOW_CARD,
              player: { id: 'player-1', first_name: 'John', last_name: 'Doe', jersey_number: 9, position: 'FORWARD' },
            },
          ],
        },
        {
          id: 'match-3',
          opponent: 'FC Gamma',
          match_date: new Date('2025-03-15'),
          location: match_location.HOME,
          status: match_status.UPCOMING,
          matchEvents: [],
        },
      ],
    };

    it('devrait retourner les statistiques globales pour un COACH', async () => {
      // Arrange
      prisma.team.findUnique.mockResolvedValue(mockTeamWithMatches);
      prisma.clubUser.findFirst.mockResolvedValue(null);
      prisma.teamUser.findFirst.mockResolvedValue({ role: team_role.COACH });

      // Act
      const result = await service.getTeamStatistics(teamId, userId);

      // Assert
      expect(result.teamId).toBe(teamId);
      expect(result.teamName).toBe('U19 Garçons');
      expect(result.totalMatches).toBe(3);
      expect(result.finishedMatches).toBe(2);
      expect(result.upcomingMatches).toBe(1);
      expect(result.liveMatches).toBe(0);
      expect(result.totalGoals).toBe(3);
      expect(result.totalAssists).toBe(1);
      expect(result.totalYellowCards).toBe(1);
      expect(result.averageGoalsPerMatch).toBe(1.5);
      expect(result.topScorer).toEqual({
        playerId: 'player-1',
        playerName: 'John Doe',
        jerseyNumber: 9,
        goals: 2,
      });
      expect(result.topAssister).toEqual({
        playerId: 'player-2',
        playerName: 'Jane Smith',
        jerseyNumber: 10,
        assists: 1,
      });
      expect(result.matchesHistory).toHaveLength(3);
      expect(result.matchesHistory[0].goals).toBe(2);
      expect(result.matchesHistory[1].goals).toBe(1);
      expect(result.matchesHistory[2].goals).toBe(0);
    });

    it('devrait retourner les statistiques pour un PRESIDENT', async () => {
      // Arrange
      prisma.team.findUnique.mockResolvedValue(mockTeamWithMatches);
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.PRESIDENT });

      // Act
      const result = await service.getTeamStatistics(teamId, userId);

      // Assert
      expect(result.teamId).toBe(teamId);
      expect(result.totalGoals).toBe(3);
    });

    it('devrait retourner des stats à zéro pour une équipe sans matchs', async () => {
      // Arrange
      const emptyTeam = { ...mockTeamWithMatches, matches: [] };
      prisma.team.findUnique.mockResolvedValue(emptyTeam);
      prisma.clubUser.findFirst.mockResolvedValue(null);
      prisma.teamUser.findFirst.mockResolvedValue({ role: team_role.COACH });

      // Act
      const result = await service.getTeamStatistics(teamId, userId);

      // Assert
      expect(result.totalMatches).toBe(0);
      expect(result.totalGoals).toBe(0);
      expect(result.averageGoalsPerMatch).toBe(0);
      expect(result.topScorer).toBeNull();
      expect(result.topAssister).toBeNull();
      expect(result.matchesHistory).toEqual([]);
    });

    it('devrait lancer NotFoundException si l\'équipe n\'existe pas', async () => {
      // Arrange
      prisma.team.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getTeamStatistics(teamId, userId)).rejects.toThrow(NotFoundException);
    });

    it('devrait lancer ForbiddenException si l\'utilisateur n\'est pas COACH/ASSISTANT/PRESIDENT', async () => {
      // Arrange
      prisma.team.findUnique.mockResolvedValue(mockTeamWithMatches);
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.RESPONSABLE });
      prisma.teamUser.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getTeamStatistics(teamId, userId)).rejects.toThrow(ForbiddenException);
    });
  });

  // ==================== GET TEAM PLAYERS STATISTICS ====================

  describe('getTeamPlayersStatistics', () => {
    const teamId = 'team-1';
    const userId = 'user-1';
    const clubId = 'club-1';

    const mockPlayers = [
      {
        id: 'player-1',
        first_name: 'John',
        last_name: 'Doe',
        jersey_number: 9,
        position: 'FORWARD',
        matchEvents: [
          { event_type: match_event_type.GOAL },
          { event_type: match_event_type.GOAL },
          { event_type: match_event_type.ASSIST },
          { event_type: match_event_type.YELLOW_CARD },
        ],
        matchPlayers: [{ id: 'mp-1' }, { id: 'mp-2' }, { id: 'mp-3' }],
      },
      {
        id: 'player-2',
        first_name: 'Jane',
        last_name: 'Smith',
        jersey_number: 10,
        position: 'MIDFIELDER',
        matchEvents: [
          { event_type: match_event_type.GOAL },
          { event_type: match_event_type.RECOVERY },
          { event_type: match_event_type.RECOVERY },
        ],
        matchPlayers: [{ id: 'mp-4' }, { id: 'mp-5' }],
      },
    ];

    it('devrait retourner les stats de chaque joueur triées par buts', async () => {
      // Arrange
      prisma.team.findUnique.mockResolvedValue({ id: teamId, club_id: clubId });
      prisma.clubUser.findFirst.mockResolvedValue(null);
      prisma.teamUser.findFirst.mockResolvedValue({ role: team_role.COACH });
      prisma.player.findMany.mockResolvedValue(mockPlayers);

      // Act
      const result = await service.getTeamPlayersStatistics(teamId, userId);

      // Assert
      expect(result).toHaveLength(2);
      // Trié par buts décroissants
      expect(result[0].playerId).toBe('player-1');
      expect(result[0]).toEqual({
        playerId: 'player-1',
        playerName: 'John Doe',
        jerseyNumber: 9,
        position: 'FORWARD',
        matchesPlayed: 3,
        goals: 2,
        assists: 1,
        yellowCards: 1,
        redCards: 0,
        recoveries: 0,
        ballLosses: 0,
      });
      expect(result[1]).toEqual({
        playerId: 'player-2',
        playerName: 'Jane Smith',
        jerseyNumber: 10,
        position: 'MIDFIELDER',
        matchesPlayed: 2,
        goals: 1,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        recoveries: 2,
        ballLosses: 0,
      });
    });

    it('devrait retourner un tableau vide si aucun joueur', async () => {
      // Arrange
      prisma.team.findUnique.mockResolvedValue({ id: teamId, club_id: clubId });
      prisma.clubUser.findFirst.mockResolvedValue(null);
      prisma.teamUser.findFirst.mockResolvedValue({ role: team_role.COACH });
      prisma.player.findMany.mockResolvedValue([]);

      // Act
      const result = await service.getTeamPlayersStatistics(teamId, userId);

      // Assert
      expect(result).toEqual([]);
    });

    it('devrait lancer NotFoundException si l\'équipe n\'existe pas', async () => {
      // Arrange
      prisma.team.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getTeamPlayersStatistics(teamId, userId)).rejects.toThrow(NotFoundException);
    });

    it('devrait lancer ForbiddenException si non autorisé', async () => {
      // Arrange
      prisma.team.findUnique.mockResolvedValue({ id: teamId, club_id: clubId });
      prisma.clubUser.findFirst.mockResolvedValue({ role: club_role.RESPONSABLE });
      prisma.teamUser.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getTeamPlayersStatistics(teamId, userId)).rejects.toThrow(ForbiddenException);
    });

    it('devrait permettre l\'accès à un ASSISTANT_COACH', async () => {
      // Arrange
      prisma.team.findUnique.mockResolvedValue({ id: teamId, club_id: clubId });
      prisma.clubUser.findFirst.mockResolvedValue(null);
      prisma.teamUser.findFirst.mockResolvedValue({ role: team_role.ASSISTANT_COACH });
      prisma.player.findMany.mockResolvedValue([]);

      // Act
      const result = await service.getTeamPlayersStatistics(teamId, userId);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
