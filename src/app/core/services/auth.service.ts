import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';
import { AUTH_SERVICE } from './service-tokens';
import { IAuthService } from './interfaces/auth-service.interface';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);

  readonly currentUser$: Observable<User | null> = this.userSubject.asObservable();
  readonly isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(map((u) => !!u));

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  get isCritic(): boolean {
    return this.userSubject.value?.role === 'CRITIC';
  }

  constructor(
    private storage: StorageService,
    @Inject(AUTH_SERVICE) private authBackend: IAuthService,
  ) {}

  async loadSession(): Promise<void> {
    const token = await this.storage.get<string>(TOKEN_KEY);
    const user = await this.storage.get<User>(USER_KEY);
    if (token && user) {
      this.userSubject.next(user);
    }
  }

  async login(email: string, password: string): Promise<void> {
    const res = await this.authBackend.login(email, password);
    await this.saveSession(res.accessToken, res.refreshToken, res.user);
  }

  async register(name: string, email: string, password: string): Promise<void> {
    const res = await this.authBackend.register({ name, email, password });
    await this.saveSession(res.accessToken, res.refreshToken, res.user);
  }

  async logout(): Promise<void> {
    await this.authBackend.logout();
    await this.storage.remove(TOKEN_KEY);
    await this.storage.remove(REFRESH_TOKEN_KEY);
    await this.storage.remove(USER_KEY);
    this.userSubject.next(null);
  }

  async getToken(): Promise<string | null> {
    return this.storage.get<string>(TOKEN_KEY);
  }

  async refreshToken(): Promise<string | null> {
    try {
      const newToken = await this.authBackend.refreshToken();
      await this.storage.set(TOKEN_KEY, newToken);
      return newToken;
    } catch {
      await this.logout();
      return null;
    }
  }

  private async saveSession(
    accessToken: string,
    refreshToken: string,
    user: User,
  ): Promise<void> {
    await this.storage.set(TOKEN_KEY, accessToken);
    await this.storage.set(REFRESH_TOKEN_KEY, refreshToken);
    await this.storage.set(USER_KEY, user);
    this.userSubject.next(user);
  }
}
