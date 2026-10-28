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

  it('sends through Brevo using the verified sender address and server-side API key', async () => {
    const service = new MailService({
      get: (key: string) =>
        key === 'BREVO_API_KEY'
          ? 'brevo-test-key'
          : key === 'MAIL_FROM'
            ? 'StudyConnect <student@gmail.com>'
            : undefined,
    } as unknown as ConfigService);
    const send = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ messageId: 'message-id' }), { status: 201 }),
    );

    await expect(
      service.sendVerificationOtp('learner@example.test', '123456', 'Ada'),
    ).resolves.toBe(true);

    expect(send).toHaveBeenCalledWith('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': 'brevo-test-key',
        'content-type': 'application/json',
      },
      body: expect.stringContaining('"email":"learner@example.test"'),
    });
    const requestBody = JSON.parse(send.mock.calls[0][1]?.body as string);
    expect(requestBody.sender).toEqual({
      name: 'StudyConnect',
      email: 'student@gmail.com',
    });
    expect(requestBody.subject).toContain('123456');
    expect(requestBody.htmlContent).toContain('123456');
  });

  it('does not treat Brevo rejection as successful email delivery', async () => {
    const service = new MailService({
      get: (key: string) =>
        key === 'BREVO_API_KEY'
          ? 'brevo-test-key'
          : key === 'MAIL_FROM'
            ? 'student@gmail.com'
            : undefined,
    } as unknown as ConfigService);
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 403 }));

    await expect(
      service.sendPasswordResetOtp('learner@example.test', '654321'),
    ).rejects.toThrow(ServiceUnavailableException);
  });
});
