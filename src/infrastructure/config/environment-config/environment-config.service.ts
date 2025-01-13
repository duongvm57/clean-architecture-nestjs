import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../../domain/config/database.interface';
import { JWTConfig } from '../../../domain/config/jwt.interface';

@Injectable()
export class EnvironmentConfigService implements DatabaseConfig, JWTConfig {
  constructor(private configService: ConfigService) {}
  
  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  getJwtRefreshExpirationTime(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST');
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT');
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('DATABASE_USER');
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD');
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME');
  }

  getDatabaseSchema(): string {
    return this.configService.get<string>('DATABASE_SCHEMA');
  }

  getDatabaseSync(): boolean {
    return this.configService.get<boolean>('DATABASE_SYNCHRONIZE');
  }

  getMailerHost(): string {
    return this.configService.get<string>('MAILER_HOST');
  }

  getMailerPort(): number {
    return this.configService.get<number>('MAILER_PORT');
  }

  getMailerUser(): string {
    return this.configService.get<string>('MAILER_USER');
  }

  getMailerPassword(): string {
    return this.configService.get<string>('MAILER_PASSWORD');
  }

  getMailerSecure(): boolean {
    return this.configService.get<boolean>('MAILER_SECURE');
  }

  getMailerDefaultName(): string {
    return this.configService.get<string>('MAILER_DEFAULT_NAME');
  }

  getMailerDefaultMail(): string {
    return this.configService.get<string>('MAILER_DEFAULT_EMAIL');
  }
}
