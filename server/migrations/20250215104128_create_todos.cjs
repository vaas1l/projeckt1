
exports.up = function (knex) {
    return knex.schema.createTable('todos', (table) => {
      table.increments('id').primary();
      table.string('text').notNullable();
      table.boolean('completed').defaultTo(false);
      table.string('akce').defaultTo('Low');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.date('dueDate');
    });
  };

  exports.down = function (knex) {
    return knex.schema.dropTable('todos');
  };
