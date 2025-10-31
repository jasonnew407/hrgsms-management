import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const ReservationRefund = sequelize.define('ReservationRefund', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reservation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'reservations', // or your Reservation model
      key: 'reservation_id',
      onDelete: 'CASCADE'
    }
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Refunded', 'Rejected'),
    allowNull: true,
    defaultValue: 'Pending'
  },
  
  rejection_reason: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  approved_amount:{
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'reservation_refunds',
  timestamps: false, // Since your table doesn't have created_at/updated_at
  underscored: true, // Use snake_case for field names
});
ReservationRefund.associate = (models) => {
    ReservationRefund.belongsTo(models.Reservation, {
        foreignKey: 'reservation_id',
        as: 'reservation'
    });
};

export default ReservationRefund;