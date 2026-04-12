import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.SECRETKEY || 'fallback_secret_key_123'

const authUser = async (req, res, next) => {
    try {
        // Accept token from cookie OR Authorization header
        const token = req.cookies.mycookie
            || (req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token required"
            })
        }
        const decoded = jwt.verify(token, SECRET_KEY)
        req.user = decoded;
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "invalid token"
        })
    }
}

export default authUser;