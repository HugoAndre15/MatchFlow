import { Test, TestingModule } from '@nestjs/testing';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { AddClubMemberDto } from './dto/add-club-member.dto';
import { UpdateClubMemberRoleDto } from './dto/update-club-member-role.dto';
import { TransferPresidencyDto } from './dto/transfer-presidency.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { club_role } from '@prisma/client';

describe('ClubsController', () => {
  let controller: ClubsController;
  let service: ClubsService;

  const mockClubsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getMembers: jest.fn(),
    addMember: jest.fn(),
    removeMember: jest.fn(),
    updateMemberRole: jest.fn(),
    transferPresidency: jest.fn(),
    leaveClub: jest.fn(),
  };

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubsController],
      providers: [
        {
          provide: ClubsService,
          useValue: mockClubsService,
        },
      ],
    }).compile();

    controller = module.get<ClubsController>(ClubsController);
    service = module.get<ClubsService>(ClubsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== CREATE ====================

  it('should call clubsService.create with correct parameters', async () => {
    // Arrange
    const createDto: CreateClubDto = {
      name: 'Test Club',
    };
    const expectedResult = { id: 'club-1', ...createDto };
    mockClubsService.create.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.create(createDto, mockUser);

    // Assert
    expect(service.create).toHaveBeenCalledWith(createDto, mockUser.id);
    expect(service.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== FIND ALL ====================

  it('should call clubsService.findAll with user id and pagination', async () => {
    // Arrange
    const paginationQuery: PaginationQueryDto = { page: 1, limit: 10 };
    const expectedResult = {
      data: [{ id: 'club-1', name: 'Test Club' }],
      total: 1,
      page: 1,
      limit: 10,
    };
    mockClubsService.findAll.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.findAll(mockUser, paginationQuery);

    // Assert
    expect(service.findAll).toHaveBeenCalledWith(mockUser.id, paginationQuery);
    expect(service.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== FIND ONE ====================

  it('should call clubsService.findOne with club id and user id', async () => {
    // Arrange
    const clubId = 'club-1';
    const expectedResult = { id: clubId, name: 'Test Club' };
    mockClubsService.findOne.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.findOne(clubId, mockUser);

    // Assert
    expect(service.findOne).toHaveBeenCalledWith(clubId, mockUser.id);
    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== UPDATE ====================

  it('should call clubsService.update with correct parameters', async () => {
    // Arrange
    const clubId = 'club-1';
    const updateDto: UpdateClubDto = { name: 'Updated Club' };
    const expectedResult = { id: clubId, ...updateDto };
    mockClubsService.update.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.update(clubId, mockUser, updateDto);

    // Assert
    expect(service.update).toHaveBeenCalledWith(clubId, mockUser.id, updateDto);
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== REMOVE ====================

  it('should call clubsService.remove with correct parameters', async () => {
    // Arrange
    const clubId = 'club-1';
    mockClubsService.remove.mockResolvedValue({ message: 'Club deleted' });

    // Act
    const result = await controller.remove(clubId, mockUser);

    // Assert
    expect(service.remove).toHaveBeenCalledWith(clubId, mockUser.id);
    expect(service.remove).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Club deleted' });
  });

  // ==================== GET MEMBERS ====================

  it('should call clubsService.getMembers with correct parameters', async () => {
    // Arrange
    const clubId = 'club-1';
    const expectedResult = [
      { id: 'user-1', role: club_role.PRESIDENT },
    ];
    mockClubsService.getMembers.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.getMembers(clubId, mockUser);

    // Assert
    expect(service.getMembers).toHaveBeenCalledWith(clubId, mockUser.id);
    expect(service.getMembers).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== ADD MEMBER ====================

  it('should call clubsService.addMember with correct parameters', async () => {
    // Arrange
    const clubId = 'club-1';
    const addMemberDto: AddClubMemberDto = {
      userId: 'user-2',
      role: club_role.COACH,
    };
    mockClubsService.addMember.mockResolvedValue({ message: 'Member added' });

    // Act
    const result = await controller.addMember(clubId, mockUser, addMemberDto);

    // Assert
    expect(service.addMember).toHaveBeenCalledWith(clubId, mockUser.id, addMemberDto);
    expect(service.addMember).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Member added' });
  });

  // ==================== REMOVE MEMBER ====================

  it('should call clubsService.removeMember with correct parameters', async () => {
    // Arrange
    const clubId = 'club-1';
    const memberIdToRemove = 'user-2';
    mockClubsService.removeMember.mockResolvedValue({ message: 'Member removed' });

    // Act
    const result = await controller.removeMember(clubId, memberIdToRemove, mockUser);

    // Assert
    expect(service.removeMember).toHaveBeenCalledWith(clubId, mockUser.id, memberIdToRemove);
    expect(service.removeMember).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Member removed' });
  });

  // ==================== UPDATE MEMBER ROLE ====================

  it('should call clubsService.updateMemberRole with correct parameters', async () => {
    // Arrange
    const clubId = 'club-1';
    const memberIdToUpdate = 'user-2';
    const updateRoleDto: UpdateClubMemberRoleDto = {
      role: club_role.RESPONSABLE,
    };
    mockClubsService.updateMemberRole.mockResolvedValue({ message: 'Role updated' });

    // Act
    const result = await controller.updateMemberRole(
      clubId,
      memberIdToUpdate,
      mockUser,
      updateRoleDto
    );

    // Assert
    expect(service.updateMemberRole).toHaveBeenCalledWith(
      clubId,
      mockUser.id,
      memberIdToUpdate,
      updateRoleDto
    );
    expect(service.updateMemberRole).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Role updated' });
  });

  // ==================== TRANSFER PRESIDENCY ====================

  it('should call clubsService.transferPresidency with correct parameters', async () => {
    // Arrange
    const clubId = 'club-1';
    const transferDto: TransferPresidencyDto = {
      new_president_user_id: 'user-2',
    };
    mockClubsService.transferPresidency.mockResolvedValue({ message: 'Presidency transferred' });

    // Act
    const result = await controller.transferPresidency(clubId, mockUser, transferDto);

    // Assert
    expect(service.transferPresidency).toHaveBeenCalledWith(clubId, mockUser.id, transferDto);
    expect(service.transferPresidency).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Presidency transferred' });
  });

  // ==================== LEAVE CLUB ====================

  it('should call clubsService.leaveClub with correct parameters', async () => {
    // Arrange
    const clubId = 'club-1';
    mockClubsService.leaveClub.mockResolvedValue({ message: 'Club left' });

    // Act
    const result = await controller.leaveClub(clubId, mockUser);

    // Assert
    expect(service.leaveClub).toHaveBeenCalledWith(clubId, mockUser.id);
    expect(service.leaveClub).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Club left' });
  });
});
