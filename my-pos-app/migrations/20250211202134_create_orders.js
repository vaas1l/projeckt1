/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('orders', (table) => {
      table.increments('id').primary();
      table.integer('service_id').unsigned().references('id').inTable('services').onDelete('CASCADE');
      table.integer('quantity').notNullable().defaultTo(1);
      table.decimal('total_price', 10, 2).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('orders');
  };
