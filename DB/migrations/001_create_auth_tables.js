/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema
    .createTable('users_auth', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('email', 255).unique().notNullable();
      table.string('password_hash', 255).notNullable();
      table.string('role', 50).defaultTo('user');
      table.boolean('email_verified').defaultTo(false);
      table.timestamp('last_login_at');
      table.timestamps(true, true);
    })
    .createTable('refresh_tokens', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').notNullable().references('id').inTable('users_auth').onDelete('CASCADE');
      table.string('token', 255).unique().notNullable();
      table.timestamp('expires_at').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('api_keys', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').notNullable().references('id').inTable('users_auth').onDelete('CASCADE');
      table.string('name', 100).notNullable();
      table.string('key_hash', 255).unique().notNullable();
      table.string('prefix', 10).notNullable();
      table.specificType('scopes', 'text[]').defaultTo('{}');
      table.timestamp('last_used_at');
      table.timestamp('expires_at');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema
    .dropTableIfExists('api_keys')
    .dropTableIfExists('refresh_tokens')
    .dropTableIfExists('users_auth');
};
