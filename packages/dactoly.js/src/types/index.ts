export interface DactolyClientConfig {
  baseUrl?: string;
  token: string;
}

export type UserStatus = 'idle' | 'offline' | 'online';
