import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import Ncm from "./ncm.js";
import CstIcms from "./csticms.js";
import Cfop from "./cfop.js";

const Item = sequelize.define(
  "Item",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    valor_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    descricao: { type: DataTypes.STRING(255), allowNull: false },
    taxa_icms_entrada: { type: DataTypes.DECIMAL(5, 2) },
    taxa_icms_saida: { type: DataTypes.DECIMAL(5, 2) },
    comissao: { type: DataTypes.DECIMAL(5, 2) },
    ncm: { type: DataTypes.STRING(8), references: { model: Ncm, key: "codncm" } },
    cst: { type: DataTypes.STRING(10), references: { model: CstIcms, key: "codcst" } },
    cfop: { type: DataTypes.INTEGER, references: { model: Cfop, key: "codcfop" } },
    ean: { type: DataTypes.STRING(13), unique: true, allowNull: false },
    excluido: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "tb_itens", timestamps: false }
);

export default Item;
