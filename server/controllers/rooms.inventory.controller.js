import models from '../models/index.js';


const getRoomsInventory = async (req, res, next) => {
  try {
    const rooms = await models.Room.findAll({ include: [
    { model: models.RoomType }
  ]
});

    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    next(error);
  }
};


const updateRoomInventory = async (req, res, next) => {
  try{

    const { id, number, type, floor, status } = req.body;

    const roomType = await models.RoomType.findOne({ where: { type_name: type } });

    await models.Room.update({
      room_number: number,
      room_type_id : roomType.room_type_id,
      floor : floor,
      status : status,
    }, {
      where: { room_id: id }
    });

    res.status(200).json({ success: true, message: 'Room updated successfully' });
  } catch (error) {
    next(error);
  }
};

const addRoomToInventory = async (req, res, next) => {
  try{
      const { number,hotel_id, type, floor, status } = req.body;

      const room = await models.Room.findOne({ where: { room_number: number, hotel_id: hotel_id } });
      if(room){
        return res.status(400).json({ success: false, message: 'Room with this number already exists in the hotel' });
      }

      const roomType = await models.RoomType.findOne({ where: { type_name: type } });

      const newRoom = await models.Room.create({
        room_number: number,
        hotel_id: hotel_id,
        room_type_id: roomType.room_type_id,
        floor: floor,
        status: status
      });

      res.status(201).json({ success: true, data: newRoom });
  } catch (error) {
    next(error);
  }
};

const deleteRoomFromInventory = async (req, res, next) => {
  try {
    const { room_id } = req.body;
    await models.Room.destroy({ where: { room_id: room_id } });
    res.status(200).json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const changeRoomType = async (req, res, next) => {
  try {
    const { type_name, description, max_capacity, base_rate, amenities, image_url } = req.body;

    const RoomType = await models.RoomType.update({
      type_name: type_name,
      description: description,
      max_capacity: max_capacity,
      base_rate: base_rate,
      amenities: amenities,
      image_url: image_url
    });

    res.status(200).json({ success: true, data: RoomType });
  } catch (error) {
    next(error);
  }
};

const editRoomType = async (req, res, next) => {
  try {
    const { room_type_id, type_name, description, max_capacity, base_rate, amenities, image_url } = req.body;
    await models.RoomType.update({
      type_name: type_name,
      description: description,
      max_capacity: max_capacity,
      base_rate: base_rate,
      amenities: amenities,
      image_url: image_url
    }, {
      where: { room_type_id: room_type_id }
    });
    res.status(200).json({ success: true, message: 'Room type updated successfully' });
  } catch (error) {
    next(error);
  }
}
export { getRoomsInventory, addRoomToInventory, updateRoomInventory, deleteRoomFromInventory, changeRoomType, editRoomType };