import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: (config: EnvironmentConfigService) => ({
        transport: {
          host: config.getMailerHost(),
          port: config.getMailerPort(),
          secure: config.getMailerSecure(),
          auth: {
            user: config.getMailerUser(),
            pass: config.getMailerPassword(),
          },
        },
        template: {
          dir: join(__dirname, '..', '..', '..', 'templates', 'mail'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        defaults: {
          from: `"${config.getMailerDefaultName()}" <${config.getMailerDefaultMail()}>`,
        },
      }),
    }),
  ],
  exports: [MailerModule],
})
export class MailerConfigModule {}