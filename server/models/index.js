import Room from './Room.js';
import RoomType from './RoomType.js';
import Hotel from './Hotel.js';
import Reservation from './Reservation.js';
import ServiceCatalog from './ServiceCatalog.js';
import ServiceUsage from './ServiceUsage.js';
import User from './User.js';
import UserRole from './UserRole.js';
import UserService from './UserService.js';
import Guest from './Guest.js';
import ReservationRefund from './ReservationRefund.js';

const models = {
  Room,
  RoomType,
  Hotel,
  Reservation,
  ServiceCatalog,
  ServiceUsage,
  User,
  UserRole,
  UserService,
  Guest,
  ReservationRefund
};

// This is where the associate functions get called
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { Room, RoomType, Hotel, Reservation, ServiceCatalog, ServiceUsage, User, UserRole, UserService, Guest, ReservationRefund };
export default models;