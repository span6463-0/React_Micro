/** @type { import("knex").Knex.Config } */
export default {
  client: 'pg',
  connection: {
    host: process.env.USER_DB_HOST || 'localhost',
    port: Number(process.env.USER_DB_PORT) || 5434,
    database: process.env.USER_DB_NAME || 'user_db',
    user: process.env.USER_DB_USER || 'postgres',
    password: process.env.USER_DB_PASSWORD || 'postgres',
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations_user',
    loadExtensions: ['.js'],
  },
};
