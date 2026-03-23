import express from 'express'
import { registeruser } from '../controller/authController.js'

const router = express.Router()

router.post("/register", registeruser)

export default router;