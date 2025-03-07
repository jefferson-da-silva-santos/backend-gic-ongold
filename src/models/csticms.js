import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

const CstIcms = sequelize.define(
  "CstIcms",
  {
    idcst: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    codcst: { type: DataTypes.STRING(10), allowNull: false },
    descricao: { type: DataTypes.STRING(255) },
    regime: { type: DataTypes.STRING(1) },
  },
  { tableName: "tb_csticms", timestamps: false }
);

export default CstIcms;
