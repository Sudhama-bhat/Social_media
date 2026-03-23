import User from '../models/User.js'
import bcrypt from 'bcrypt'
import sendEmail from '../services/emailSet.js';

export const registeruser = async(req, res) =>{
    try {
        const {name, email, phone, password} = req.body;
        
        const userexist = await User.findOne({email});
        if(userexist){
            return res.status(400).json({
                success: false,
                message:" User already exist!"
            })
        }

        const hashedPassword= await bcrypt.hash(password, 10);
        const userData = await User.create({
            name,
            email,
            phone,
            password: hashedPassword
        })

        await sendEmail(email, 'welcome to SocialConnect',
            `<div>Welcome to SocialConnect ${name}</div>`
        )
        
        res.status(201).json({
            success: true,
            message: " Data added successfully!",
            data: userData
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "internal server error!"
        })
    }
}