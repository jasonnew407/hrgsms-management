import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const UserRole = sequelize.define('UserRole', {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_name: {
      type: DataTypes.ENUM('Guest_Portal', 'Front_Desk', 'Service_Staff', 'Manager', 'Admin'),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'user_roles',
    timestamps: false // No created_at or updated_at in your schema
  });

export default UserRole;
