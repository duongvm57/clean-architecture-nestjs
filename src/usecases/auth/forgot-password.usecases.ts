import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPasswordDto } from '../../infrastructure/controllers/auth/auth-dto.class';
import { IJwtService, IJwtResetPasswordPayload } from '../../domain/adapters/jwt.interface';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtVerifyOptions } from '@nestjs/jwt';
import { IBcryptService } from 'src/domain/adapters/bcrypt.interface';

export class ForgotPasswordUsecases {
  constructor(
    private readonly mailerService: MailerService,
    private readonly jwtTokenService: IJwtService,
    private readonly config: EnvironmentConfigService,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: IBcryptService,
  ) {}

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepository.findOneByFilter({ email: forgotPasswordDto.email });
    if (!user) {
      return;
    }
    
    const payload: IJwtResetPasswordPayload = { 
      username: user.username,
      email: user.email,
      type: 'password_reset',
      timestamp: Date.now()
    };

    const secret = this.config.getJwtSecret();
    const expiresIn = this.config.getJwtExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    const resetLink = `http://${this.config.getFrontendUrl()}/reset-password?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: forgotPasswordDto.email,
        subject: 'Yêu cầu đặt lại mật khẩu',
        template: 'forgot-password',
        context: {
          resetLink,
          appName: 'Your App Name',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Không thể gửi email reset password');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = this.jwtTokenService.decode(token) as IJwtResetPasswordPayload;
      if (!decoded || !decoded.email || decoded.type !== 'password_reset') {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      const isExpired = (Date.now() - decoded.timestamp) > Number.parseInt(this.config.getJwtExpirationTime());
      if (isExpired) {
        throw new UnauthorizedException('Token đã hết hạn');
      }

      const user = await this.userRepository.findOneByFilter({ email: decoded.email });
      if (!user) {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      const hashedPassword = await this.bcryptService.hash(newPassword);
      user.password = hashedPassword;

      await this.userRepository.update(user.id, { password: hashedPassword });

    } catch (error) {
      throw error instanceof UnauthorizedException
        ? error
        : new InternalServerErrorException('Đã xảy ra lỗi khi đặt lại mật khẩu');
    }
  }
}
