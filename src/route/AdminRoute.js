import express from "express";
import AdminController from "../controller/AdminController.js";
const router = express.Router();

router.get("/", AdminController.getAdmin);
router.post("/login", AdminController.login);
router.post("/logout", AdminController.logout);

export default router;
