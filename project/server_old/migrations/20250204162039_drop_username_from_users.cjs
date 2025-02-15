/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.up = async function (knex) {
  await knex.schema.table('users', (table) => {
    table.dropColumn('username');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.down = async function (knex) {
  await knex.schema.table('users', (table) => {
    table.string('username').notNullable();
  });
};