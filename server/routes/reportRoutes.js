import express from 'express'
import { generateReport, getDashboard } from '../controller/reportController.js'
import { verifyToken } from '../middleware/auth.js'

const dashrouter = express.Router()

dashrouter.get('/Dashboard', verifyToken,getDashboard)
dashrouter.post('/report/generate-report', verifyToken, generateReport)

export default dashrouter