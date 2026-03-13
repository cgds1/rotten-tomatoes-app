import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IAuthService, UpdateProfileRequest } from './interfaces/auth-service.interface';
import { AuthResponse, RegisterRequest, User } from '../models/user.model';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

const REFRESH_TOKEN_KEY = 'auth_refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthHttpService implements IAuthService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
  ) {}

  async login(email: string, password: string): Promise<AuthResponse> {
    return firstValueFrom(
      this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { email, password }),
    );
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return firstValueFrom(
      this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, data),
    );
  }

  async logout(): Promise<void> {
    await firstValueFrom(
      this.http.post<void>(`${this.baseUrl}/auth/logout`, {}),
    );
  }

  async refreshToken(): Promise<string> {
    const refreshToken = await this.storage.get<string>(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const res = await firstValueFrom(
      this.http.post<{ accessToken: string; refreshToken: string }>(
        `${this.baseUrl}/auth/refresh`,
        { refreshToken },
      ),
    );

    // Store the new refresh token
    await this.storage.set(REFRESH_TOKEN_KEY, res.refreshToken);
    return res.accessToken;
  }

  async getMe(): Promise<User> {
    return firstValueFrom(
      this.http.get<User>(`${this.baseUrl}/users/me`),
    );
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    return firstValueFrom(
      this.http.patch<User>(`${this.baseUrl}/users/me`, data),
    );
  }

  async deleteAccount(): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${this.baseUrl}/users/me`),
    );
  }
}
