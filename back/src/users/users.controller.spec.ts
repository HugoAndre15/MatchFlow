import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    update: jest.fn(),
    updatePassword: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    first_name: 'John',
    last_name: 'Doe',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== GET PROFILE ====================

  it('should return current user profile', () => {
    // Act
    const result = controller.getProfile(mockUser);

    // Assert
    expect(result).toEqual(mockUser);
  });

  // ==================== UPDATE PROFILE ====================

  it('should call usersService.update for updating own profile', async () => {
    // Arrange
    const updateDto: UpdateUserDto = { first_name: 'Jane' };
    mockUsersService.update.mockResolvedValue({ ...mockUser, ...updateDto });

    // Act
    const result = await controller.updateProfile(mockUser, updateDto);

    // Assert
    expect(service.update).toHaveBeenCalledWith(mockUser.id, updateDto);
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ...mockUser, ...updateDto });
  });

  // ==================== UPDATE PASSWORD ====================

  it('should call usersService.updatePassword with correct parameters', async () => {
    // Arrange
    const updatePasswordDto: UpdatePasswordDto = {
      current_password: 'old-password',
      new_password: 'new-password',
    };
    mockUsersService.updatePassword.mockResolvedValue({ message: 'Password updated' });

    // Act
    const result = await controller.updateMyPassword(mockUser, updatePasswordDto);

    // Assert
    expect(service.updatePassword).toHaveBeenCalledWith(mockUser.id, updatePasswordDto);
    expect(service.updatePassword).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Password updated' });
  });

  // ==================== FIND ALL ====================

  it('should call usersService.findAll with pagination parameters', async () => {
    // Arrange
    const paginationQuery: PaginationQueryDto = {
      page: 1,
      limit: 10,
      search: 'John',
      sortBy: 'email',
    };
    const expectedResult = {
      data: [mockUser],
      total: 1,
      page: 1,
      limit: 10,
    };
    mockUsersService.findAll.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.findAll(paginationQuery);

    // Assert
    expect(service.findAll).toHaveBeenCalledWith(paginationQuery);
    expect(service.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== FIND ONE ====================

  it('should call usersService.findOne with correct id', async () => {
    // Arrange
    const userId = 'user-1';
    mockUsersService.findOne.mockResolvedValue(mockUser);

    // Act
    const result = await controller.findOne(userId);

    // Assert
    expect(service.findOne).toHaveBeenCalledWith(userId);
    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
  });

  // ==================== UPDATE USER ====================

  it('should call usersService.update when user updates own account', async () => {
    // Arrange
    const updateDto: UpdateUserDto = { email: 'newemail@example.com' };
    mockUsersService.update.mockResolvedValue({ ...mockUser, ...updateDto });

    // Act
    const result = await controller.update('user-1', mockUser, updateDto);

    // Assert
    expect(service.update).toHaveBeenCalledWith('user-1', updateDto);
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ...mockUser, ...updateDto });
  });

  it('should throw ForbiddenException when trying to update another user', () => {
    // Arrange
    const updateDto: UpdateUserDto = { email: 'newemail@example.com' };

    // Act & Assert
    expect(() => {
      controller.update('user-2', mockUser, updateDto);
    }).toThrow(ForbiddenException);
    expect(service.update).not.toHaveBeenCalled();
  });
});
