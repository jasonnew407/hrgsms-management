import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // adjust the path to your Sequelize instance

const Hotel = sequelize.define('Hotel', {
  hotel_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  hotel_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  branch_location: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  tax_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  standard_checkin_time: {
    type: DataTypes.TIME,
    allowNull: true,
    defaultValue: '14:00:00'
  },
  standard_checkout_time: {
    type: DataTypes.TIME,
    allowNull: true,
    defaultValue: '11:00:00'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'hotels',
  timestamps: false, // because created_at and updated_at are manually defined
  underscored: true
});
Hotel.associate = (models) => {
  Hotel.hasMany(models.User, {
    foreignKey: 'hotel_id',
    as: 'staff'
  });
};

export default Hotel;
