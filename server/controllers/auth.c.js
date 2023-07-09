const User = require('../models/user.m')
const JWT = require("jsonwebtoken")
const redis = require("../configs/redis.config")

const AuthController = {
    generateAccessToken: (user,time="1800s") => {
        return JWT.sign(
            {
                _id: user._id,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: time }
        );
    },

    generateRefreshToken: (user) => {
        return JWT.sign(
            {
                _id: user._id,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "30d" }
        );
    },

    requestRefreshToken: async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshtoken;
    
            if (!refreshToken) {
                return res.status(403).json("Bạn không có quyền truy cập");
            }
    
            
            JWT.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
                if (err) {
                    return res.status(200).json(err);
                }
                const newAccessToken = AuthController.generateAccessToken(user);
                
                res.cookie("accesstoken",newAccessToken,{
                    path: "/",
                    maxAge:1000*60*5,
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                })
                
                res.status(200).json({ accessToken: newAccessToken});
            });
            
        } catch (error) {
            console.log(error)
            next(error)
        }
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

            const accessToken = AuthController.generateAccessToken(isValidUser)
            const refreshToken = AuthController.generateRefreshToken(isValidUser)

            res.cookie("refreshtoken", refreshToken,{
                path: "/",
                maxAge:1000*60*60*24*30,
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            })
            res.cookie("accesstoken", accessToken,{
                path: "/",
                maxAge:1000*60*30,
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            })

            res.cookie("userid",isValidUser._id,{
                path:'*',
                httpOnly:true,
                secure:true,
                sameSite:'strict'
            })

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
    },
    check:async(req,res,next)=>{
        try {
            return res.status(200).json({
                status:200,
                message:"Oke"
            })
        } catch (error) {
            next(error)
            console.log(error)
        }
    }
}

module.exports = AuthController