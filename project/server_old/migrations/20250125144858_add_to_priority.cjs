/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =  async function(knex) {
await knex.schema.alterTable('todos', (table) => {
    table.integer('priority').notNullable().unsigned().defaultTo(0)
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
