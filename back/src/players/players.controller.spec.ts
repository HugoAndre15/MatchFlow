import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { player_status, position } from '@prisma/client';

describe('PlayersController', () => {
  let controller: PlayersController;
  let service: PlayersService;

  const mockPlayersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getPlayerStats: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        {
          provide: PlayersService,
          useValue: mockPlayersService,
        },
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
    service = module.get<PlayersService>(PlayersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== CREATE ====================

  it('should call playersService.create with correct parameters', async () => {
    // Arrange
    const createDto: CreatePlayerDto = {
      team_id: 'team-1',
      first_name: 'John',
      last_name: 'Doe',
      jersey_number: 10,
      position: position.FORWARD,
      status: player_status.ACTIVE,
    };
    const expectedResult = { id: 'player-1', ...createDto };
    mockPlayersService.create.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.create(createDto, mockUser);

    // Assert
    expect(service.create).toHaveBeenCalledWith(createDto, mockUser.id);
    expect(service.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== FIND ALL ====================

  it('should call playersService.findAll with correct parameters including filters', async () => {
    // Arrange
    const teamId = 'team-1';
    const paginationQuery: PaginationQueryDto = { page: 1, limit: 10 };
    const status = 'ACTIVE';
    const positionFilter = 'FORWARD';
    const expectedResult = {
      data: [{ id: 'player-1', first_name: 'John' }],
      total: 1,
      page: 1,
      limit: 10,
    };
    mockPlayersService.findAll.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.findAll(
      teamId,
      paginationQuery,
      status,
      positionFilter,
      mockUser
    );

    // Assert
    expect(service.findAll).toHaveBeenCalledWith(
      teamId,
      mockUser.id,
      paginationQuery,
      status,
      positionFilter
    );
    expect(service.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== GET PLAYER STATS ====================

  it('should call playersService.getPlayerStats with correct parameters', async () => {
    // Arrange
    const playerId = 'player-1';
    const expectedResult = {
      totalMatches: 10,
      totalGoals: 5,
      totalAssists: 3,
      totalCards: 2,
    };
    mockPlayersService.getPlayerStats.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.getPlayerStats(playerId, mockUser);

    // Assert
    expect(service.getPlayerStats).toHaveBeenCalledWith(playerId, mockUser.id);
    expect(service.getPlayerStats).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== FIND ONE ====================

  it('should call playersService.findOne with correct parameters', async () => {
    // Arrange
    const playerId = 'player-1';
    const expectedResult = { id: playerId, first_name: 'John', last_name: 'Doe' };
    mockPlayersService.findOne.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.findOne(playerId, mockUser);

    // Assert
    expect(service.findOne).toHaveBeenCalledWith(playerId, mockUser.id);
    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== UPDATE ====================

  it('should call playersService.update with correct parameters', async () => {
    // Arrange
    const playerId = 'player-1';
    const updateDto: UpdatePlayerDto = {
      jersey_number: 11,
      status: player_status.INJURED,
    };
    const expectedResult = { id: playerId, ...updateDto };
    mockPlayersService.update.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.update(playerId, mockUser, updateDto);

    // Assert
    expect(service.update).toHaveBeenCalledWith(playerId, mockUser.id, updateDto);
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== REMOVE ====================

  it('should call playersService.remove with correct parameters', async () => {
    // Arrange
    const playerId = 'player-1';
    mockPlayersService.remove.mockResolvedValue({ message: 'Player deleted' });

    // Act
    const result = await controller.remove(playerId, mockUser);

    // Assert
    expect(service.remove).toHaveBeenCalledWith(playerId, mockUser.id);
    expect(service.remove).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Player deleted' });
  });
});
