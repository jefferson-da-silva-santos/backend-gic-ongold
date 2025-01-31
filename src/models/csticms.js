import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

const CstIcms = sequelize.define(
  "CstIcms",
  {
    codcst: { type: DataTypes.STRING(10), primaryKey: true },
    descricao: { type: DataTypes.STRING(255) },
    regime: { type: DataTypes.STRING(1) },
  },
  { tableName: "tb_csticms", timestamps: false }
);

export default CstIcms;
