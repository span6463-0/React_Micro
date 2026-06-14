/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('id').primary();
      table.string('name', 255).notNullable();
      table.string('email', 255).unique().notNullable();
      table.string('phone', 50);
      table.text('bio');
      table.string('avatar_url', 500);
      table.string('role', 50).defaultTo('user');
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('roles', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name', 50).unique().notNullable();
      table.text('description');
      table.specificType('permissions', 'text[]').defaultTo('{}');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('user_roles', (table) => {
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.uuid('role_id').notNullable().references('id').inTable('roles').onDelete('CASCADE');
      table.timestamp('assigned_at').defaultTo(knex.fn.now());
      table.primary(['user_id', 'role_id']);
    })
    .createTable('user_preferences', (table) => {
      table.uuid('user_id').primary().references('id').inTable('users').onDelete('CASCADE');
      table.string('language', 10).defaultTo('en');
      table.string('timezone', 50).defaultTo('UTC');
      table.string('theme', 20).defaultTo('light');
      table.boolean('email_notifications').defaultTo(true);
      table.boolean('push_notifications').defaultTo(false);
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema
    .dropTableIfExists('user_preferences')
    .dropTableIfExists('user_roles')
    .dropTableIfExists('roles')
    .dropTableIfExists('users');
};
