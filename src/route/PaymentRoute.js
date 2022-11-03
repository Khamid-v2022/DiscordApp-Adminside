import express from "express";
import PaymentController from "../controller/PaymentController.js";
const router = express.Router();

router.get("/", PaymentController.getPayments);
router.get("/getChart", PaymentController.getChart);

router.post("/addTransaction", PaymentController.addTransaction);

export default router;
