import { responseSuccess } from "@/utils/helpers/response.helpers"
import * as cateService from "@/app/services/category.service"

export const filter = async (req,res,next) =>{
    const categories = await cateService.filter(req.query);
    return await responseSuccess(res,categories);
}

export const detail = async (req,res,next) =>{
    const category = await cateService.detail(req.body);
    return await responseSuccess(res,category);
}

export const create = async (req,res,next) =>{
    const category = await cateService.create(req.body);
    return await responseSuccess(res,category);
}

export const update = async (req,res,next) =>{
    const category = await cateService.update(req.body);
    return await responseSuccess(res,category);
}

export const remove = async (req,res,next) =>{
    const category = await cateService.remove(req.body);
    return await responseSuccess(res,category);
}



