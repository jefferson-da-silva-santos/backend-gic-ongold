'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ncm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ncm.init({
    codncm: DataTypes.STRING,
    nomencm: DataTypes.TEXT,
    aliquota: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ncm',
  });
  return Ncm;
};