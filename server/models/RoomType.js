import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";


const RoomType = sequelize.define('RoomType', {
    room_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    max_capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    base_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    amenities: {
      type: DataTypes.JSON,
      allowNull: true
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true
      }
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
    tableName: 'room_types',
    timestamps: false, // We're using custom created_at/updated_at fields
    indexes: [
      {
        unique: true,
        fields: ['type_name'],
        name: 'type_name'
      }
    ]
  });

  RoomType.associate = function(models) {
    RoomType.hasMany(models.Room, {
      foreignKey: 'room_type_id',
      as: 'rooms'
    });
  };

export default RoomType;