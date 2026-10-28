import { Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../services/mail.service';

describe('MailService', () => {
  afterEach(() => jest.restoreAllMocks());

  it('does not log verification codes when email delivery is unconfigured', async () => {
    const warning = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const service = new MailService({
      get: () => undefined,
    } as unknown as ConfigService);

    await expect(
      service.sendVerificationOtp('student@example.test', '123456', 'Ada'),
    ).rejects.toThrow(ServiceUnavailableException);
    expect(warning).toHaveBeenCalledWith(expect.not.stringContaining('123456'));
  });

  it('escapes user supplied names before adding them to email HTML', async () => {
    const service = new MailService({
      get: (key: string) =>
        key === 'RESEND_API_KEY' ? 'test-key' : 'study@example.test',
    } as unknown as ConfigService);
    const send = jest
      .fn()
      .mockResolvedValue({ data: { id: 'email-id' }, error: null });
    (service as any).resend = { emails: { send } };

    await service.sendVerificationOtp(
      'student@example.test',
      '123456',
      '<script>alert(1)</script>',
    );

    expect(send.mock.calls[0][0].html).toContain(
      '&lt;script&gt;alert(1)&lt;/script&gt;',
    );
    expect(send.mock.calls[0][0].html).not.toContain(
      '<script>alert(1)</script>',
    );
  });

  it('reports provider errors instead of treating them as successful delivery', async () => {
    const service = new MailService({
      get: (key: string) =>
        key === 'RESEND_API_KEY' ? 'test-key' : 'study@example.test',
    } as unknown as ConfigService);
    (service as any).resend = {
      emails: {
        send: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'provider rejected the request' },
        }),
      },
    };

    await expect(
      service.sendPasswordResetOtp('student@example.test', '654321'),
    ).rejects.toThrow(ServiceUnavailableException);
  });
});
