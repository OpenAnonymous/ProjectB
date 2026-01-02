import { AsyncValidate } from "@/utils/handlers/AsyncValidate";
import { User } from "../model/user.model";
import Joi from "joi";
import { Admin } from "../model/admin.model";
import { isValidObjectId } from "mongoose";
import Audio from "../model/audio.model";

export const userCreate = Joi.object({
    name : Joi.string().min(6).max(50).label("tên người dùng").allow('', null),
    email : Joi.string().email().required().label("email").custom((value,helpers)=>
        new AsyncValidate(value,async function(){
            const admin = await Admin.findOne({email: value});
            const user = await User.findOne({email : value});
            return admin || user ? helpers.error("any.exists") : value;

        })
    ),    
    password : Joi.string().min(8).max(50).required().label("mật khẩu"),
    bio : Joi.string().max(500).label("mô tả user").allow('', null),
    avatar : Joi.object().label("file avatar của user")
});

export const userUpdate = Joi.object({
    name : Joi.string().min(4).max(50).label("tên người dùng").allow('', null),
    email : Joi.string().email().label("email").allow('', null).custom((value,helpers)=>
        new AsyncValidate(value,async function(){
            const admin = await Admin.findOne({email: value});
            const user = await User.findOne({email : value});
            return admin || user ? helpers.error("any.exists") : value;

        })
    ), 
    bio : Joi.string().max(500).label("mô tả user").allow('', null),
    avatar : Joi.object().label("file avatar của user")
});

export const userRemove = Joi.object({
    id: Joi.string().required().label("id người dùng").custom((value,helpers)=>
        new AsyncValidate(value,async function(){
            if(!isValidObjectId(value)){
                return helpers.error("any.invalid")
            }
            const user = await User.findById(value);
            return  user ? value : helpers.error("any.notFound");
        })
    )
})

//login

export const userLogin = Joi.object({
    email:Joi.string().email().required().custom((value,helpers) => 
        new AsyncValidate(value,async function(){
            const user = await User.findOne({email : value});
            return  user ? value : helpers.error("any.notFound");
        })
    ),
    password:Joi.string().min(6).max(50).required()
})

export const likeAudio = Joi.object({
    audioId: Joi.string().required().label("Audio ID").custom((value, helpers) => {
        if (!isValidObjectId(value)) {
            return helpers.error("any.invalid");
        }
        return new AsyncValidate(value, async function () {
            const audio = await Audio.findById(value);
            return audio ? value : helpers.error("any.notFound");
        });
    })
});

