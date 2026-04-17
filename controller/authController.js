import { supabase } from '../config/supabaseClient.js'
import sendEmail from '../services/emailSet.js';
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.SECRETKEY || 'fallback_secret_key_123';

export const registeruser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // 1. Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone: phone
        }
      }
    });

    if (authError) {
      console.error("Supabase Auth Error:", authError);
      return res.status(400).json({
        success: false,
        message: authError.message
      });
    }

    if (!authData.user) {
      return res.status(400).json({
        success: false,
        message: "Signup failed: No user data returned."
      });
    }

    // 2. Create entry in public.profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          name,
          email,
          phone
        }
      ]);

    if (profileError) {
      console.error("Error creating profile:", profileError);
      return res.status(400).json({
        success: false,
        message: "Auth user created, but profile creation failed: " + profileError.message
      });
    }

    try {
      await sendEmail(email, 'welcome to SocialConnect',
        `<div style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
      <table align="center" width="100%" cellpadding="0" cellspacing="0"
        style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;
        overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
  
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);
            padding:30px;text-align:center;color:white;">
            <h1 style="margin:0;font-size:26px;">SocialConnect</h1>
            <p style="margin:6px 0 0;font-size:14px;opacity:0.9;">
              Connect • Share • Grow
            </p>
          </td>
        </tr>
  
        <tr>
          <td style="padding:30px;color:#333;">
            <h2 style="margin-top:0;">Welcome, ${name} 👋</h2>
  
            <p style="line-height:1.6;font-size:15px;color:#555;">
              We’re excited to have you join <b>SocialConnect</b>.
              Start connecting with people, sharing posts,
              and exploring communities right away.
            </p>
  
            <div style="text-align:center;margin:30px 0;">
              <a href="https://yourapp.com"
                style="background:#4f46e5;color:white;text-decoration:none;
                padding:12px 24px;border-radius:6px;font-size:15px;
                font-weight:bold;display:inline-block;">
                Get Started
              </a>
            </div>
  
            <p style="font-size:13px;color:#888;">
              If you did not create this account, please ignore this email.
            </p>
          </td>
        </tr>
  
        <tr>
          <td style="background:#f1f3f5;padding:15px;text-align:center;
            font-size:12px;color:#777;">
            © ${new Date().getFullYear()} SocialConnect. All rights reserved.
          </td>
        </tr>
  
      </table>
    </div>`
      );
    } catch (emailError) {
      console.log('Skipping email send, error or unconfigured sender:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Data added successfully!",
      data: {
        id: authData.user.id,
        email: authData.user.email,
        name
      }
    })

  } catch (error) {
    console.error("Registration Exception:", error);
    res.status(500).json({
      success: false,
      message: error.message || "internal server error!"
    })
  }
}


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    // We can still generate a custom token if needed for the legacy cookie flow,
    // or just use Supabase's access token.
    // For minimal frontend changes, we'll keep the custom JWT for now, 
    // but fetch the profile name first.
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', data.user.id)
      .single();

    const token = await jwt.sign({ id: data.user.id, name: profile?.name || data.user.email }, SECRET_KEY, { expiresIn: '7d' });

    res.cookie("mycookie", token, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token: token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name
      }
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Login failed!"
    })
  }
}