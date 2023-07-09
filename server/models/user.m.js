const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
    },
    avatar:{
        type:String,
        default: ''
    },

}, { timestamps: true });

UserSchema.pre('save',async function(next){
    try{        
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(this.password,salt)
        this.password=hashedPassword
        next();
    }
    catch (err){
        next(err)
    }
})

UserSchema.methods.isRightPassword=async function(password){
    try {
        return await bcrypt.compare(password,this.password)
    } catch (error) {
        
    }
}


module.exports = mongoose.model('users', UserSchema);