import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import sequelize from './config/db.js';
import roomInventoryRoutes from './routes/room.inventory.route.js';
import serviceRoutes from './routes/service.route.js';
import models from './models/index.js';
import ReservationRoutes from './routes/reservation.route.js';
import staffMemberRoutes from './routes/staff.route.js';
import dashboardRoutes from './routes/dashboard.route.js';
import userprofileroutes from './routes/profile.update.route.js';



const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomInventoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reservations', ReservationRoutes);
app.use('/api/staff', staffMemberRoutes);
app.use('/api/dashboard',dashboardRoutes);
app.use('/api/user',userprofileroutes);



app.use(errorHandler);

sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


