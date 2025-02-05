import { JwtVerifyOptions } from "@nestjs/jwt";

export interface IJwtServicePayload {
  username: string;
}

export interface IJwtService {
  checkToken(token: string): Promise<any>;
  createToken(payload: IJwtServicePayload, secret: string, expiresIn: string): string;
  decode(token: string): object
  verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T;
}

export interface IJwtResetPasswordPayload {
  username: string;
  email?: string;
  type?: string;
  timestamp?: number;
}