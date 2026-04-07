import mysql from 'mysql2/promise';

function normalizeMultiline(value = '') {
  return value.replace(/\\n/g, '\n').trim();
}

function getSslConfig() {
  const sslEnabled = process.env.MYSQL_SSL !== 'false';
  if (!sslEnabled) return undefined;

  const caFromText = process.env.MYSQL_CA_CERT || process.env.DB_SSL_CA || '';
  const caFromBase64 = process.env.MYSQL_CA_CERT_BASE64
    ? Buffer.from(process.env.MYSQL_CA_CERT_BASE64, 'base64').toString('utf8')
    : '';

  const ca = normalizeMultiline(caFromText || caFromBase64);

  return {
    rejectUnauthorized: process.env.MYSQL_SSL_REJECT_UNAUTHORIZED !== 'false',
    ...(ca ? { ca } : {}),
  };
}

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || process.env.DB_HOST,
  port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
  user: process.env.MYSQL_USER || process.env.DB_USER,
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME,
  ssl: getSslConfig(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;