import express from 'express'
import { adminLogin, approveCommentsById, deleteCommentsById, getAllBlogAdmin, getAllComments, getDashboard } from '../controllers/adminController.js'
import auth from '../middleware/auth.js'

const adminRouter = express.Router()

adminRouter.post('/login', adminLogin)
adminRouter.get('/comments', auth , getAllComments)
adminRouter.get('/blogs', auth , getAllBlogAdmin)
adminRouter.get('/delete-comment', auth , deleteCommentsById)
adminRouter.get('/approve-comment', auth , approveCommentsById)
adminRouter.get('/dashboard', auth , getDashboard)


export default adminRouter