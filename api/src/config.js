export const config = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET ?? 'chave-de-desenvolvimento-nao-use-em-producao',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:4200',
};

if (!process.env.JWT_SECRET) {
  console.warn('[config] JWT_SECRET não definido. Usando chave de desenvolvimento.');
}
