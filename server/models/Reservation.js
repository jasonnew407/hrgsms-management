import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Reservation = sequelize.define('Reservation', {
  reservation_id: {
    type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    reservation_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    guest_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'guests',
        key: 'guest_id'
      },
      allowNull: false
    },
    room_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'rooms',
        key: 'room_id'
      },
      allowNull: false
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'hotels',
        key: 'hotel_id'
      },
      allowNull: false
    },
    check_in_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    check_out_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    number_of_guests: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_rate_at_booking: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    booking_status: {
      type: DataTypes.ENUM('Booked', 'Checked_In', 'Checked_Out', 'Cancelled'),
      defaultValue: 'Booked'
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
    tableName: 'reservations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'reservations_room_id_check_in_date_check_out_date_booking_status',
        fields: ['room_id', 'check_in_date', 'check_out_date', 'booking_status']
      },
      {
        name: 'reservations_check_in_date_index',
        fields: ['check_in_date']
      },
      {
        name: 'reservations_check_out_date_index',
        fields: ['check_out_date']
      },
      {
        name: 'reservations_booking_status_index',
        fields: ['booking_status']
      }
    ]
  });

  Reservation.associate = function(models) {
    Reservation.belongsTo(models.Guest, {
      foreignKey: 'guest_id',
      as: 'guest' // singular since one reservation belongs to one guest
    });
    
    Reservation.belongsTo(models.Room, {
      foreignKey: 'room_id',
      as: 'room' // singular since one reservation belongs to one room
    });
  };

export default Reservation;