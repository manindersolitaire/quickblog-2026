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

        await blog.create({title , subTitle, description, category, image , isPublished})
        res.json({
            success : true,
            message : "Blog added successfully"
        })

    } catch (error) {
        res.json({
            success : false,
            message : "Blog added failed"
        })
    }
}