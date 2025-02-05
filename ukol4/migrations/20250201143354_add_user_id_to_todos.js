/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.table('todos', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    });
  }

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.table('todos', (table) => {
      table.dropColumn('user_id');
    });
  }
