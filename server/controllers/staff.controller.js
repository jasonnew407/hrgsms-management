import models from "../models/index.js";
import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";
import { Sequelize } from "sequelize";

const getAllStaffMembers = async (req, res, next) => {
    const { hotel_id } = req.query;
    try {
        const users = await models.User.findAll({
            where: { hotel_id },
            include: [
                {
                    model: models.UserRole,
                    as: 'role',
                    where: {
                        role_name: {
                            [Sequelize.Op.in]: ['Service_Staff', 'Front_Desk']
                        }
                    }
                }
            ],
            attributes: { exclude: ['password'] } // Don't send password hash to frontend
        });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

const addStaffMember = async (req, res, next) => {
    try {
        const { hotel_id, fname, lname, email, phone, password, user_role } = req.body;
        
        // Validate required fields
        if (!hotel_id || !fname || !lname || !email || !password || !user_role) {
            return res.status(400).json({ 
                success: false, 
                message: 'All required fields must be provided' 
            });
        }

        const role = await models.UserRole.findOne({ where: { role_name: user_role } });
        
        if (!role) {
            return res.status(404).json({ 
                success: false, 
                message: 'Role not found' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStaff = await models.User.create({
            firstname: fname,
            lastname: lname,
            email: email,
            phone: phone,
            password: hashedPassword,
            user_role_id: role.role_id,
            hotel_id: hotel_id,
            is_email_verified: false
        });

        // Fetch the complete user with role info
        const staffWithRole = await models.User.findOne({
            where: { id: newStaff.id },
            include: [{
                model: models.UserRole,
                as: 'role'
            }],
            attributes: { exclude: ['password'] }
        });

        res.status(201).json({ success: true, data: staffWithRole });
    } catch (error) {
        next(error);
    }
};

const deleteStaffMember = async (req, res, next) => {
    try {
        const { id } = req.params; // Changed from user_id to id
        
        const deleted = await models.User.destroy({ where: { id } });
        
        if (deleted === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Staff member not found' 
            });
        }
        
        res.status(200).json({ success: true, message: 'Staff member deleted successfully' });
    } catch (error) {
        next(error);
    }
};

const updateStaffMember = async (req, res, next) => {
    try {
        const { id } = req.params; // Get id from params
        const { fname, lname, email, phone, password, user_role } = req.body;
        
        const role = await models.UserRole.findOne({ where: { role_name: user_role } });
        
        if (!role) {
            return res.status(404).json({ 
                success: false, 
                message: 'Role not found' 
            });
        }

        const updateData = {
            firstname: fname,
            lastname: lname,
            email: email,
            phone: phone,
            user_role_id: role.role_id,
        };

        // Only hash and update password if provided
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await models.User.update(updateData, {
            where: { id: id }
        });

        // Fetch updated user with role
        const updatedStaff = await models.User.findOne({
            where: { id: id },
            include: [{
                model: models.UserRole,
                as: 'role'
            }],
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({ success: true, data: updatedStaff });
    } catch (error) {
        next(error);
    }
};

export { getAllStaffMembers, addStaffMember, deleteStaffMember, updateStaffMember };