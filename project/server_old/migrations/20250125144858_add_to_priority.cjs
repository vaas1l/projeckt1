/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('todos', function(table) {
        table.integer('priority').defaultTo(2); 
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down =  async function(knex) {
    await knex.schema.alterTable('todos', (table) => {
        table.dropColumn('priority')
        })
    };
