import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const ServiceCatalog = sequelize.define('ServiceCatalog', {
    service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hotels', // assuming you have a Hotels table
        key: 'hotel_id'
      }
    },
    service_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    service_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'service_catalogs',
    timestamps: true, // enables createdAt and updatedAt
    underscored: true, // uses snake_case for auto-generated fields
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

ServiceCatalog.associate = (models) => {
  ServiceCatalog.hasMany(models.UserService, {
    foreignKey: 'service_id',
    as: 'userServices' // optional alias
  });
};

export default ServiceCatalog;