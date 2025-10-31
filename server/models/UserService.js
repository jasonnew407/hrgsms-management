import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const UserService = sequelize.define('UserService', {
    user_service_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'service_catalogs',
            key: 'service_id'
        }
    }
}, {
    tableName: 'user_services',
    timestamps: false
});

UserService.associate = (models) => {
    UserService.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    UserService.belongsTo(models.ServiceCatalog, {
        foreignKey: 'service_id',
        as: 'service'
    });
};



export default UserService;
