import express from 'express'
import adminRoutes from './admin/router.js'
import teacherRoutes from './teachers/router.js'
import studentRoutes from './students/router.js'
import subjectRoutes from './subjects/router.js'

const router = express.Router();

router.use('/admin',adminRoutes)

router.use('/teacher',teacherRoutes)

router.use('/student',studentRoutes)

router.use('/subject',subjectRoutes)

export default router;