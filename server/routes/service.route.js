import express from "express";
import { updateService, deleteService,getAllServiceStaff, addService,getAllServices,assignServiceToUser,unassignServiceFromUser } from "../controllers/service.controller.js";

const router = express.Router();

router.get("/getAllServices", getAllServices);
router.post("/addService", addService);
router.put("/updateService", updateService);
router.delete("/deleteService", deleteService);
router.post("/assignServiceToUser", assignServiceToUser);
router.delete("/unassignServiceFromUser", unassignServiceFromUser);
router.get("/getAllServiceStaff", getAllServiceStaff);

export default router;