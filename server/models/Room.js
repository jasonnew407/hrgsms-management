import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";


const Room = sequelize.define('Room', {
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hotels',
        key: 'hotel_id'
      }
    },
    room_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'room_types',
        key: 'room_type_id'
      }
    },
    room_number: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'maintenance', 'cleaning'),
      defaultValue: 'available'
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    tableName: 'rooms',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['hotel_id', 'room_number'],
        name: 'rooms_hotel_id_room_number'
      }
    ]
  });

  Room.associate = function(models) {
    Room.belongsTo(models.Hotel, {
      foreignKey: 'hotel_id',
      onDelete: 'CASCADE'
    });
    
    Room.belongsTo(models.RoomType, {
      foreignKey: 'room_type_id'
    });
    
  };

export default Room;

