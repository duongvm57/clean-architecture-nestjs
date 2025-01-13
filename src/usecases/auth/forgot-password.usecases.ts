import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPasswordDto } from '../../infrastructure/controllers/auth/auth-dto.class';

export class ForgotPasswordUsecases {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async execute(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const resetLink = `http://your-frontend-url/reset-password?token=some-token`; // Thay thế bằng logic tạo token của bạn

    await this.mailerService.sendMail({
      to: forgotPasswordDto.email,
      subject: 'Yêu cầu đặt lại mật khẩu',
      template: 'forgot-password',
      context: {
        resetLink,
        appName: 'Your App Name',
      },
    });
  }
}
