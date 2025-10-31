import models from "../models/index.js";

const getUserProfileDetails = async (req, res, next) => {
    const { user_id } = req.query;
    try {
        const user = await models.User.findOne({
            where: { id: user_id }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const editUserProfileDetails = async (req, res, next) => {
    const { user_id } = req.query;
    const { firstname, lastname, email, phone } = req.body;

    try {
        const user = await models.User.findOne({
            where: { id: user_id }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user details
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.phone = phone;

        await user.save();

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export {
    getUserProfileDetails, 
    editUserProfileDetails
};