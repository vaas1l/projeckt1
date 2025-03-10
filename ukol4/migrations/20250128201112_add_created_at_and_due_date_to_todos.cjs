/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.up = async function(knex) {
  return knex.schema.alterTable('todos', (table) => {
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Дата створення
    table.timestamp('due_date').nullable(); // Кінцева дата (може бути null)
  });
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.down = async function(knex) {
  return knex.schema.alterTable('todos', (table) => {
    table.dropColumn('created_at');
    table.dropColumn('due_date');
  });
}
