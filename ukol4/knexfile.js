// knexfile.js
export default {
    client: 'sqlite3',
    connection: {
      filename: './todo_db.sqlite',
    },
    useNullAsDefault: false,
  }