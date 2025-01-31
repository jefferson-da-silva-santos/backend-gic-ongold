'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cfop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cfop.init({
    codcfop: DataTypes.INTEGER,
    descricaocfop: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cfop',
  });
  return Cfop;
};