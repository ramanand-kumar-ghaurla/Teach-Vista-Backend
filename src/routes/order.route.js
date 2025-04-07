import { Router } from "express";
import { createOrder } from "../controllers/oder.controller.js";
import { requireAuth } from "@clerk/express";

const router = Router()


// add require auth for authorization
router.route('/create-order').post(createOrder)

export default router