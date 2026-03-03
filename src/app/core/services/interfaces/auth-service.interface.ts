import { AuthResponse, RegisterRequest, User } from '../../models/user.model';

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  register(data: RegisterRequest): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
  getMe(): Promise<User>;
}
