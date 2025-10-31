import models from '../models/index.js';

// get all services - /api/services/getAllServices(get)
const getAllServices = async (req, res, next) => {
    try {
const services = await models.ServiceCatalog.findAll({
    include: [{
        model: models.UserService,
        as: 'userServices',
        include: [{
            model: models.User,
            as: 'user',
            include: [{
                model: models.UserRole,
                as: 'role'
            }]
        }]
    }]
});

    res.status(200).json({ success: true, data: services });
    }   catch (error) {
        next(error);
    }  
};

const getAllServiceStaff = async (req, res, next) => {
    try {
        const serviceStaff = await models.User.findAll({
            include: [{
                model: models.UserRole,
                as: 'role',
                where: { role_name: 'Service_Staff' }
            }]
        });
        res.status(200).json({ success: true, data: serviceStaff });
    } catch (error) {
        next(error);
    }
};

// add new service - /api/services/addService(post)
const addService = async (req, res, next) => {
    try{
        const { hotel_id,service_name,service_type,description,price,unit,is_available, } = req.body;

        const newService = await models.ServiceCatalog.create({
            service_name: service_name,
            hotel_id: hotel_id,
            description: description,
            price: price,
            service_type: service_type,
            unit: unit,
            is_available: is_available
        });
        res.status(201).json({ success: true, data: newService });
    } catch (error) {
        next(error);    
    }
};

// update service - /api/services/updateService(put)
const updateService = async (req, res, next) => {
    try{
        const { service_id, hotel_id,service_name,service_type,description,price,unit,is_available } = req.body;
        await models.ServiceCatalog.update({
            service_name: service_name,
            hotel_id: hotel_id,
            service_type: service_type,
            description: description,
            price: price,
            unit: unit,
            is_available: is_available
        }, {
            where: { service_id: service_id }
        });
        res.status(200).json({ success: true, message: "Service updated successfully" });
    } catch (error) {
        next(error);
    }
};

// delete service - /api/services/deleteService(delete)
const deleteService = async (req, res, next) => {
    try{
        const { service_id } = req.query;
        await models.ServiceCatalog.destroy({ where: { service_id: service_id } });
        res.status(200).json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
        next(error);
    }  
};

// assign service to user - /api/services/assignServiceToUser(post)
const assignServiceToUser = async (req, res, next) => {
    try{
        const { user_id, service_id } = req.body;

        const newUserService = await models.UserService.create({
            user_id: user_id,
            service_id: service_id
        });
        res.status(201).json({ success: true, data: newUserService });
    }catch (error) {
        next(error);    
    }
};

// unassign service from user - /api/services/unassignServiceFromUser(delete)
const unassignServiceFromUser = async (req, res, next) => {
    try{
        const { user_id, service_id } = req.query;
        await models.UserService.destroy({ where: { user_id: user_id, service_id: service_id } });
        res.status(200).json({ success: true, message: "Service unassigned from user successfully" });
    } catch (error) {
        next(error);
    }
};



export { updateService, deleteService,getAllServiceStaff, addService,getAllServices, assignServiceToUser, unassignServiceFromUser };
