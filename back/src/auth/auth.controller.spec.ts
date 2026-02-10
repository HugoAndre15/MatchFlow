import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== REGISTER ====================

  it('should call authService.register with correct parameters', async () => {
    // Arrange
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
    };
    const expectedResult = {
      access_token: 'jwt-token',
      user: { id: 'user-1', email: 'test@example.com' },
    };
    mockAuthService.register.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.register(registerDto);

    // Assert
    expect(service.register).toHaveBeenCalledWith(registerDto);
    expect(service.register).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // ==================== LOGIN ====================

  it('should call authService.login with correct parameters', async () => {
    // Arrange
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    const expectedResult = {
      access_token: 'jwt-token',
      user: { id: 'user-1', email: 'test@example.com' },
    };
    mockAuthService.login.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.login(loginDto);

    // Assert
    expect(service.login).toHaveBeenCalledWith(loginDto);
    expect(service.login).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });
});
