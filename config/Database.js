import { Sequelize } from "sequelize";

const db = new Sequelize("bookstore", "root", "990099", {
  host: "127.0.0.1",
  dialect: "mysql",
});

export default db;
