export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe GoBarber <equipe@gobarber.com>',
  },
};

// Mailtrap (DEV) > Vamos utilizar este para desenvolvimento
// Se liberado em Produção deve utilizar outro
