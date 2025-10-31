import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import Room from './Room.js';

const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verification_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    verification_code_expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    user_role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_roles',
        key: 'role_id'
      }
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'hotels',
        key: 'id'
      }
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // No updated_at column in your schema
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
  });
  User.associate = function(models) {
    User.belongsTo(models.UserRole, { foreignKey: 'user_role_id', as: 'role' });
    User.hasMany(models.UserService, { foreignKey: 'user_id', as: 'service' });
  }


export default User;
