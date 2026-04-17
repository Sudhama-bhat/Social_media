import Post from "../models/Post.js";
import Comment from "../models/Comments.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

// controllers
export const createPost = async (req, res) => {
    try {
        const { caption, location } = req.body;
        const media = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                // Upload each file to Cloudinary
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "social_connect_posts",
                    resource_type: "auto" // Handles image and video automatically
                });

                media.push({
                    mediaType: file.mimetype.startsWith("image") ? "image" : "video",
                    mediaUrl: result.secure_url
                });

                // Delete the local temporary file after uploading to Cloudinary
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            }
        }

        const userId = req.user.id;

        const newPost = await Post.create({
            caption,
            userId,
            location,
            media
        });

        res.status(201).json({
            success: true,
            message: "Post Created successfully",
            data: newPost
        });

    } catch (error) {
        console.error("Cloudinary upload/Database error:", error);
        res.status(500).json({
            success: false,
            message: "Error in creating Post",
        });
    }
};


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("userId", "name profilePicture")
            .sort({createdAt: -1})

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching posts" });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.user.id })
        .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user posts" });
    }
};


// export const createPost = async (req, res) => {
//     try {
//         const { caption, location } = req.body;
//         const media = []

//             for (const file of req.files) {
//                 // Upload each file to Cloudinary
//                 const result = await cloudinary.uploader.upload(file.path, {
//                     folder: "social_connect_posts"
//                 });
//                 media.push({
//                     mediaType: file.mimetype.startsWith("image") ? "image" : "video",
//                     mediaUrl: result.secure_url
//                 })
//                 // Optionally, you can delete the local file after uploading to Cloudinary
//                 fs.unlinkSync(file.path);

//             }

//         const userId = req.user.id;

//         const newPost = await Post.create({
//             caption,
//             userId,
//             location,
//             media
//         })

//         res.status(201).json({
//             success: true,
//             message: "Post Created successfully",
//             data: newPost
//         })


//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             success: false,
//             message: "Error in creating Post",
//         })

//     }
// }