import express from "express";
const router = express.Router();

import AdminRoute from "./AdminRoute.js";
import MemberRoute from "./MemberRoute.js";
import PaymentRoute from "./PaymentRoute.js";
import HistoryRoute from "./HistoryRoute.js";

// user routes
router.use("/auth", AdminRoute);
router.use("/member", MemberRoute);
router.use("/payment", PaymentRoute);
router.use("/history", HistoryRoute);

export default router;
