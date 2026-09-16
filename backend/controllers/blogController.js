import fs from 'fs'
import imagekit from '../config/imageKit.js'
import blog from '../models/Blog.js'
export const addBlog = async(req,res)=>{
    try {
        const {title, subTitle , description , category , isPublished} = JSON.parse(req.body.blog)
        const imageFile = req.file

        // Check if all fields are present
        if(!title || !description || !category || !imageFile){
            return res.json({
                success : false,
                message : 'Missing required fields..'
            })
        }

        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file : fileBuffer,
            fileName : imageFile.originalname,
            folder : "/blogs"

        })

        // Optimization through imageKit URL transformation
        const optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {quality : "auto"},
                {format : "webp"},
                {width : "1280"}
            ]
        })

        const image = optimizedImageUrl

        await blog.create({title , subTitle, description, category, image  , isPublished})
        res.json({
            success : true,
            message : "Blog added successfully"
        })

    } catch (error) {
        res.json({
            success : false,
            message : "Blog added failed",
            error
        })
    }
}

export const getAllBlogs = async (req,res) => {
    try {
        const blogs = await blog.find({isPublished :  true})
        res.json({success : true , blogs})
    } catch (error) {
        res.json({
            success : false,
            message : error.message
        })
    }
}

export const getBlogById = async (req,res) => {
    try {
        const {blogId} =  req.params
        const data =  await blog.findById(blogId)
        if(!data){
            return res.json({success : false, message : 'Blog not found'})
        }
        res.json({success : true , data})
    } catch (error) {
        res.json({
            success : false,
            message : error.message
        })
    }
}

export const deleteBlogById = async (req,res) => {
    try {
        const {id} =  req.params
        await blog.findByIdAndDelete(id)
        res.json({success : true , message : "Blog deleted successfully"})
    } catch (error) {
        res.json({
            success : false,
            message : error.message
        })
    }
}

export const togglePublish = async(req,res) => {
    try {
        const {id} = req.body
        const Blog =  await blog.findById(id)
        Blog.isPublished = !Blog.isPublished
        await Blog.save()
        res.json({success : true , message : "Blog status updated"})
    } catch (error) {
         res.json({
            success : false,
            message : error.message
        })
    }
}