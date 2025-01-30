'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Item.init({
    valor_unitario: DataTypes.DECIMAL,
    descricao: DataTypes.STRING,
    taxa_icms_entrada: DataTypes.DECIMAL,
    taxa_icms_saida: DataTypes.DECIMAL,
    comissao: DataTypes.DECIMAL,
    ncm: DataTypes.STRING,
    cst: DataTypes.STRING,
    cfop: DataTypes.INTEGER,
    ean: DataTypes.STRING,
    excluido: DataTypes.BOOLEAN,
    criado_em: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};