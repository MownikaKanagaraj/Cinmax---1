import type { CustomerDTO } from '../customers/dto';

export interface AuthSessionDTO {
  user: CustomerDTO | null;
  token: string | null;
  is_authenticated: boolean;
}
