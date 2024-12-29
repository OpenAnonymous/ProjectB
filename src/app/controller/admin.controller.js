import { responseSuccess,responseError } from "../../utils/helpers/response.helpers";
import { create as createAdmin, login as loginAdmin,remove as removeAdmin } from "../services/admin.service";
import { genToken } from "@/utils/helpers/generateToken.helpers";
import { comparePassword} from "@/utils/handlers/hashPassword";
import cache from "@/storage/cache/cache";
import { SECRET_KEY_ADMIN ,APP_URL_API} from "@/config";
import { Admin } from "../model/admin.model";
import * as cateService from "@/app/services/category.service";

export const dashboard = async (req,res,next) =>{
    try {
        const categories = await cateService.getAllCategories();
        res.render("layout",{
            title : "dashboard",
            body: 'category',
            data : {categories: categories}
        });
    } catch (err) {
        res.status(500).send('Có lỗi xảy ra khi lấy danh mục');
        next(err);
    }
}

export const create = async (req, res, next) =>{
    try {
        const response = await createAdmin(req.body);
        if(response){
             await responseSuccess(res, response );
        }
        else{
            throw new Error("cant create admin acc");
        }
        
    } catch (error) {
        next(error);
    }
}

export const loginPage = async (req,res,next) =>{
    try {
        res.render("layout",{
            title : "Đăng nhập",
            body: 'login',
            data : {API_URL:APP_URL_API}
        });
    } catch (err) {
        res.status(500).send('Có lỗi xảy ra tải trangtrang');
        next(err);
    }
}
export const login = async (req, res,next) =>{
    try{
        
        const admin = await loginAdmin(req.body);
        if(comparePassword(req.body.password,admin.password)){
            responseSuccess(res, {
                email : admin.email,
                password : admin.password,
                token :genToken(req.body,SECRET_KEY_ADMIN)
            });
        }
        else{
            responseError(res,{}, 401, "mật khẩu hoặc email chưa chính xác");
        }
    }
    catch(error){
        next(error);
    }   
}

export const remove = async(req,res)=>{
    const curentAdmin = req.curentAdmin;
    const admin = await removeAdmin({
        email:curentAdmin.email
    });
    if(admin){
        responseSuccess(res,admin);
    }
    else{
        responseError(res, 400, "không tìm thấy admin");
    }   
}


export const detail = async (req,res,next)=>{
    const {email} = req.curentAdmin;
    const admin = await Admin.findOne({email : email});
    if(!admin) return responseError(res,null,400,"không tìm thấy admin");
    return responseSuccess(res,admin);
}
export const logout = async (req,res)=>{
    const token = req.headers['authorization'].replace(/Bearer/, '').trim();
    const exp = req.curentAdmin.exp;
    const ttl = exp-Math.floor(Date.now() / 1000);
    cache.addCache(token,token,ttl);
    responseSuccess(res,null);
}