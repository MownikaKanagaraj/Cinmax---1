import type { IAuthRepository, AuthSessionEntity, UserEntity, LoginPayload, RegisterPayload, VerifyOTPPayload, OAuthLoginOptions } from '../modules/auth';
import {
  LoginUseCase,
  RegisterUseCase,
  LogoutUseCase,
  GetCurrentSessionUseCase,
} from '../modules/auth/useCases';

export class AuthService {
  private loginUseCase: LoginUseCase;
  private registerUseCase: RegisterUseCase;
  private logoutUseCase: LogoutUseCase;
  private getSessionUseCase: GetCurrentSessionUseCase;

  constructor(private authRepo: IAuthRepository) {
    this.loginUseCase = new LoginUseCase(authRepo);
    this.registerUseCase = new RegisterUseCase(authRepo);
    this.logoutUseCase = new LogoutUseCase(authRepo);
    this.getSessionUseCase = new GetCurrentSessionUseCase(authRepo);
  }

  public async login(payload: LoginPayload): Promise<AuthSessionEntity> {
    return this.loginUseCase.execute(payload);
  }

  public async register(payload: RegisterPayload): Promise<AuthSessionEntity> {
    return this.registerUseCase.execute(payload);
  }

  public async logout(): Promise<void> {
    return this.logoutUseCase.execute();
  }

  public async getSession(): Promise<AuthSessionEntity | null> {
    return this.authRepo.getSession();
  }

  public async getCurrentSession(): Promise<AuthSessionEntity | null> {
    return this.authRepo.getSession();
  }

  public async refreshSession(): Promise<AuthSessionEntity | null> {
    return this.authRepo.refreshSession();
  }

  public async forgotPassword(email: string): Promise<void> {
    return this.authRepo.forgotPassword(email);
  }

  public async resetPassword(newPassword: string): Promise<void> {
    return this.authRepo.resetPassword(newPassword);
  }

  public async verifyOTP(payload: VerifyOTPPayload): Promise<AuthSessionEntity> {
    return this.authRepo.verifyOTP(payload);
  }

  public async loginWithGoogle(options?: OAuthLoginOptions): Promise<void> {
    return this.authRepo.loginWithGoogle(options);
  }

  public async loginWithApple(options?: OAuthLoginOptions): Promise<void> {
    return this.authRepo.loginWithApple(options);
  }

  public async loginWithPhone(phone: string): Promise<void> {
    return this.authRepo.loginWithPhone(phone);
  }

  public async updateProfile(data: Partial<UserEntity>): Promise<UserEntity | null> {
    return this.authRepo.updateProfile(data);
  }

  public async deleteAccount(): Promise<void> {
    return this.authRepo.deleteAccount();
  }
}
