import { AuthSessionEntity } from './entity';
import type { IAuthRepository } from './repository.interface';
import type { LoginPayload, RegisterPayload } from './types';

export class LoginUseCase {
  constructor(private authRepo: IAuthRepository) {}

  public async execute(payload: LoginPayload): Promise<AuthSessionEntity> {
    return this.authRepo.login(payload);
  }
}

export class RegisterUseCase {
  constructor(private authRepo: IAuthRepository) {}

  public async execute(payload: RegisterPayload): Promise<AuthSessionEntity> {
    return this.authRepo.register(payload);
  }
}

export class LogoutUseCase {
  constructor(private authRepo: IAuthRepository) {}

  public async execute(): Promise<void> {
    return this.authRepo.logout();
  }
}

export class GetCurrentSessionUseCase {
  constructor(private authRepo: IAuthRepository) {}

  public async execute(): Promise<AuthSessionEntity | null> {
    return this.authRepo.getSession();
  }
}
