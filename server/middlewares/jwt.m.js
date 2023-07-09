const JWT = require("jsonwebtoken");

const middlewareController = {
    authenticateToken: (req, res, next) => {
        try {
            const token = req.cookies.accesstoken;
            const userId =req.cookies.userid;

            console.log("aa",token)

            if (!token) return  res.status(401).json({
                status:401,
                message:'Access token not provided'
            });
            
            return JWT.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(401).json({
                        status:401,
                        message:'Invalid access token'
                    });
                }
                
                if(user._id  === userId){
                    next();
                }
                else {
                    return res.status(401).json({
                        status:401,
                        message:'Invalid access token'
                    });   
                }
            });
            
        } catch (error) {
            console.log(error)
        }
    },
};

module.exports = middlewareController;
