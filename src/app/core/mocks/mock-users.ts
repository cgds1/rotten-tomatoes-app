import { User } from '../models/user.model';

export interface MockUser extends User {
  password: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'u1',
    email: 'carlos@example.com',
    name: 'Carlos García',
    role: 'USER',
    password: 'password123',
  },
  {
    id: 'u2',
    email: 'maria@example.com',
    name: 'María López',
    role: 'USER',
    password: 'password123',
  },
  {
    id: 'u3',
    email: 'juan@example.com',
    name: 'Juan Martínez',
    role: 'USER',
    password: 'password123',
  },
  {
    id: 'u4',
    email: 'critic.ana@example.com',
    name: 'Ana Rodríguez',
    role: 'CRITIC',
    password: 'password123',
  },
  {
    id: 'u5',
    email: 'critic.pedro@example.com',
    name: 'Pedro Sánchez',
    role: 'CRITIC',
    password: 'password123',
  },
];
