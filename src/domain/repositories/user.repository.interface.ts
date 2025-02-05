import { UserM } from '../model/user';
import { IBaseRepository } from './base.repository.interface';

export interface UserRepository extends IBaseRepository<any>{
  getUserByUsername(username: string): Promise<UserM>;
  updateLastLogin(username: string): Promise<void>;
  updateRefreshToken(username: string, refreshToken: string): Promise<void>;
}
