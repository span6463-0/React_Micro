/** @type { import("knex").Knex.Config } */
export default {
  client: 'pg',
  connection: {
    host: process.env.AUTH_DB_HOST || 'localhost',
    port: Number(process.env.AUTH_DB_PORT) || 5433,
    database: process.env.AUTH_DB_NAME || 'auth_db',
    user: process.env.AUTH_DB_USER || 'postgres',
    password: process.env.AUTH_DB_PASSWORD || 'postgres',
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations_auth',
    loadExtensions: ['.js'],
  },
};
