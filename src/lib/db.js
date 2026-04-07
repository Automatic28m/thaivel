import mysql from 'mysql2/promise';

function env(name) {
  return process.env[name];
}

function normalizeMultiline(value = '') {
  return value.replace(/\\n/g, '\n').trim();
}

function getSslConfig() {
  const sslEnabled = env('MYSQL_SSL') !== 'false';
  if (!sslEnabled) return undefined;

  const caFromText = env('MYSQL_CA_CERT') || env('DB_SSL_CA') || '';
  const caFromBase64 = env('MYSQL_CA_CERT_BASE64')
    ? Buffer.from(env('MYSQL_CA_CERT_BASE64'), 'base64').toString('utf8')
    : '';

  const ca = normalizeMultiline(caFromText || caFromBase64);

  return {
    rejectUnauthorized: env('MYSQL_SSL_REJECT_UNAUTHORIZED') !== 'false',
    ...(ca ? { ca } : {}),
  };
}

const pool = mysql.createPool({
  host: env('MYSQL_HOST') || env('DB_HOST'),
  port: Number(env('MYSQL_PORT') || env('DB_PORT') || 3306),
  user: env('MYSQL_USER') || env('DB_USER'),
  password: env('MYSQL_PASSWORD') || env('DB_PASSWORD'),
  database: env('MYSQL_DATABASE') || env('DB_NAME'),
  ssl: getSslConfig(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;