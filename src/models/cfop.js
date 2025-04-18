import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

const Cfop = sequelize.define(
  "Cfop",
  {
    idcfop: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    codcfop: { type: DataTypes.INTEGER, allowNull: false },
    descricaocfop: { type: DataTypes.STRING(400) },
    comentariocfop: { type: DataTypes.TEXT },
    codcop: { type: DataTypes.STRING(10), allowNull: false },
    codigocta: { type: DataTypes.STRING(255) },
    cfopid: { type: DataTypes.INTEGER },
  },
  { tableName: "tb_cfop", timestamps: false }
);

export default Cfop;
