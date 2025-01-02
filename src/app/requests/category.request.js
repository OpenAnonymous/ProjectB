import { AsyncValidate } from "@/utils/handlers/AsyncValidate";
import { tryValidateOrDefault } from "@/utils/helpers/validate.helper";
import { Category } from "../model/category.model";
import { isValidObjectId } from "mongoose";

import Joi from "joi";

export const filter = Joi.object({
    q : tryValidateOrDefault(Joi.string().trim(),""),
    page : tryValidateOrDefault(Joi.number().integer().min(1),1),
    limit : tryValidateOrDefault(Joi.number().integer().min(5),20),
    field: tryValidateOrDefault(Joi.valid("created_at", "name", "description"), "created_at"),
    sort : tryValidateOrDefault(Joi.number().integer().valid(1,-1),1)
});

export const create = Joi.object({
    name : Joi.string().min(6).max(40).required().label("tên danh mục").custom((value,helpers)=>{
        return new AsyncValidate(value, async function(){
            const category = await Category.findOne({name : value});
            return !category ? value : helpers.error("any.exists");
        })
    }),
    description : Joi.string().min(6).max(255).required().label("mô tả danh mục")
}); 

export const update = Joi.object({
    id : Joi.string().required().custom((value,helpers)=>{
        if(!isValidObjectId(value)){
            return helpers.error("any.invalid")
        }
        return new AsyncValidate(value, async function () {
            const category = await Category.findById(value);
            return category ? value : helpers.error("any.notFound");
        })
    }),
    name : Joi.string().min(6).max(40).label("tên danh mục"),
    description : Joi.string().min(6).max(255).label("mô tả danh mục")
});


export const detail = Joi.object({
    id : Joi.string().required().custom((value,helpers)=>{
        if(!isValidObjectId(value)){
            return helpers.error("any.invalid")
        }
        return new AsyncValidate(value, async function (){
            const category = await Category.findById(value);
            return  category ? value : helpers.error("any.notFound");
        })
    })
})


