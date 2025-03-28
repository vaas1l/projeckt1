import mongoose from 'mongoose'
class Database {
  static _database

  constructor() {
    const dbUrl = 'mongodb://localhost:27017/todos'
    if (dbUrl) {
      mongoose
        .connect(dbUrl)
        .then(() => console.log("Connected with database"))
        .catch((err) => {
          console.error(
            "Error connecting to database:",
            err
          )
        })
    } else {
      console.error("Database URL is not provided")
    }
  }

  static getInstance() {
    if (!this._database) {
      this._database = new Database()
    }
    return this._database
  }
}

export default Database