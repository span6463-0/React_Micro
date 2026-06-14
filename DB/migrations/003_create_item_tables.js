/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema
    .createTable('item_categories', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name', 100).unique().notNullable();
      table.text('description');
      table.uuid('parent_id').references('id').inTable('item_categories');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('items', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name', 255).notNullable();
      table.text('description');
      table.string('category', 100).notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.string('sku', 100).unique().notNullable();
      table.integer('stock').defaultTo(0);
      table.string('status', 20).defaultTo('Draft');
      table.uuid('created_by');
      table.uuid('updated_by');
      table.timestamps(true, true);
    })
    .createTable('item_history', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('item_id').notNullable().references('id').inTable('items').onDelete('CASCADE');
      table.string('action', 20).notNullable();
      table.jsonb('changes');
      table.uuid('performed_by');
      table.timestamp('performed_at').defaultTo(knex.fn.now());
    })
    .createTable('item_tags', (table) => {
      table.uuid('item_id').notNullable().references('id').inTable('items').onDelete('CASCADE');
      table.string('tag', 50).notNullable();
      table.primary(['item_id', 'tag']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema
    .dropTableIfExists('item_tags')
    .dropTableIfExists('item_history')
    .dropTableIfExists('items')
    .dropTableIfExists('item_categories');
};
