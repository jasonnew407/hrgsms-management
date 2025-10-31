import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Guest = sequelize.define('Guest', {
  guestId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'guest_id'
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  idType: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  idNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  nationality: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  registeredAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'guests',
  timestamps: false,
  underscored: true,
});

 Guest.associate = function(models) {
    Guest.hasMany(models.Reservation, {
      foreignKey: 'guest_id',
      as: 'reservations'
    });
  };

 export default Guest;