import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

const Ncm = sequelize.define(
  "Ncm",
  {
    codncm: { type: DataTypes.STRING(8), primaryKey: true },
    nomencm: { type: DataTypes.TEXT, allowNull: false },
    aliquota: { type: DataTypes.STRING(3) },
  },
  { tableName: "tb_ncm", timestamps: false }
);

export default Ncm;
