import { responseSuccess,responseError } from "@/utils/helpers/response.helpers"
import { loginUser,createUser,detail as details ,updateUser ,removeUser ,likeAudio as lau} from "../services/user.service";
import { genToken } from "@/utils/helpers/generateToken.helpers";
import { comparePassword } from "@/utils/handlers/hashPassword";
import cache from "@/storage/cache/cache";
import { SECRET_KEY_USER } from "@/config";

export const create = async (req,res,next)=>{
    try {
        const user = await createUser(req)
        await responseSuccess(res, user);
    } catch (error) {
        next(error);
    }
}


export const detail = async (req,res,next)=>{
    try {
        const user = await details(req.curentUser);
        await responseSuccess(res, user);
    } catch (error) {
        next(error);
    }
}

export const update = async (req,res,next)=>{
    try {
        const user = await updateUser(req);
        
        await responseSuccess(res, user);
    } catch (error) {
        next(error);
    }
}

export const remove = async (req,res,next)=>{
    try {
        const curentUser = req.curentUser;
        const user = await removeUser(curentUser);
        if(user){
            await responseSuccess(res, user);
        }
        else
        await responseError(res, null);
    } catch (error) {
        next(error);
    }
}


export const login = async (req,res,next)=>{
    try {
        const user = await loginUser(req.body);
        if(comparePassword(req.body.password,user.password)){
            responseSuccess(res, {
                name : user.name,
                email : user.email,
                password : user.password,
                token :genToken(req.body,SECRET_KEY_USER)
            });
        }
        else{
            responseError(res, null,400,"tài khoản không tồn tại");
        }
    } catch (error) {
        next(error);
    }
}

export const logout = async (req,res)=>{
    const token = req.headers['authorization'].replace(/Bearer/, '').trim();
   
    const exp = req.curentUser.exp;
    const ttl = exp-Math.floor(Date.now() / 1000);
    cache.addCache(token,token,ttl);
    responseSuccess(res,null);
}

import { reportAudio } from "../services/user.service";
export const reportA = async (req, res) => {
    try{
        const result = await reportAudio
    }
    catch(err){
        return responseError(res, err.message, 400, "Failed to report audio");
    }//==============================================
};

// import { likeAudio } from "../services/user.service";

export const likeAudio = async (req, res) => {
    try {
        const email = req.curentUser.email;
        const { audioId } = req.body;

        // Call the service function to like or unlike the audio
        const { updatedUser, action } = await lau(email, audioId);
        console.log(updatedUser,action,"=========");

        // Determine the message based on the action performed
        const message = action === 'liked' ? "Audio liked successfully" : "Audio unliked successfully";

        return responseSuccess(res,message);
    } catch (err) {
        return responseError(res, err.message, 400, "Failed to like/unlike audio");
    }
}

import nodemailer from 'nodemailer';
import { VIEWS_DIR } from "@/config";
import { APP_URL_API } from "@/config";
import path from 'path';
import ejs from 'ejs';
import { User } from "../model/user.model";
import { genTokenp } from "@/utils/helpers/gentoken";

export const sendEmail = async (req, res) => {
    const email = req.query.email;
    const token = genTokenp(email, SECRET_KEY_USER, 130);
    const resetLink = APP_URL_API +'user'+`/edit-password?token=${token}`;
    const templatePath = path.join(VIEWS_DIR, 'main-resetPassword.ejs');
    const emailTemplate = await ejs.renderFile(templatePath, { resetLink });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vm28.dev@gmail.com',
            pass: 'komr gzcw ervg svuw'
        }
    });

    // Gửi email với EJS
    const mailOptions = {
        from: 'vm28.dev@gmail.com',
        to: email,
        subject: 'Reset Password',
        html: emailTemplate
    };

    try {
        await transporter.sendMail(mailOptions);
        res.render('sendEmailSuccess');
    } catch (error) {
        console.log(error);
        res.status(500).send('Có lỗi xảy ra khi gửi email.');
    }
};

import jwt from 'jsonwebtoken';
export const editPassword = async (req, res) => {
    const { token } = req.query;
  
    if (!token) {
        return res.status(400).send('Token và mật khẩu là bắt buộc.');
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY_USER);
        const email = decoded.email;

        const user = await User.findOne({ email: email });
        console.log(user);
        if(!user){
            return responseError(res,null,404,"user not found");
        }
        else{
            return res.render('editPassword');
        }

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(400).send('Token không hợp lệ hoặc đã hết hạn.');
    }
};

import { generatePassword } from "@/utils/handlers/hashPassword";
export const savePassword = async (req, res) => {
    const { password } = req.body;
    const {token} = req.body;
    if(!token || !password){
        return responseSuccess(res,null,403,"password và token không thể chống");
    }
    else{
        try {
            const decoded = jwt.verify(token, SECRET_KEY_USER);
            const email = decoded.email;
            const user = await User.findOneAndUpdate({ email: email }, { password: generatePassword(password) });
            if(!user){
                return responseError(res,null,404,"update password failed");
            }
            else{
                return responseSuccess(res,null,200);
            }
        } catch (error) {
            return responseError(res,null,403,"đã hết thời gian chờ thử lại");
        }
    }
};
