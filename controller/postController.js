import { supabase } from "../config/supabaseClient.js";
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

        // 1. Insert into posts table
        const { data: postData, error: postError } = await supabase
            .from('posts')
            .insert([
                {
                    user_id: userId,
                    caption,
                    location
                }
            ])
            .select()
            .single();

        if (postError) {
            console.error("Supabase Post Insertion Error:", postError);
            throw postError;
        }

        console.log("Post created successfully in Supabase:", postData.id);

        // 2. Insert into post_media table
        if (media.length > 0) {
            const mediaToInsert = media.map(m => ({
                post_id: postData.id,
                media_type: m.mediaType,
                media_url: m.mediaUrl
            }));

            const { error: mediaError } = await supabase
                .from('post_media')
                .insert(mediaToInsert);

            if (mediaError) throw mediaError;
        }

        res.status(201).json({
            success: true,
            message: "Post Created successfully",
            data: { ...postData, media }
        });

    } catch (error) {
        console.error("Post Creation Exception:", error);
        res.status(500).json({
            success: false,
            message: "Error in creating Post",
            error: error.message || error
        });
    }
};


export const getAllPosts = async (req, res) => {
    try {
        // Fetch posts with profile info and media
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                profiles!posts_user_id_fkey (id, name, profile_picture),
                post_media (*)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Fetch Posts Error:", error);
            throw error;
        }

        console.log(`Fetched ${data?.length || 0} posts from Supabase`);

        // Format data to match previous frontend expectation if needed
        const formattedPosts = data.map(post => ({
            ...post,
            userId: post.profiles, // Mapping profile to userId key
            media: post.post_media
        }));

        res.status(200).json({
            success: true,
            data: formattedPosts
        });
    } catch (error) {
        console.error("Fetch Posts Exception:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching posts",
            error: error.message || error 
        });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                post_media (*)
            `)
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user posts" });
    }
};