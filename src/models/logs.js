import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  level: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Define automaticamente a data/hora atual
  }
}, {
  tableName: 'tb_logs',
  timestamps: false, // Não cria os campos createdAt e updatedAt
});

export default Log;
