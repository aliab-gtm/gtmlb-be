const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedExecutableTypes = [
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

module.exports = ({ env }) => ({
  // Invites and password resets go out from here. With SMTP_HOST unset the
  // provider is left at Strapi's sendmail default, which will not deliver from
  // a container — the invite link is always stored on the record and shown in
  // the admin, so a failed send costs the desk a copy-paste, not the client.
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST'),
        port: env.int('SMTP_PORT', 587),
        secure: env.int('SMTP_PORT', 587) === 465,
        auth: env('SMTP_USER')
          ? { user: env('SMTP_USER'), pass: env('SMTP_PASSWORD') }
          : undefined,
      },
      settings: {
        defaultFrom: env('SMTP_FROM', 'GTM <no-reply@gtmlb.com>'),
        defaultReplyTo: env('SMTP_REPLY_TO', env('SMTP_FROM', 'no-reply@gtmlb.com')),
      },
    },
  },
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
      },
    },
  },
  upload: {
    config: {
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes: deniedExecutableTypes,
      },
    },
  },
});
