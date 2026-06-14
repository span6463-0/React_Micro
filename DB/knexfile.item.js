/** @type { import("knex").Knex.Config } */
export default {
  client: 'pg',
  connection: {
    host: process.env.ITEM_DB_HOST || 'localhost',
    port: Number(process.env.ITEM_DB_PORT) || 5435,
    database: process.env.ITEM_DB_NAME || 'item_db',
    user: process.env.ITEM_DB_USER || 'postgres',
    password: process.env.ITEM_DB_PASSWORD || 'postgres',
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations_item',
    loadExtensions: ['.js'],
  },
};
