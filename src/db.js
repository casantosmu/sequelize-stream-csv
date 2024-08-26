import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: "postgres",
});

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export { sequelize, User };
