import { AuthResponse, RegisterRequest, User } from '../../models/user.model';

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  register(data: RegisterRequest): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
  getMe(): Promise<User>;
  updateProfile(data: UpdateProfileRequest): Promise<User>;
  deleteAccount(): Promise<void>;
}
