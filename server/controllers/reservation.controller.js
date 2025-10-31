import models from "../models/index.js";
import sequelize from "../config/db.js";


const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await models.Reservation.findAll({
        include: [
            { model: models.Guest, as: 'guest' },
            { model: models.Room, as: 'room' }
        ]
    });
    res.status(200).json({ success: true, data: reservations });
    } catch (error) {
        next(error);
    }
};

const getHotelReservations = async (req, res, next) => {
    const { hotel_id } = req.query;
    try {
        const reservations = await models.Reservation.findAll({
            where: { hotel_id : hotel_id },
            include: [
                { model: models.Guest, as: 'guest' },
                { model: models.Room, as: 'room' }
            ]
        });
        res.status(200).json({ success: true, data: reservations });
    } catch (error) {
        next(error);
    }
};



const getCancelledReservations = async (req, res, next) => {
    try {
      const reservations = await models.Reservation.findAll({
            where: { booking_status: 'Cancelled' },
            include: [
                { model: models.Guest, as: 'guest' },
                { model: models.Room, as: 'room' }
            ]
        });
        res.status(200).json({ success: true, data: reservations });
    } catch (error) {
        next(error);
    }   
};

const rejectCancellation = async (req, res, next) => {
    try{
        const { res_id, rejection_reason } = req.body;
        const refund_id =  await models.ReservationRefund.findOne({ where: { reservation_id: res_id } });

        await sequelize.query(
         'CALL ProcessRefundRejectUpdate(:refund_id, :status, :reason)',
                 {
                  replacements: {
                  refund_id: refund_id.id,
                  status: 'Rejected',
                  reason: rejection_reason
                  }
                  }
          );


        res.status(200).json({ success: true, message: 'Cancellation rejected successfully' });
    } catch (error) {
        next(error);
    }
};

const approveCancellation = async (req, res, next) => {
    try{
        const { res_id, approved_amount } = req.body;
        const refund_id =  await models.ReservationRefund.findOne({ where: { reservation_id: res_id } });
        await sequelize.query(
         'CALL ProcessRefundApproveUpdate(:refund_id, :status, :amount)',
                 {
                    replacements: {
                    refund_id: refund_id.id,
                    status: 'Approved',
                    amount: approved_amount
                    }
                  }
          );
        res.status(200).json({ success: true, message: 'Cancellation approved successfully' });
    } catch (error) {
        next(error);
    }
};

export { getAllReservations,getHotelReservations, getCancelledReservations, rejectCancellation, approveCancellation };

