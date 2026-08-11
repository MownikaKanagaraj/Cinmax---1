import type { CustomerProfile, UserRole } from '@cinmax/types';

export interface AuthSessionProps {
  user: CustomerProfile | null;
  token: string | null;
  isAuthenticated: boolean;
}

export class AuthSessionEntity implements AuthSessionProps {
  public user: CustomerProfile | null;
  public token: string | null;
  public isAuthenticated: boolean;

  constructor(props: AuthSessionProps) {
    this.user = props.user;
    this.token = props.token;
    this.isAuthenticated = props.isAuthenticated;
  }
}

export interface UserEntityProps {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

export class UserEntity implements UserEntityProps {
  public id: string;
  public email: string;
  public firstName?: string;
  public lastName?: string;
  public avatarUrl?: string;
  public role: UserRole;
  public createdAt: string;

  constructor(props: UserEntityProps) {
    this.id = props.id;
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.avatarUrl = props.avatarUrl;
    this.role = props.role;
    this.createdAt = props.createdAt;
  }
}
