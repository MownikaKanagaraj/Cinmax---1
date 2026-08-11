import { CustomerMapper } from '../customers/mapper';
import type { AuthSessionDTO } from './dto';
import { AuthSessionEntity } from './entity';

export class AuthMapper {
  public static toEntity(dto: AuthSessionDTO): AuthSessionEntity {
    return new AuthSessionEntity({
      user: dto.user ? CustomerMapper.toEntity(dto.user) : null,
      token: dto.token,
      isAuthenticated: dto.is_authenticated,
    });
  }

  public static toDTO(entity: AuthSessionEntity): AuthSessionDTO {
    return {
      user: entity.user ? CustomerMapper.toDTO(entity.user) : null,
      token: entity.token,
      is_authenticated: entity.isAuthenticated,
    };
  }
}
