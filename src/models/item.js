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
    ncm_id: { type: DataTypes.STRING(8), allowNull: false },
    cst_id: { type: DataTypes.STRING(10), allowNull: false },
    cfop_id: { type: DataTypes.INTEGER, allowNull: false },
    ean: { type: DataTypes.STRING(13), unique: true, allowNull: false },
    excluido: { type: DataTypes.BOOLEAN, defaultValue: false },
    criado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    excluido_em: { type: DataTypes.DATE },
  },
  { tableName: "tb_itens", timestamps: false }
);

Item.belongsTo(Ncm, {
  foreignKey: "ncm_id",
  targetKey: "idncm", // Deve referenciar a PRIMARY KEY de tb_ncm
  as: "ncm"
});

Item.belongsTo(CstIcms, {
  foreignKey: "cst_id",
  targetKey: "idcst", // Deve referenciar a PRIMARY KEY de tb_csticms
  as: "csticms"
});

Item.belongsTo(Cfop, {
  foreignKey: "cfop_id",
  targetKey: "idcfop", // Deve referenciar a PRIMARY KEY de tb_cfop
  as: "cfopinfo"
});


export default Item;