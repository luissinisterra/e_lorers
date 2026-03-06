import { DataTypes, Model, Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "postgres", 
  host: "localhost",
  username: "your_username",
  password: "your_password",
  database: "your_database",
});

export class User extends Model {
  public id!: number;
  public name!: string;
  public username!: string;
  public password!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
  },
);
