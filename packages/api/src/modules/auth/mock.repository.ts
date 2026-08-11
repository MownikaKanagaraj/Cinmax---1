import { mockCustomerProfileData } from '../../mockData';
import { AuthSessionEntity, UserEntity } from './entity';
import type { IAuthRepository } from './repository.interface';
import type { LoginPayload, RegisterPayload, VerifyOTPPayload, OAuthLoginOptions } from './types';

export class MockAuthRepository implements IAuthRepository {
  private session: AuthSessionEntity;

  constructor(initialSession?: AuthSessionEntity) {
    this.session =
      initialSession ||
      new AuthSessionEntity({
        user: mockCustomerProfileData,
        token: 'mock_jwt_token_sample_123456',
        isAuthenticated: true,
      });
  }

  public async login(payload: LoginPayload): Promise<AuthSessionEntity> {
    this.session = new AuthSessionEntity({
      user: {
        ...mockCustomerProfileData,
        email: payload.email,
      },
      token: `mock_jwt_${Date.now()}`,
      isAuthenticated: true,
    });
    return this.session;
  }

  public async register(payload: RegisterPayload): Promise<AuthSessionEntity> {
    this.session = new AuthSessionEntity({
      user: {
        ...mockCustomerProfileData,
        id: `usr_${Date.now()}`,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
      token: `mock_jwt_${Date.now()}`,
      isAuthenticated: true,
    });
    return this.session;
  }

  public async logout(): Promise<void> {
    this.session = new AuthSessionEntity({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  }

  public async getSession(): Promise<AuthSessionEntity | null> {
    return this.session;
  }

  public async refreshSession(): Promise<AuthSessionEntity | null> {
    return this.session;
  }

  public async forgotPassword(_email: string): Promise<void> {
    return;
  }

  public async resetPassword(_newPassword: string): Promise<void> {
    return;
  }

  public async verifyOTP(payload: VerifyOTPPayload): Promise<AuthSessionEntity> {
    this.session = new AuthSessionEntity({
      user: {
        ...mockCustomerProfileData,
        email: payload.email || mockCustomerProfileData.email,
      },
      token: `mock_jwt_otp_${Date.now()}`,
      isAuthenticated: true,
    });
    return this.session;
  }

  public async loginWithGoogle(_options?: OAuthLoginOptions): Promise<void> {
    return;
  }

  public async loginWithApple(_options?: OAuthLoginOptions): Promise<void> {
    return;
  }

  public async loginWithPhone(_phone: string): Promise<void> {
    return;
  }

  public async updateProfile(data: Partial<UserEntity>): Promise<UserEntity | null> {
    const currUser = this.session.user;
    if (!currUser) return null;
    const updatedUser = {
      ...currUser,
      firstName: data.firstName || currUser.firstName,
      lastName: data.lastName || currUser.lastName,
      avatarUrl: data.avatarUrl || currUser.avatarUrl,
    };
    this.session = new AuthSessionEntity({
      user: updatedUser,
      token: this.session.token,
      isAuthenticated: true,
    });
    return new UserEntity({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName || '',
      lastName: updatedUser.lastName || '',
      avatarUrl: updatedUser.avatarUrl || '',
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
    });
  }

  public async deleteAccount(): Promise<void> {
    await this.logout();
  }
}
