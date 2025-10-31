import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const ServiceUsage = sequelize.define('ServiceUsage', {
    usage_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    reservation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'reservations', // assuming you have a Reservations table
        key: 'reservation_id'
      }
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'service_catalogs',
        key: 'service_id'
      }
    },
    service_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    unit_price_at_usage: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total_charge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'service_usages',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false // only has created_at, not updated_at
  });

ServiceUsage.associate = (models) => {
  ServiceUsage.belongsTo(models.Reservation, {
    foreignKey: 'reservation_id',
    as: 'reservation'
  });
  ServiceUsage.belongsTo(models.ServiceCatalog, {
    foreignKey: 'service_id',
    as: 'service'
  });
};

export default ServiceUsage;