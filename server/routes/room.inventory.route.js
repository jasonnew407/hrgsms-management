import express from "express";
import { getRoomsInventory,addRoomToInventory,updateRoomInventory, deleteRoomFromInventory, editRoomType  } from "../controllers/rooms.inventory.controller.js";

const router = express.Router();

router.get("/getAllRooms", getRoomsInventory);
router.post("/addRoom", addRoomToInventory);
router.put("/updateRoom", updateRoomInventory);
router.delete("/deleteRoom", deleteRoomFromInventory);
router.put("/editRoomType",editRoomType);

export default router;
