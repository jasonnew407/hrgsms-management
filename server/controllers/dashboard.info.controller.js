import models from "../models/index.js";
import { Sequelize } from "sequelize";

const getDashboardInfo = async (req, res, next) => {
  const { hotel_id } = req.query;
  try {
    const totalRooms = await models.Room.count( { where: { hotel_id: hotel_id } });
    const availableRooms = await models.Room.count({ where: { status: "Available", hotel_id: hotel_id } });
    const occupiedRooms = await models.Room.count({ where: { status: "Occupied", hotel_id: hotel_id } });
    const maintenanceRooms = await models.Room.count({ where: { status: "Maintenance", hotel_id: hotel_id } });

    res.status(200).json({
      success: true,
      data: {
        totalRooms,
        availableRooms,
        occupiedRooms,
        maintenanceRooms
      }
    });
    console.log(hotel_id);
  } catch (error) {
    next(error);
  }
};

const totalReservations = async (req, res, next) => {
    const { hotel_id } = req.query;
    try {
        const totalReservations = await models.Reservation.count(
            { where: { booking_status: 'Booked',
               hotel_id: hotel_id 
             }

         }
        );
        res.status(200).json({ success: true, data: { totalReservations } });
    }
    catch (error) {
        next(error);
    }
};

const totalStaffCount = async (req, res, next) => {
    const { hotel_id } = req.query;
    try {
        const totalStaff = await models.User.count(
            {
                include: [{
                    model: models.UserRole,
                    as: 'role',
                    role_name: {
                         [Sequelize.Op.in]: ['Service_Staff', 'Front_Desk']
                    }
                }]
                , where: { hotel_id }
            }
        );
        res.status(200).json({ success: true, data: { totalStaff } });
    } catch (error) {
        next(error);
    }
};

const getTotalBookingAmount = async (req, res, next) => {
    try {
        const { hotel_id } = req.query;
        const totalAmountResult = await models.Reservation.findAll({
            where: { booking_status: 'Booked', hotel_id: hotel_id },
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('room_rate_at_booking')), 'totalAmount']
            ]
        });
        res.status(200).json({ success: true, data: { totalAmount: totalAmountResult[0]?.get('totalAmount') || 0 } });
    } catch (error) {
        next(error);
    }
};

const getRecentReservations = async (req, res, next) => {
    const { hotel_id } = req.query;
    try {
        const reservations = await models.Reservation.findAll({
            where: { booking_status: 'Booked', hotel_id: hotel_id },
            include: [
                { model: models.Guest, as: 'guest' },
                { model: models.Room, as: 'room' }
            ],
            order: [['created_at', 'DESC']],
            limit: 5

        });
        res.status(200).json({ success: true, data: { reservations } });
    } catch (error) {
        next(error);
    }
};

const getRoomAvailabilityStats = async (req, res, next) => {
    const { hotel_id } = req.query;
    try {
        const total_rooms_with_types = await models.RoomType.findAll({
            include: [{ model: models.Room, as: 'rooms' , where: { hotel_id } }],
        });
        const roomAvailability = total_rooms_with_types.map(type => ({
            type: type.type_name,
            total: type.rooms.length,
            available: type.rooms.filter(room => room.status === 'Available').length
        }));
        res.status(200).json({ success: true, data: { roomAvailability } });
    } catch (error) {
        next(error);
    }
};

const getBookings = async (req, res, next) => {
    const { hotel_id } = req.query;
    try {
        const reservations = await models.Reservation.findAll({
        include: [
            { model: models.Guest, as: 'guests' },
            { model: models.Room, as: 'rooms' }
        ],
        where: { hotel_id : hotel_id },
        order: [['created_at', 'DESC']],
        limit: 5
    });
        res.status(200).json({ success: true, data: reservations });
    } catch (error) {
        next(error);
    }
};

export { getDashboardInfo, totalReservations, totalStaffCount, getTotalBookingAmount, getRecentReservations, getRoomAvailabilityStats, getBookings };