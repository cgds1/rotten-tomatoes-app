import { Injectable } from '@angular/core';
import { IAuthService } from './interfaces/auth-service.interface';
import { AuthResponse, RegisterRequest, User } from '../models/user.model';
import { MOCK_USERS, MockUser } from '../mocks/mock-users';

@Injectable({ providedIn: 'root' })
export class AuthMockService implements IAuthService {
  private users: MockUser[] = [...MOCK_USERS];
  private currentUser: User | null = null;
  private currentToken: string | null = null;

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const { password: _, ...userData } = user;
    this.currentUser = userData;
    this.currentToken = `mock-token-${user.id}-${Date.now()}`;

    return {
      accessToken: this.currentToken,
      refreshToken: `mock-refresh-${user.id}-${Date.now()}`,
      user: userData,
    };
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const exists = this.users.find(u => u.email === data.email);
    if (exists) {
      throw new Error('El email ya está registrado');
    }

    const newUser: MockUser = {
      id: `u${this.users.length + 1}`,
      email: data.email,
      name: data.name,
      role: 'USER',
      password: data.password,
    };

    this.users.push(newUser);

    const { password: _, ...userData } = newUser;
    this.currentUser = userData;
    this.currentToken = `mock-token-${newUser.id}-${Date.now()}`;

    return {
      accessToken: this.currentToken,
      refreshToken: `mock-refresh-${newUser.id}-${Date.now()}`,
      user: userData,
    };
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    this.currentToken = null;
  }

  async refreshToken(): Promise<string> {
    if (!this.currentUser) {
      throw new Error('No hay sesión activa');
    }
    this.currentToken = `mock-token-${this.currentUser.id}-${Date.now()}`;
    return this.currentToken;
  }

  async getMe(): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No hay sesión activa');
    }
    return this.currentUser;
  }
}
