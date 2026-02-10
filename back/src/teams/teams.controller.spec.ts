import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { UpdateTeamMemberRoleDto } from './dto/update-team-member-role.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { team_role } from '@prisma/client';

describe('TeamsController', () => {
  let controller: TeamsController;
  let service: TeamsService;

  const mockTeamsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getMembers: jest.fn(),
    addMember: jest.fn(),
    removeMember: jest.fn(),
    updateMemberRole: jest.fn(),
    leaveTeam: jest.fn(),
  };

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: mockTeamsService,
        },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== CREATE ====================

  it('should call teamsService.create with correct parameters', async () => {
    // Arrange
    const createDto: CreateTeamDto = {
      club_id: 'club-1',
      name: 'Test Team',
      category: 'U17',
    };
    const expectedResult = { id: 'team-1', ...createDto };
    mockTeamsService.create.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.create(createDto, mockUser);

    // Assert
    expect(service.create).toHaveBeenCalledWith(createDto, mockUser.id);
    expect(service.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== FIND ALL ====================

  it('should call teamsService.findAll with correct parameters', async () => {
    // Arrange
    const clubId = 'club-1';
    const paginationQuery: PaginationQueryDto = { page: 1, limit: 10 };
    const expectedResult = {
      data: [{ id: 'team-1', name: 'Test Team' }],
      total: 1,
      page: 1,
      limit: 10,
    };
    mockTeamsService.findAll.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.findAll(clubId, paginationQuery, mockUser);

    // Assert
    expect(service.findAll).toHaveBeenCalledWith(clubId, mockUser.id, paginationQuery);
    expect(service.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== FIND ONE ====================

  it('should call teamsService.findOne with correct parameters', async () => {
    // Arrange
    const teamId = 'team-1';
    const expectedResult = { id: teamId, name: 'Test Team' };
    mockTeamsService.findOne.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.findOne(teamId, mockUser);

    // Assert
    expect(service.findOne).toHaveBeenCalledWith(teamId, mockUser.id);
    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== UPDATE ====================

  it('should call teamsService.update with correct parameters', async () => {
    // Arrange
    const teamId = 'team-1';
    const updateDto: UpdateTeamDto = { name: 'Updated Team' };
    const expectedResult = { id: teamId, ...updateDto };
    mockTeamsService.update.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.update(teamId, mockUser, updateDto);

    // Assert
    expect(service.update).toHaveBeenCalledWith(teamId, mockUser.id, updateDto);
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== REMOVE ====================

  it('should call teamsService.remove with correct parameters', async () => {
    // Arrange
    const teamId = 'team-1';
    mockTeamsService.remove.mockResolvedValue({ message: 'Team deleted' });

    // Act
    const result = await controller.remove(teamId, mockUser);

    // Assert
    expect(service.remove).toHaveBeenCalledWith(teamId, mockUser.id);
    expect(service.remove).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Team deleted' });
  });

  // ==================== GET MEMBERS ====================

  it('should call teamsService.getMembers with correct parameters', async () => {
    // Arrange
    const teamId = 'team-1';
    const expectedResult = [
      { id: 'user-1', role: team_role.COACH },
    ];
    mockTeamsService.getMembers.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.getMembers(teamId, mockUser);

    // Assert
    expect(service.getMembers).toHaveBeenCalledWith(teamId, mockUser.id);
    expect(service.getMembers).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== ADD MEMBER ====================

  it('should call teamsService.addMember with correct parameters', async () => {
    // Arrange
    const teamId = 'team-1';
    const addMemberDto: AddTeamMemberDto = {
      user_id: 'user-2',
      role: team_role.ASSISTANT_COACH,
    };
    mockTeamsService.addMember.mockResolvedValue({ message: 'Member added' });

    // Act
    const result = await controller.addMember(teamId, mockUser, addMemberDto);

    // Assert
    expect(service.addMember).toHaveBeenCalledWith(teamId, mockUser.id, addMemberDto);
    expect(service.addMember).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Member added' });
  });

  // ==================== REMOVE MEMBER ====================

  it('should call teamsService.removeMember with correct parameters', async () => {
    // Arrange
    const teamId = 'team-1';
    const memberIdToRemove = 'user-2';
    mockTeamsService.removeMember.mockResolvedValue({ message: 'Member removed' });

    // Act
    const result = await controller.removeMember(teamId, memberIdToRemove, mockUser);

    // Assert
    expect(service.removeMember).toHaveBeenCalledWith(teamId, mockUser.id, memberIdToRemove);
    expect(service.removeMember).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Member removed' });
  });

  // ==================== UPDATE MEMBER ROLE ====================

  it('should call teamsService.updateMemberRole with correct parameters', async () => {
    // Arrange
    const teamId = 'team-1';
    const memberIdToUpdate = 'user-2';
    const updateRoleDto: UpdateTeamMemberRoleDto = {
      role: team_role.COACH,
    };
    mockTeamsService.updateMemberRole.mockResolvedValue({ message: 'Role updated' });

    // Act
    const result = await controller.updateMemberRole(
      teamId,
      memberIdToUpdate,
      mockUser,
      updateRoleDto
    );

    // Assert
    expect(service.updateMemberRole).toHaveBeenCalledWith(
      teamId,
      mockUser.id,
      memberIdToUpdate,
      updateRoleDto
    );
    expect(service.updateMemberRole).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Role updated' });
  });

  // ==================== LEAVE TEAM ====================

  it('should call teamsService.leaveTeam with correct parameters', async () => {
    // Arrange
    const teamId = 'team-1';
    mockTeamsService.leaveTeam.mockResolvedValue({ message: 'Team left' });

    // Act
    const result = await controller.leaveTeam(teamId, mockUser);

    // Assert
    expect(service.leaveTeam).toHaveBeenCalledWith(teamId, mockUser.id);
    expect(service.leaveTeam).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Team left' });
  });
});
