const User = require('../models/user.m')
const JWT = require("jsonwebtoken")
const redis = require("../configs/redis.config")

const AuthController = {
    generateAccessToken: (user,time="1800s") => {
        return JWT.sign(
            {
                id: user._id,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: time }
        );
    },

    generateRefreshToken: (user) => {
        return JWT.sign(
            {
                id: user._id,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "30d" }
        );
    },

    requestRefreshToken: async (req, res, next) => {
        let refreshTokens= await redis.lRange('refresh-tokens', 0, -1, (err, reply) => {
            if (err) throw err;
            return reply; // danh sách các phần tử trong mảng
        })
        const refreshToken = req.cookies.refreshtoken;

        if (!refreshToken) {
            return res.json("Bạn không có quyền truy cập");
        }
        if (!refreshTokens.includes(refreshToken)) {
            return res.json("Refresh token không tồn tại hoặc hết hạn!");
        }
        const email =await redis.get(refreshToken)
        
        JWT.verify(refreshToken, process.env.JWT_REFRESH_KEY, async(err, user) => {
            if (err) {
                return res.status(200).json(err);
            }
            
            res.cookie("email",email,{
                path: "/",
                maxAge:1000*process.env.JWT_ACCESS_KEY_TIME,
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            })
            const newAccessToken = AuthController.generateAccessToken(user);
            
            res.status(200).json({ accessToken: newAccessToken,email});
        });
    },

    login:async(req,res,next)=>{
        try {
            const {username,password} = req.body

            const isValidUser = await User.findOne({username})

            if(!isValidUser){
                return res.status(500).json({
                    status:500,
                    message:"Tài khoản hoặc mật khẩu không đúng"
                })
            }

            const isRightPassword = await isValidUser.isRightPassword(password)

            if(!isRightPassword){
                return res.status(500).json({
                    status:500,
                    message:"Tài khoản hoặc mật khẩu không đúng"
                })
            }

            res.status(200).json({
                status:200,
                message:"Đăng nhập thành công",
                user:isValidUser
            })
        } catch (error) {
            next(error)
            console.log(error)
        }
    },
    register:async(req,res,next)=>{
        try {
            const {username,password,email} = req.body

            const isExistedUsername = await User.findOne({username})
            const isExistedEmail = await User.findOne({email})

            if(isExistedEmail){
                return res.status(500).json({
                    status:500,
                    message:"Email đã tồn tại",
                })
            }

            if(isExistedUsername){
                return res.status(500).json({
                    status:500,
                    message:"Tên đăng nhập đã tồn tại",
                })
            }

            const newUser = new User({username,password,email})
            
            await newUser.save()            
            
            return res.status(201).json({
                status:201,
                message:"Đăng kí thành công"
            })
            

        } catch (error) {
            next(error)
            console.log(error)
        }
    }
}

module.exports = AuthController